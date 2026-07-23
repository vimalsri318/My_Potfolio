import fs from 'fs'
import path from 'path'
import formidable from 'formidable'
import { guardAdmin } from '../../../lib/adminGuard'

// Image / file upload. Writes into /public/assets/<folder> and returns the
// public path (e.g. /assets/img/foo.png) to store on the content item.
export const config = { api: { bodyParser: false } }

function safeName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export default async function handler(req, res) {
  if (!guardAdmin(req, res)) return
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end()
  }

  const form = formidable({ multiples: false, keepExtensions: true })

  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ error: String(err) })

    const folderRaw = Array.isArray(fields.folder) ? fields.folder[0] : fields.folder
    // Only ever write inside public/assets, never escape it.
    const folder = (folderRaw || 'img').replace(/\.\./g, '').replace(/^\/+/, '')
    const destDir = path.join(process.cwd(), 'public', 'assets', folder)
    fs.mkdirSync(destDir, { recursive: true })

    const fileField = files.file
    const file = Array.isArray(fileField) ? fileField[0] : fileField
    if (!file) return res.status(400).json({ error: 'No file provided' })

    const original = file.originalFilename || file.newFilename || 'upload'
    const ext = path.extname(original)
    const base = safeName(path.basename(original, ext)) || 'upload'
    let filename = `${base}${ext}`
    let target = path.join(destDir, filename)
    // Avoid clobbering an existing asset.
    let i = 1
    while (fs.existsSync(target)) {
      filename = `${base}-${i}${ext}`
      target = path.join(destDir, filename)
      i++
    }

    fs.copyFileSync(file.filepath, target)
    fs.rmSync(file.filepath, { force: true })

    const publicPath = `/assets/${folder}/${filename}`.replace(/\/+/g, '/')
    return res.status(200).json({ path: publicPath })
  })
}
