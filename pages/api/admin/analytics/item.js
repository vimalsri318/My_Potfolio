import { guardAdmin } from '../../../../lib/adminGuard'
import { median, mean, countryName } from '../../../../lib/analytics'

// Per-item analytics for one project or research post. Aggregates the same
// Supabase tables the dashboard uses, but scoped to a single path
// (/projects/<slug> or /research/<slug>). Service_role, local admin only.
function db() {
  const { createClient } = require('@supabase/supabase-js')
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  })
}

export default async function handler(req, res) {
  if (!guardAdmin(req, res)) return
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return res.status(500).json({ error: 'Supabase service key not configured in .env' })

  const { type, slug } = req.query
  if (!type || !slug) return res.status(400).json({ error: 'type and slug are required' })
  const base = type === 'research' ? 'research' : 'projects'
  const path = `/${base}/${slug}`

  try {
    const client = db()
    const [{ data: views }, { data: likes }, { data: feedback }] = await Promise.all([
      client.from('page_views').select('visitor_id, created_at, country, device, referrer_host, utm_source, revisit_count, duration_ms, max_scroll').eq('path', path),
      client.from('likes').select('id').eq('path', path),
      client.from('feedback').select('id, created_at, name, message').eq('path', path).order('created_at', { ascending: false }),
    ])

    const rows = views || []
    const uniques = new Set(rows.map((r) => r.visitor_id).filter(Boolean)).size
    const totalViews = rows.reduce((s, r) => s + 1 + (r.revisit_count || 0), 0)

    // Top referrers/countries — small, for context.
    const top = (fn, limit = 5) => {
      const m = new Map()
      rows.forEach((r) => {
        const k = fn(r)
        if (!k) return
        m.set(k, (m.get(k) || 0) + 1 + (r.revisit_count || 0))
      })
      return [...m.entries()].map(([k, v]) => ({ key: k, value: v })).sort((a, b) => b.value - a.value).slice(0, limit)
    }

    // Last 14 days sparkline of views.
    const days = []
    const now = new Date()
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now); d.setDate(now.getDate() - i)
      days.push({ date: d.toISOString().slice(0, 10), views: 0 })
    }
    const idx = Object.fromEntries(days.map((d, i) => [d.date, i]))
    rows.forEach((r) => {
      if (!r.created_at) return
      const i = idx[new Date(r.created_at).toISOString().slice(0, 10)]
      if (i !== undefined) days[i].views += 1 + (r.revisit_count || 0)
    })

    return res.status(200).json({
      path,
      totals: {
        views: totalViews,
        uniques,
        likes: (likes || []).length,
        feedback: (feedback || []).length,
        medianSeconds: Math.round(median(rows.filter((r) => r.duration_ms > 0).map((r) => r.duration_ms)) / 1000),
        avgScroll: mean(rows.filter((r) => typeof r.max_scroll === 'number').map((r) => r.max_scroll)),
      },
      countries: top((r) => r.country).map((c) => ({ label: countryName(c.key), value: c.value })),
      sources: top((r) => r.utm_source || r.referrer_host || 'direct').map((s) => ({ label: s.key, value: s.value })),
      devices: top((r) => r.device).map((d) => ({ label: d.key, value: d.value })),
      series: days,
      feedback: feedback || [],
    })
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) })
  }
}
