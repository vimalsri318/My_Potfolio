import formidable from 'formidable'
import { v2 as cloudinary } from 'cloudinary'
import { guardAdmin } from '../../../lib/adminGuard'

export const config = { api: { bodyParser: false } }

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default async function handler(req, res) {
  if (!guardAdmin(req, res)) return
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end()
  }

  const form = formidable({ multiples: false, keepExtensions: true })

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: String(err) })

    const folderRaw = Array.isArray(fields.folder) ? fields.folder[0] : fields.folder
    const folder = (folderRaw || 'img').replace(/\.\./g, '').replace(/^\/+/, '')

    const fileField = files.file
    const file = Array.isArray(fileField) ? fileField[0] : fileField
    if (!file) return res.status(400).json({ error: 'No file provided' })

    try {
      // Upload the file path directly to Cloudinary
      const result = await cloudinary.uploader.upload(file.filepath, {
        folder: `portfolio/${folder}`, // keep it organized within a portfolio folder
      })
      
      // Cloudinary returns the secure HTTPS URL
      return res.status(200).json({ path: result.secure_url })
    } catch (uploadError) {
      console.error('Cloudinary upload error:', uploadError)
      return res.status(500).json({ error: 'Failed to upload to Cloudinary' })
    }
  })
}
