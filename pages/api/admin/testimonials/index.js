import { guardAdmin } from '../../../../lib/adminGuard'
import { createClient } from '@supabase/supabase-js'

function adminDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

export default async function handler(req, res) {
  if (!guardAdmin(req, res)) return

  const db = adminDb()
  if (!db) {
    return res.status(500).json({ error: 'Supabase service role key not configured in .env' })
  }

  // GET: list all testimonials with counts
  if (req.method === 'GET') {
    try {
      const { data, error } = await db
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const items = data || []
      const counts = {
        total: items.length,
        pending: items.filter((t) => t.status === 'pending').length,
        approved: items.filter((t) => t.status === 'approved').length,
        rejected: items.filter((t) => t.status === 'rejected').length,
      }

      return res.status(200).json({ items, counts })
    } catch (err) {
      return res.status(500).json({ error: err.message || 'Failed to fetch testimonials' })
    }
  }

  // POST: create a manual testimonial directly from admin
  if (req.method === 'POST') {
    const {
      name,
      role,
      company,
      content,
      rating = 5,
      project_name,
      linkedin_url,
      avatar_url,
      status = 'approved',
      is_featured = false,
    } = req.body || {}

    const cleanName = String(name || '').trim()
    const cleanContent = String(content || '').trim()

    if (!cleanName || !cleanContent) {
      return res.status(400).json({ error: 'Name and content are required' })
    }

    try {
      const { data, error } = await db
        .from('testimonials')
        .insert({
          name: cleanName,
          role: role ? String(role).trim() : null,
          company: company ? String(company).trim() : null,
          content: cleanContent,
          rating: Math.min(5, Math.max(1, parseInt(rating, 10) || 5)),
          project_name: project_name ? String(project_name).trim() : null,
          linkedin_url: linkedin_url ? String(linkedin_url).trim() : null,
          avatar_url: avatar_url ? String(avatar_url).trim() : null,
          status,
          is_featured: !!is_featured,
        })
        .select('*')
        .single()

      if (error) throw error
      return res.status(201).json(data)
    } catch (err) {
      return res.status(500).json({ error: err.message || 'Failed to create testimonial' })
    }
  }

  // PATCH: update a testimonial (status, content, featured, rating, etc.)
  if (req.method === 'PATCH') {
    const { id, ...updates } = req.body || {}
    if (!id) return res.status(400).json({ error: 'Testimonial ID is required' })

    const allowed = [
      'status',
      'is_featured',
      'sort',
      'name',
      'role',
      'company',
      'content',
      'rating',
      'project_name',
      'linkedin_url',
      'avatar_url',
    ]

    const patch = {}
    for (const key of allowed) {
      if (key in updates) {
        if (key === 'rating') {
          patch[key] = Math.min(5, Math.max(1, parseInt(updates[key], 10) || 5))
        } else if (key === 'is_featured') {
          patch[key] = !!updates[key]
        } else if (key === 'sort') {
          patch[key] = parseInt(updates[key], 10) || 0
        } else {
          patch[key] = updates[key]
        }
      }
    }

    try {
      const { data, error } = await db
        .from('testimonials')
        .update(patch)
        .eq('id', id)
        .select('*')
        .single()

      if (error) throw error
      return res.status(200).json(data)
    } catch (err) {
      return res.status(500).json({ error: err.message || 'Failed to update testimonial' })
    }
  }

  // DELETE: delete a testimonial by id
  if (req.method === 'DELETE') {
    const { id } = req.body || {}
    if (!id) return res.status(400).json({ error: 'Testimonial ID is required' })

    try {
      const { error } = await db.from('testimonials').delete().eq('id', id)
      if (error) throw error
      return res.status(200).json({ success: true })
    } catch (err) {
      return res.status(500).json({ error: err.message || 'Failed to delete testimonial' })
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE'])
  return res.status(405).end()
}
