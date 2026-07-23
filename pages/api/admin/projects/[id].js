import { guardAdmin } from '../../../../lib/adminGuard'
import { updateItem, deleteItem } from '../../../../lib/contentStore'

export default function handler(req, res) {
  if (!guardAdmin(req, res)) return
  const { id } = req.query

  if (req.method === 'PUT') {
    const updated = updateItem('projects', id, req.body)
    if (!updated) return res.status(404).json({ error: 'Not found' })
    return res.status(200).json(updated)
  }

  if (req.method === 'DELETE') {
    const ok = deleteItem('projects', id)
    if (!ok) return res.status(404).json({ error: 'Not found' })
    return res.status(200).json({ ok: true })
  }

  res.setHeader('Allow', ['PUT', 'DELETE'])
  return res.status(405).end()
}
