// Renders the narrated product films and everything the case-study pages use:
//
//   out/films/<slug>.mp4                         master (CRF 18, for social)
//   out/films/<slug>-web.mp4                     web copy (CRF 26, faststart) → uploaded by scripts/upload_films.cjs
//   ../public/assets/img/projects/<slug>/case/architecture.jpg   diagram still
//   ../public/assets/img/projects/<slug>/case/*.jpg               gallery: real screenshots + panel-<n>.jpg designed screens
//   out/films/manifest.json                      {slug: {seconds, poster, gallery:[{src, kind, caption, cap}]}}
//
// Usage: node render_films.mjs [slug ...] [--only=film|diagram|gallery]
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const only = args.find((a) => a.startsWith("--only="))?.split("=")[1];
const want = (k) => !only || only.split(",").includes(k);
const { FILM_SLUGS } = await import("./src/films/list.ts").catch(() => ({ FILM_SLUGS: null }));
const listed = FILM_SLUGS ?? fs.readdirSync("public/films").filter((d) => fs.existsSync(`public/films/${d}/script.json`));
const slugs = args.filter((a) => !a.startsWith("--")).length ? args.filter((a) => !a.startsWith("--")) : listed;

const OUT = path.resolve("out/films");
fs.mkdirSync(OUT, { recursive: true });
const manifestPath = path.join(OUT, "manifest.json");
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, "utf8")) : {};
const strip = (s) => s.replace(/[[\]]/g, "");

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });

for (const slug of slugs) {
  const t0 = Date.now();
  const caseDir = path.resolve("..", "public/assets/img/projects", slug, "case");
  fs.mkdirSync(caseDir, { recursive: true });
  const film = await selectComposition({ serveUrl, id: `Film-${slug}`, inputProps: { slug } });
  const { script, plan } = film.props;
  const entry = (manifest[slug] = manifest[slug] || {});
  entry.seconds = +(film.durationInFrames / 30).toFixed(1);

  if (want("film")) {
    const master = path.join(OUT, `${slug}.mp4`);
    await renderMedia({ composition: film, serveUrl, codec: "h264", crf: 18, pixelFormat: "yuv420p", audioCodec: "aac", audioBitrate: "192k", outputLocation: master, inputProps: { slug } });
    execFileSync("ffmpeg", ["-v", "error", "-y", "-i", master, "-c:v", "libx264", "-preset", "slow", "-crf", "26", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", path.join(OUT, `${slug}-web.mp4`)]);
    // Poster: end of the intro scene, product on screen.
    const intro = script.scenes.findIndex((s) => s.kind === "intro");
    const ps = plan.scenes[intro >= 0 ? intro : 1];
    entry.posterSecond = +((ps.start + ps.dur - 20) / 30).toFixed(2);
  }

  if (want("diagram") && script.diagram) {
    const d = await selectComposition({ serveUrl, id: `Diagram-${slug}`, inputProps: { slug } });
    await renderStill({ composition: d, serveUrl, output: path.join(caseDir, "architecture.jpg"), frame: 0, imageFormat: "jpeg", jpegQuality: 88, scale: 1.25, inputProps: { slug } });
  }

  if (want("gallery")) {
    // The case-study gallery: what the product looks like, not frames of the
    // film. Real screenshots go in as they are (tall scroll captures trimmed to
    // their first 16:10 screen), phone captures stay phone-shaped, and designed
    // media (terminal, chat, cards, the project's stage) are rendered on their
    // own, full frame. `cap` points at case.json sceneCaptions (one per media
    // item of the feature/flow scenes, in order).
    for (const f of fs.readdirSync(caseDir)) if (/^(scene|panel)-\d+\.jpg$/.test(f)) fs.rmSync(path.join(caseDir, f));
    entry.gallery = [];
    delete entry.screens;
    const seen = new Set();
    const copy = (src, kind, caption, cap) => {
      const file = path.basename(src);
      if (seen.has(file)) return;
      seen.add(file);
      const from = path.resolve("public", src);
      const to = path.join(caseDir, file);
      if (kind === "desktop") {
        // Keep the first screen of a tall capture (16:10 at its width).
        execFileSync("python3", ["-c", "import sys;from PIL import Image;i=Image.open(sys.argv[1]).convert('RGB');h=min(i.height,round(i.width/1.6));i.crop((0,0,i.width,h)).save(sys.argv[2],quality=86)", from, to]);
      } else fs.copyFileSync(from, to);
      entry.gallery.push({ src: `/assets/img/projects/${slug}/case/${file}`, kind, caption, cap });
    };
    let cap = -1;
    let n = 0;
    for (const [i, scene] of script.scenes.entries()) {
      if (!["intro", "feature", "flow"].includes(scene.kind)) continue;
      const media = Array.isArray(scene.media) ? scene.media : scene.media ? [scene.media] : [];
      for (const [k, m] of media.entries()) {
        if (scene.kind !== "intro") cap += 1;
        const caption = strip(scene.kind === "intro" ? scene.tagline : scene.headline);
        const c = scene.kind === "intro" ? null : cap;
        if (m.type === "image" && (m.frame ?? "browser") === "browser") copy(m.src, "desktop", caption, c);
        else if (m.type === "image" && m.frame === "phone") copy(m.src, "phone", caption, c);
        else if (m.type === "phones") m.srcs.forEach((src) => copy(src, "phone", caption, c));
        else if (m.type !== "image") {
          n += 1;
          const file = `panel-${n}.jpg`;
          const panel = await selectComposition({ serveUrl, id: "Panel", inputProps: { slug, scene: i, item: k } });
          await renderStill({ composition: panel, serveUrl, output: path.join(caseDir, file), frame: 200, imageFormat: "jpeg", jpegQuality: 86, inputProps: { slug, scene: i, item: k } });
          entry.gallery.push({ src: `/assets/img/projects/${slug}/case/${file}`, kind: "desktop", caption, cap: c });
        }
      }
    }
  }
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`${slug}: ${entry.seconds}s film, ${entry.gallery?.length ?? 0} gallery images (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
}
