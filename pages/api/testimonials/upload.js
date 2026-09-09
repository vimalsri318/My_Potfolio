import formidable from 'formidable'
import { v2 as cloudinary } from 'cloudinary'

export const config = { api: { bodyParser: false } }

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Public client photo/logo upload for testimonial submissions
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const form = formidable({
    multiples: false,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB limit
  })

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).json({ error: 'Failed to process upload: ' + String(err.message || err) })

    const fileField = files.file || files.photo || files.avatar
    const file = Array.isArray(fileField) ? fileField[0] : fileField
    if (!file) return res.status(400).json({ error: 'No image file was provided' })

    const mime = file.mimetype || ''
    if (!mime.startsWith('image/')) {
      return res.status(400).json({ error: 'Only image files (JPG, PNG, WebP) are allowed' })
    }

    try {
      const result = await cloudinary.uploader.upload(file.filepath, {
        folder: 'portfolio/testimonials',
        transformation: [
          { width: 400, height: 400, crop: 'limit', quality: 'auto', fetch_format: 'auto' },
        ],
      })
      return res.status(200).json({ url: result.secure_url })
    } catch (uploadError) {
      console.error('Testimonial Cloudinary upload error:', uploadError)
      return res.status(500).json({ error: 'Failed to upload photo to cloud storage' })
    }
  })
}
