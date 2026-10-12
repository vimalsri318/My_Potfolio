// Usage: node scripts/bench.mjs [baseUrl]   (default: live site)
// Static page-weight benchmark: what the home page makes a visitor download.
import { gzipSync } from 'node:zlib'
const base = (process.argv[2] || 'https://vimalsrinivasan.vercel.app').replace(/\/$/, '')
const kb = (n) => (n / 1024).toFixed(0) + ' KB'
const get = async (p) => {
  const r = await fetch(base + p)
  const b = Buffer.from(await r.arrayBuffer())
  return { r, b }
}
const { r: hr, b: html } = await get('/')
const text = html.toString()
const nd = (text.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/) || [])[1] || ''
const js = [...new Set(text.match(/\/_next\/static\/[^"']+\.js/g) || [])]
let jsBytes = 0
for (const u of js) jsBytes += gzipSync((await get(u)).b).length
const hero = (text.match(/\/assets\/img\/home-perfil[^"'\s&]*/) || [])[0]
const decode = (s) => decodeURIComponent(s)
let heroBytes = 0, heroType = '-'
if (hero) {
  // next/image URLs look like /_next/image?url=...&w=..&q=..; fetch what the browser would
  const m = text.match(/\/_next\/image\?[^"'\s]*home-perfil[^"'\s]*/)
  const { r, b } = await get(m ? m[0].replace(/&amp;/g, '&').split(' ')[0] : hero)
  heroBytes = b.length; heroType = r.headers.get('content-type')
}
const sample = ['/assets/img/projects/ardor/cover.jpg', '/assets/video/projects/ardor.mp4', '/assets/fonts/Batangas.otf']
const cc = {}
for (const s of sample) cc[s] = (await fetch(base + s, { method: 'HEAD' })).headers.get('cache-control')
console.log(`\nBenchmark: ${base}`)
console.log(`HTML document          ${kb(html.length)} (gzip ${kb(gzipSync(html).length)})`)
console.log(`  of which __NEXT_DATA__ ${kb(nd.length)}`)
console.log(`JS chunks (${js.length}, gzip)    ${kb(jsBytes)}`)
console.log(`Hero portrait          ${kb(heroBytes)}  (${heroType})`)
console.log(`Critical bytes total   ${kb(gzipSync(html).length + jsBytes + heroBytes)}`)
for (const [k, v] of Object.entries(cc)) console.log(`cache ${k.padEnd(40)} ${v}`)
