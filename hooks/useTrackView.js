import { useEffect } from 'react'
import { supabasePublic } from '../lib/supabasePublic'
import { getVisitorId, isOwner } from '../lib/visitor'

// Logs a page view for unique-visitor analytics. Each row carries a stable
// visitor_id, so the admin can count DISTINCT visitors (not raw hits).
export function useTrackView(slug) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (isOwner()) return // never count the owner's own visits

    const path = window.location.pathname
    const today = new Date().toISOString().slice(0, 10)
    const guardKey = `pv:${path}:${today}`

    // Record at most once per visitor / path / day. This also absorbs React
    // StrictMode's double-invoked effect in dev and ordinary page reloads,
    // so the counts reflect real visits rather than refresh spam.
    try {
      if (localStorage.getItem(guardKey)) return
      localStorage.setItem(guardKey, '1')
    } catch {
      /* private mode etc. — fall through and still log */
    }

    supabasePublic
      .from('page_views')
      .insert({
        path,
        slug: slug ?? null,
        referrer: document.referrer || null,
        visitor_id: getVisitorId(),
      })
      .then(({ error }) => {
        if (error) console.error('page view log failed:', error.message)
      })
  }, [slug])
}
