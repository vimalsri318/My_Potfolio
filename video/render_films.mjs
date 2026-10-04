// Renders the narrated product films and everything the case-study pages use:
//
//   out/films/<slug>.mp4                         master (CRF 18, for social)
//   out/films/<slug>-web.mp4                     web copy (CRF 26, faststart) → uploaded by scripts/upload_films.cjs
//   ../public/assets/img/projects/<slug>/case/architecture.jpg   diagram still
//   ../public/assets/img/projects/<slug>/case/scene-<n>.jpg      one still per feature/flow scene
//   out/films/manifest.json                      {slug: {seconds, poster, screens:[{src, caption}]}}
//
// Usage: node render_films.mjs [slug ...] [--only=film|diagram|screens]
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

  if (want("screens")) {
    entry.screens = [];
    let n = 0;
    for (const [i, scene] of script.scenes.entries()) {
      if (scene.kind !== "feature" && scene.kind !== "flow") continue;
      const s = plan.scenes[i];
      const media = Array.isArray(scene.media) ? scene.media : scene.media ? [scene.media] : [null];
      // One still per media item in the scene (each shows a different screen).
      // Media switch at each line's start (as in FeatureScene); with fewer lines than
      // media, switches are spread evenly through the scene.
      const at = media.map((_, k) => (k === 0 ? 8 : s.beats[k] ?? Math.round((s.dur * k) / media.length)));
      const points = media.length > 1 ? at.map((a, k) => (a + (k + 1 < media.length ? at[k + 1] : s.dur)) / 2) : [s.dur * 0.82];
      for (const p of points) {
        n += 1;
        const file = `scene-${n}.jpg`;
        await renderStill({ composition: film, serveUrl, output: path.join(caseDir, file), frame: Math.round(s.start + p), imageFormat: "jpeg", jpegQuality: 84, scale: 0.84, inputProps: { slug } });
        entry.screens.push({ src: `/assets/img/projects/${slug}/case/${file}`, caption: `${strip(scene.headline)}` });
      }
    }
  }
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`${slug}: ${entry.seconds}s film, ${entry.screens?.length ?? 0} screens (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
}
