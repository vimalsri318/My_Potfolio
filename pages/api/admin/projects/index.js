import { guardAdmin } from '../../../../lib/adminGuard'
import { adminList, adminCreate } from '../../../../lib/contentStore'

export default async function handler(req, res) {
  if (!guardAdmin(req, res)) return
  try {
    if (req.method === 'GET') return res.status(200).json(await adminList('projects'))
    if (req.method === 'POST') return res.status(201).json(await adminCreate('projects', req.body))
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) })
  }
  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).end()
}
