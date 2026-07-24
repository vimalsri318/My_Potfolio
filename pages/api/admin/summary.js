import { guardAdmin } from '../../../lib/adminGuard'

// Counts of what's arrived since the admin last checked (the `since` query
// param, an ISO timestamp). Powers the "new since your last visit" banner.
// Also returns all-time-ish totals for context. Service_role, local admin only.
export default async function handler(req, res) {
  if (!guardAdmin(req, res)) return
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return res.status(200).json({ configured: false, since: null, new: {}, totals: {} })

  const since = typeof req.query.since === 'string' ? req.query.since : null

  try {
    const { createClient } = require('@supabase/supabase-js')
    const db = createClient(url, key, { auth: { persistSession: false } })

    // A head count (rows not returned) for one table, optionally since `since`.
    const count = async (table, useSince) => {
      let q = db.from(table).select('*', { count: 'exact', head: true })
      if (useSince && since) q = q.gt('created_at', since)
      const { count: c, error } = await q
      if (error) return 0
      return c || 0
    }

    const [nFeedback, nMessages, nViews, nLikes, tFeedback, tMessages, tViews, tLikes] = await Promise.all([
      count('feedback', true), count('contact_messages', true), count('page_views', true), count('likes', true),
      count('feedback', false), count('contact_messages', false), count('page_views', false), count('likes', false),
    ])

    return res.status(200).json({
      configured: true,
      since,
      new: { feedback: nFeedback, messages: nMessages, views: nViews, likes: nLikes },
      totals: { feedback: tFeedback, messages: tMessages, views: tViews, likes: tLikes },
    })
  } catch (e) {
    return res.status(200).json({ configured: false, since, new: {}, totals: {}, error: String(e.message || e) })
  }
}
