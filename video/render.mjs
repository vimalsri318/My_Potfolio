// Renders everything the site uses from this Remotion project:
//   covers  → ../public/assets/img/projects/<dir>/cover.jpg   (1600×1000 still of each clip)
//   clips   → ../public/assets/video/projects/<slug>.mp4      (1280×800, 5 s, muted loop)
//   reel    → ../public/assets/video/showreel.mp4 (+ -vertical.mp4, poster jpgs)
// Usage: node render.mjs [covers|clips|reel|all] [--only=<slug,...>] [--out=<dir>] [--scale=<n>]
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const args = process.argv.slice(2);
const what = args.find((a) => !a.startsWith("--")) || "all";
const flag = (k) => args.find((a) => a.startsWith(`--${k}=`))?.split("=")[1];
const only = flag("only")?.split(",");
const outRoot = flag("out");
const previewScale = flag("scale") ? Number(flag("scale")) : null;

const SITE = path.resolve("..", "public", "assets");
// Folder names under public/assets/img/projects that predate the slug.
const DIR = { "amretri-healthcare": "amretri" };
const COVER_FRAME = 140;

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const slugs = (await import("./slugs.json", { with: { type: "json" } })).default.filter((s) => !only || only.includes(s));

const ensure = (f) => fs.mkdirSync(path.dirname(f), { recursive: true });

if (what === "covers" || what === "all") {
  for (const slug of slugs) {
    const composition = await selectComposition({ serveUrl, id: `Clip-${slug}` });
    const output = outRoot ? path.join(outRoot, `cover-${slug}.jpg`) : path.join(SITE, "img/projects", DIR[slug] || slug, "cover.jpg");
    ensure(output);
    await renderStill({ composition, serveUrl, output, frame: COVER_FRAME, imageFormat: "jpeg", jpegQuality: 86, scale: previewScale ?? 1.25 });
    console.log("cover", slug, "→", output);
  }
}

if (what === "clips" || what === "all") {
  for (const slug of slugs) {
    const composition = await selectComposition({ serveUrl, id: `Clip-${slug}` });
    const output = outRoot ? path.join(outRoot, `${slug}.mp4`) : path.join(SITE, "video/projects", `${slug}.mp4`);
    ensure(output);
    await renderMedia({ composition, serveUrl, codec: "h264", crf: 28, outputLocation: output, muted: true, pixelFormat: "yuv420p", scale: previewScale ?? 1 });
    console.log("clip", slug, "→", output);
  }
}

if (what === "reel" || what === "all") {
  for (const [id, name] of [["Showreel", "showreel"], ["ShowreelVertical", "showreel-vertical"]]) {
    const composition = await selectComposition({ serveUrl, id });
    const dir = outRoot || path.join(SITE, "video");
    const output = path.join(dir, `${name}.mp4`);
    ensure(output);
    await renderMedia({ composition, serveUrl, codec: "h264", crf: 26, outputLocation: output, muted: true, pixelFormat: "yuv420p", scale: previewScale ?? 1 });
    // Poster: the first project segment, fully on screen.
    await renderStill({ composition, serveUrl, output: path.join(dir, `${name}-poster.jpg`), frame: 140, imageFormat: "jpeg", jpegQuality: 84, scale: previewScale ?? 1 });
    console.log("reel", id, "→", output);
  }
}
