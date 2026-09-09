import { createClient } from '@supabase/supabase-js'

// Public client submission endpoint for testimonials.
// Submissions are saved with status 'pending' until the portfolio owner
// reviews and approves them in /admin -> "Testimonials".
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    return res.status(500).json({ error: 'Database is not configured' })
  }

  const {
    name,
    role,
    company,
    content,
    rating = 5,
    project_name,
    linkedin_url,
    avatar_url,
  } = req.body || {}

  const cleanName = String(name || '').trim()
  const cleanContent = String(content || '').trim()

  if (!cleanName) {
    return res.status(400).json({ error: 'Your name is required' })
  }
  if (!cleanContent) {
    return res.status(400).json({ error: 'Testimonial content is required' })
  }

  const numRating = Math.min(5, Math.max(1, parseInt(rating, 10) || 5))

  try {
    const supabase = createClient(url, key, { auth: { persistSession: false } })
    const { data, error } = await supabase
      .from('testimonials')
      .insert({
        name: cleanName,
        role: role ? String(role).trim() : null,
        company: company ? String(company).trim() : null,
        content: cleanContent,
        rating: numRating,
        project_name: project_name ? String(project_name).trim() : null,
        linkedin_url: linkedin_url ? String(linkedin_url).trim() : null,
        avatar_url: avatar_url ? String(avatar_url).trim() : null,
        status: 'pending', // Strictly pending until admin moderation
        is_featured: false,
      })
      .select('id, name, created_at')
      .single()

    if (error) throw error

    return res.status(201).json({
      success: true,
      message: 'Testimonial submitted successfully! Thank you.',
      id: data?.id,
    })
  } catch (err) {
    console.error('Testimonial submission error:', err)
    return res.status(500).json({ error: err.message || 'Failed to submit testimonial' })
  }
}
