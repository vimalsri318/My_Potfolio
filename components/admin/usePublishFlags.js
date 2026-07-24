import { useState, useEffect } from 'react'

// Loads per-item published flags from the visibility API and provides a
// toggle. `type` is 'project' | 'research'. Missing flag = published (true).
// Toggling writes to Supabase; the live site reflects it within ~15s (ISR).
export function usePublishFlags(type) {
  const [flags, setFlags] = useState({}) // slug -> boolean (published)
  const [busy, setBusy] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const res = await fetch('/api/admin/visibility')
      if (!res.ok) return
      const data = await res.json()
      const map = {}
      ;(data.content || []).forEach((f) => { if (f.type === type) map[f.slug] = f.published })
      setFlags(map)
    } catch {
      /* leave defaults (all published) */
    }
  }

  const isPublished = (slug) => flags[slug] !== false

  async function toggle(slug) {
    const next = !isPublished(slug)
    setBusy(slug)
    setFlags((f) => ({ ...f, [slug]: next }))
    try {
      const res = await fetch('/api/admin/visibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: 'content', type, slug, published: next }),
      })
      if (!res.ok) throw new Error('save failed')
    } catch {
      setFlags((f) => ({ ...f, [slug]: !next })) // rollback
    }
    setBusy('')
  }

  return { isPublished, toggle, busy }
}
