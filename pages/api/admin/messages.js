import { guardAdmin } from '../../../lib/adminGuard'

// Lists "Let's talk" contact-form submissions for the admin Messages tab.
// Service_role read, local admin only.
export default async function handler(req, res) {
  if (!guardAdmin(req, res)) return
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return res.status(500).json({ error: 'Supabase service key not configured in .env' })

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).end()
  }

  try {
    const { createClient } = require('@supabase/supabase-js')
    const db = createClient(url, key, { auth: { persistSession: false } })
    const { data, error } = await db
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return res.status(200).json(data || [])
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) })
  }
}
