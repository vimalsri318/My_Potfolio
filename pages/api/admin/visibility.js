import { guardAdmin } from '../../../lib/adminGuard'

// Reads/writes the visibility state in Supabase using the service_role key
// (server-side, local admin only). Section toggles + per-item published.
function adminDb() {
  const { createClient } = require('@supabase/supabase-js')
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
}

export default async function handler(req, res) {
  if (!guardAdmin(req, res)) return

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return res.status(500).json({ error: 'Supabase service key not configured in .env' })
  const db = adminDb()

  if (req.method === 'GET') {
    const [{ data: sections, error: e1 }, { data: content, error: e2 }] = await Promise.all([
      db.from('site_sections').select('*').order('sort', { ascending: true }),
      db.from('content_flags').select('*'),
    ])
    if (e1 || e2) return res.status(500).json({ error: (e1 || e2).message })
    return res.status(200).json({ sections: sections || [], content: content || [] })
  }

  if (req.method === 'POST') {
    const { kind } = req.body || {}
    if (kind === 'section') {
      const { key: secKey, enabled } = req.body
      const { error } = await db.from('site_sections').update({ enabled: !!enabled }).eq('key', secKey)
      if (error) return res.status(500).json({ error: error.message })
      return res.status(200).json({ ok: true })
    }
    if (kind === 'content') {
      const { type, slug, published } = req.body
      if (!type || !slug) return res.status(400).json({ error: 'type and slug are required' })
      const { error } = await db
        .from('content_flags')
        .upsert({ type, slug, published: !!published }, { onConflict: 'type,slug' })
      if (error) return res.status(500).json({ error: error.message })
      return res.status(200).json({ ok: true })
    }
    return res.status(400).json({ error: 'Unknown kind' })
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).end()
}
