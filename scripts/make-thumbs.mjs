// node scripts/make-thumbs.mjs — writes small WebP thumbnails (thumb.webp,
// thumb-m.webp) next to each project's images, for the landing page device
// mock-ups. Needs `cwebp` (brew install webp).
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { pickScreens, thumbPaths } from '../lib/mock.mjs'

const projects = JSON.parse(readFileSync(new URL('../data/projects.json', import.meta.url)))
const out = (p) => new URL('../public' + p, import.meta.url).pathname
const make = (src, dest, width) =>
  execFileSync('cwebp', ['-quiet', '-q', '78', '-m', '6', '-resize', String(width), '0', out(src), '-o', out(dest)])

for (const p of projects) {
  const pick = pickScreens(p)
  const t = thumbPaths(pick)
  if (t.desktop) make(pick.desktop, t.desktop, 1000)
  if (t.phone) make(pick.phone, t.phone, 360)
  console.log(p.slug, pick.desktop ? 'desktop' : '-', pick.phone ? 'phone' : '-')
}
