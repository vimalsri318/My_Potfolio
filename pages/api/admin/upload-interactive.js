import fs from 'fs'
import path from 'path'
import formidable from 'formidable'
import AdmZip from 'adm-zip'
import { guardAdmin } from '../../../lib/adminGuard'

// Uploads an interactive walkthrough for a research entry. Accepts either:
//   • a .zip of a built app (its files land in /public/research/<slug>/), or
//   • a single .html file (saved as /public/research/<slug>/index.html).
// Returns { src } — the path to store on research.interactive.src.
export const config = { api: { bodyParser: false } }

function safeSlug(slug) {
  return String(slug || '')
    .toLowerCase()
    .replace(/[^a-z0-9\-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// Some zips wrap everything in a single top-level folder (e.g. dist/).
// If so, flatten it so index.html sits at the root of the slug folder.
function flattenSingleRoot(dir) {
  const entries = fs.readdirSync(dir)
  if (entries.length === 1) {
    const only = path.join(dir, entries[0])
    if (fs.statSync(only).isDirectory() && !fs.existsSync(path.join(dir, 'index.html'))) {
      for (const name of fs.readdirSync(only)) {
        fs.renameSync(path.join(only, name), path.join(dir, name))
      }
      fs.rmdirSync(only)
    }
  }
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

    const slug = safeSlug(Array.isArray(fields.slug) ? fields.slug[0] : fields.slug)
    if (!slug) return res.status(400).json({ error: 'A slug is required' })

    const fileField = files.file
    const file = Array.isArray(fileField) ? fileField[0] : fileField
    if (!file) return res.status(400).json({ error: 'No file provided' })

    const destDir = path.join(process.cwd(), 'public', 'research', slug)
    const original = (file.originalFilename || '').toLowerCase()

    try {
      // Replace any previous bundle so removed files don't linger.
      fs.rmSync(destDir, { recursive: true, force: true })
      fs.mkdirSync(destDir, { recursive: true })

      if (original.endsWith('.zip')) {
        const zip = new AdmZip(file.filepath)
        zip.extractAllTo(destDir, true)
        flattenSingleRoot(destDir)
        if (!fs.existsSync(path.join(destDir, 'index.html'))) {
          return res.status(400).json({
            error: 'Zip has no index.html at its root (or in a single top folder).',
          })
        }
      } else if (original.endsWith('.html') || original.endsWith('.htm')) {
        fs.copyFileSync(file.filepath, path.join(destDir, 'index.html'))
      } else {
        return res.status(400).json({ error: 'Upload a .zip bundle or a single .html file.' })
      }
    } catch (e) {
      return res.status(500).json({ error: String(e) })
    } finally {
      fs.rmSync(file.filepath, { force: true })
    }

    return res.status(200).json({ src: `/research/${slug}/index.html` })
  })
}
