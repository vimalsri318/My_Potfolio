// Upload rendered product films to Cloudinary and record their URLs.
//
//   node scripts/upload_films.cjs [slug ...]
//
// Reads video/out/films/<slug>-web.mp4 + manifest.json (from video/render_films.mjs),
// uploads to portfolio/films/<slug> (overwriting), and writes `film` and a
// Cloudinary-generated `filmPoster` (frame at the end of the intro) back into
// the manifest. Apply them to data/projects.json with scripts/apply_case_studies.cjs.
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env'), quiet: true })
const env = Object.fromEntries(Object.entries(process.env).map(([k, v]) => [k.trim(), v]))
const cloudinary = require('cloudinary').v2
cloudinary.config({ cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, api_key: env.NEXT_PUBLIC_CLOUDINARY_API_KEY, api_secret: env.CLOUDINARY_API_SECRET, secure: true })

const OUT = path.join(__dirname, '../video/out/films')
const manifestPath = path.join(OUT, 'manifest.json')

async function main() {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  const slugs = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(manifest)
  for (const slug of slugs) {
    const file = path.join(OUT, `${slug}-web.mp4`)
    if (!fs.existsSync(file)) { console.warn(`✗ ${slug}: no ${file}`); continue }
    const res = await cloudinary.uploader.upload(file, {
      resource_type: 'video',
      folder: 'portfolio/films',
      public_id: slug,
      overwrite: true,
      invalidate: true,
    })
    const so = manifest[slug].posterSecond ?? 8
    manifest[slug].film = res.secure_url
    // Cloudinary renders the poster from the video itself: same path, .jpg, start offset.
    manifest[slug].filmPoster = res.secure_url.replace('/video/upload/', `/video/upload/so_${so},w_1600,q_auto/`).replace(/\.mp4$/, '.jpg')
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
    console.log(`✓ ${slug}: ${(res.bytes / 1e6).toFixed(1)} MB → ${res.secure_url}`)
  }
}
main().catch((e) => { console.error(e); process.exit(1) })
