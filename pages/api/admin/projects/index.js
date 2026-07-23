import { guardAdmin } from '../../../../lib/adminGuard'
import { readCollection, createItem } from '../../../../lib/contentStore'

export default function handler(req, res) {
  if (!guardAdmin(req, res)) return

  if (req.method === 'GET') {
    return res.status(200).json(readCollection('projects'))
  }

  if (req.method === 'POST') {
    const created = createItem('projects', req.body)
    return res.status(201).json(created)
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).end()
}
