import { guardAdmin } from '../../../lib/adminGuard'

// Reads/writes the visibility state in Supabase using the service_role key
// (server-side, local admin only). Section toggles + per-item published.
//
// The admin edits the DRAFT copy (`enabled_draft` / `published_draft`), so
// toggles stay local until you hit Publish (pages/api/admin/publish.js copies
// draft -> live). GET returns the draft-effective value in the usual fields so
// the managers show what you're staging.
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
    // Surface the draft-effective value as `enabled` / `published` so the admin
    // UI edits the draft, and keep the raw live values for status comparison.
    const secs = (sections || []).map((s) => ({
      ...s,
      enabled: s.enabled_draft != null ? s.enabled_draft : s.enabled,
      enabled_live: s.enabled,
    }))
    const flags = (content || []).map((f) => ({
      ...f,
      published: f.published_draft != null ? f.published_draft : f.published,
      published_live: f.published,
    }))
    return res.status(200).json({ sections: secs, content: flags })
  }

  if (req.method === 'POST') {
    const { kind } = req.body || {}
    if (kind === 'section') {
      const { key: secKey, enabled } = req.body
      const { error } = await db.from('site_sections').update({ enabled_draft: !!enabled }).eq('key', secKey)
      if (error) return res.status(500).json({ error: error.message })
      return res.status(200).json({ ok: true })
    }
    if (kind === 'content') {
      const { type, slug, published } = req.body
      if (!type || !slug) return res.status(400).json({ error: 'type and slug are required' })
      const { error } = await db
        .from('content_flags')
        .upsert({ type, slug, published_draft: !!published }, { onConflict: 'type,slug' })
      if (error) return res.status(500).json({ error: error.message })
      return res.status(200).json({ ok: true })
    }
    return res.status(400).json({ error: 'Unknown kind' })
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).end()
}
