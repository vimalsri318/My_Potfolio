import { guardAdmin } from '../../../../lib/adminGuard'
import { adminUpdate, adminDelete } from '../../../../lib/contentStore'

export default async function handler(req, res) {
  if (!guardAdmin(req, res)) return
  const { id } = req.query
  try {
    if (req.method === 'PUT') {
      const updated = await adminUpdate('projects', id, req.body)
      if (!updated) return res.status(404).json({ error: 'Not found' })
      return res.status(200).json(updated)
    }
    if (req.method === 'DELETE') {
      const ok = await adminDelete('projects', id)
      if (!ok) return res.status(404).json({ error: 'Not found' })
      return res.status(200).json({ ok: true })
    }
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) })
  }
  res.setHeader('Allow', ['PUT', 'DELETE'])
  return res.status(405).end()
}
