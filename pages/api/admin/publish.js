import { guardAdmin } from '../../../lib/adminGuard'

// Promote the local DRAFT to production. Everything the admin edits — project
// & research content, section switches, per-item publish flags — is staged as
// a draft that only the local dev site renders. This endpoint copies those
// drafts into the live columns that production reads (via Supabase + ISR), so
// changes go live with no redeploy.
//
//   GET  -> a summary of what's pending (for the header badge)
//   POST -> publish. Body: {} or { scope:'all' } publishes everything;
//           { type:'project'|'research', id } publishes a single content item.
function db() {
  const { createClient } = require('@supabase/supabase-js')
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  })
}

const changed = (a, b) => JSON.stringify(a) !== JSON.stringify(b)
const COLLECTIONS = { project: 'projects', research: 'research' }

// Rows whose draft differs from what's published (or was never published).
async function pendingContent(client, table) {
  const { data } = await client.from(table).select('id, slug, draft, published')
  return (data || []).filter((r) => r.published == null || changed(r.draft, r.published))
}

export default async function handler(req, res) {
  if (!guardAdmin(req, res)) return
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return res.status(500).json({ error: 'Supabase service key not configured in .env' })
  const client = db()

  try {
    if (req.method === 'GET') {
      const [projects, research, { data: secs }, { data: flags }] = await Promise.all([
        pendingContent(client, 'projects'),
        pendingContent(client, 'research'),
        client.from('site_sections').select('key, enabled, enabled_draft'),
        client.from('content_flags').select('type, slug, published, published_draft'),
      ])
      const sections = (secs || []).filter((s) => s.enabled_draft != null && s.enabled_draft !== s.enabled)
      const visFlags = (flags || []).filter((f) => f.published_draft != null && f.published_draft !== f.published)
      const pending = {
        projects: projects.map((p) => p.slug),
        research: research.map((r) => r.slug),
        sections: sections.map((s) => s.key),
        flags: visFlags.map((f) => `${f.type}:${f.slug}`),
      }
      const total = pending.projects.length + pending.research.length + pending.sections.length + pending.flags.length
      return res.status(200).json({ pending, total })
    }

    if (req.method === 'POST') {
      const { scope = 'all', type, id } = req.body || {}
      const now = new Date().toISOString()

      // Single content item.
      if (type && id != null) {
        const table = COLLECTIONS[type]
        if (!table) return res.status(400).json({ error: 'Unknown type' })
        const { data: row } = await client.from(table).select('id, draft').eq('id', id).maybeSingle()
        if (!row) return res.status(404).json({ error: 'Not found' })
        const { error } = await client.from(table).update({ published: row.draft, updated_at: now }).eq('id', id)
        if (error) throw new Error(error.message)
        return res.status(200).json({ ok: true, published: { [type]: 1 } })
      }

      if (scope !== 'all') return res.status(400).json({ error: 'Unknown scope' })

      // Publish content: copy each changed draft into published.
      const summary = { projects: 0, research: 0, sections: 0, flags: 0 }
      for (const [t, table] of Object.entries(COLLECTIONS)) {
        const rows = await pendingContent(client, table)
        for (const r of rows) {
          const { error } = await client.from(table).update({ published: r.draft, updated_at: now }).eq('id', r.id)
          if (error) throw new Error(error.message)
          summary[table] = (summary[table] || 0) + 1
        }
      }

      // Publish visibility: sections + per-item flags.
      const { data: secs } = await client.from('site_sections').select('key, enabled, enabled_draft')
      for (const s of secs || []) {
        if (s.enabled_draft != null && s.enabled_draft !== s.enabled) {
          await client.from('site_sections').update({ enabled: s.enabled_draft }).eq('key', s.key)
          summary.sections++
        }
      }
      const { data: flags } = await client.from('content_flags').select('id, published, published_draft')
      for (const f of flags || []) {
        if (f.published_draft != null && f.published_draft !== f.published) {
          await client.from('content_flags').update({ published: f.published_draft }).eq('id', f.id)
          summary.flags++
        }
      }

      return res.status(200).json({ ok: true, published: summary })
    }
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) })
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).end()
}
