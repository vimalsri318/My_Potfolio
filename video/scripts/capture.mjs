// Full-page screenshots for the films, taken at a real viewport so 100vh
// sections render as visitors see them: scroll through once (so lazy/reveal
// content fires), then capture viewport by viewport and stitch.
//
//   node scripts/capture.mjs <url> <out.jpg> [--mobile] [--max=6000] [--wait=4000] [--hide=".cookie,.chat"]
//                            [--pre="<js run on the site's origin first, e.g. a public demo sign-in>"]
//
// Writes <out.jpg> (full page, 1440 or 390 CSS px wide at 2× scale) and
// <out>-top.jpg (just the first viewport). Never point this at screens with
// real customer data.
import { spawn, execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const [url, out] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const flag = (k, d) => process.argv.find((a) => a.startsWith(`--${k}=`))?.split("=").slice(1).join("=") ?? d;
const mobile = process.argv.includes("--mobile");
const W = mobile ? 390 : 1440;
const H = mobile ? 844 : 900;
const DPR = 2;
const MAX = Number(flag("max", mobile ? 5000 : 7000));
const WAIT = Number(flag("wait", 4000));
const hide = flag("hide", "");
if (!url || !out) throw new Error("usage: capture.mjs <url> <out.jpg> [--mobile]");

const port = 9400 + Math.floor(Math.random() * 400);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "cap-"));
const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", ["--headless=new", `--remote-debugging-port=${port}`, "--hide-scrollbars", "--mute-audio", `--user-data-dir=${profile}`, "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let targets;
for (let k = 0; k < 40 && !targets; k++) {
  try {
    targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  } catch {
    await sleep(250);
  }
}
const ws = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r));
let id = 0;
const pending = new Map();
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    pending.get(m.id)(m);
    pending.delete(m.id);
  }
});
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const js = async (expr) => (await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true })).result?.result?.value;

await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: DPR, mobile });
if (mobile) await send("Emulation.setUserAgentOverride", { userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1" });
const pre = flag("pre", "");
if (pre) {
  await send("Page.navigate", { url: new URL(url).origin + "/" });
  await sleep(2500);
  console.log("pre:", JSON.stringify(await js(`(async () => { ${pre} })()`)));
}
// --stay: the pre-step already put the app where we want it (e.g. client-side
// routing on a static server with no SPA fallback), so don't reload.
if (!(pre && process.argv.includes("--stay"))) await send("Page.navigate", { url });
await sleep(WAIT);
const total = Math.min(MAX, (await js("document.documentElement.scrollHeight")) || H);
for (let y = 0; y < total; y += H / 2) {
  await js(`window.scrollTo(0, ${y})`);
  await sleep(140);
}
await js("window.scrollTo(0,0)");
await sleep(1200);
if (hide) await js(`document.querySelectorAll(${JSON.stringify(hide)}).forEach(e => e.style.visibility='hidden')`);

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "capf-"));
const frames = [];
for (let y = 0, i = 0; y < total; y += H, i++) {
  await js(`window.scrollTo(0, ${y})`);
  await sleep(650);
  // After the first viewport, hide fixed/sticky chrome so it isn't repeated.
  if (i === 1) await js(`[...document.querySelectorAll('body *')].filter(e => ['fixed','sticky'].includes(getComputedStyle(e).position)).forEach(e => e.style.visibility='hidden')`);
  const sy = Math.round(await js("window.scrollY"));
  const r = await send("Page.captureScreenshot", { format: "png" });
  const f = path.join(tmp, `f${i}.png`);
  fs.writeFileSync(f, Buffer.from(r.result.data, "base64"));
  frames.push({ f, y: sy });
  if (sy + H >= total) break;
}
ws.close();
chrome.kill();

// Stitch with Python/PIL (present on this machine).
const py = `
import json,sys
from PIL import Image
fr=json.loads(sys.argv[1]); W=${W}; DPR=${DPR}; total=${total}; out=sys.argv[2]
h=max(f['y'] for f in fr)+${H}
img=Image.new('RGB',(W*DPR,min(h,total)*DPR),'white')
for f in fr: img.paste(Image.open(f['f']).convert('RGB'),(0,f['y']*DPR))
img.save(out,quality=88)
top=Image.open(fr[0]['f']).convert('RGB'); top.save(out.replace('.jpg','-top.jpg'),quality=88)
print(out, img.size)
`;
fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
console.log(execFileSync("python3", ["-c", py, JSON.stringify(frames), path.resolve(out)]).toString().trim());
