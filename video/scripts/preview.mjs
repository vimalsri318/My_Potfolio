// Review a film without rendering it: two stills per scene (mid and late),
// tiled into one contact sheet.  node scripts/preview.mjs <slug> <out.jpg> [--scale=0.4]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const [slug, out] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const scale = Number(process.argv.find((a) => a.startsWith("--scale="))?.split("=")[1] ?? 0.4);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: `Film-${slug}`, inputProps: { slug } });
const { plan } = composition.props;
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "prev-"));
const files = [];
for (const [i, s] of plan.scenes.entries()) {
  for (const f of [0.45, 0.88]) {
    const frame = Math.min(composition.durationInFrames - 1, Math.round(s.start + s.dur * f));
    const file = path.join(tmp, `s${i}-${f}.jpg`);
    await renderStill({ composition, serveUrl, output: file, frame, imageFormat: "jpeg", jpegQuality: 80, scale });
    files.push(file);
  }
}
execFileSync("python3", ["-c", `
import sys
from PIL import Image
fs=sys.argv[2:]; ims=[Image.open(f) for f in fs]; w,h=ims[0].size
sheet=Image.new('RGB',(w*2,h*((len(ims)+1)//2)),'black')
for i,im in enumerate(ims): sheet.paste(im,((i%2)*w,(i//2)*h))
sheet.save(sys.argv[1],quality=82)
`, out, ...files]);
console.log(`${slug}: ${(composition.durationInFrames / 30).toFixed(1)}s, ${plan.scenes.length} scenes → ${out}`);
