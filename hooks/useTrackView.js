import { useEffect, useRef } from 'react'
import { isOwner, getCampaign, isFirstVisit } from '../lib/visitor'
import { trackView, trackEngagement, trackEvent } from '../lib/track'

// Two loads of the same path this close together are React StrictMode's
// double-invoked effect (or a fast double-mount), not two real visits. Genuine
// reloads are further apart than this and DO count, so "views" now means
// actual views — uniqueness is measured by distinct visitor_id instead of by
// suppressing repeat visits, which is what the old per-day guard really did.
const DEDUPE_MS = 1500
const lastSent = new Map()

// Logs a page view and, when the visitor leaves, how long they stayed and how
// far down the page they got. Location, device and browser are added
// server-side in /api/track — the browser never reports those.
export function useTrackView(slug) {
  const state = useRef({ rowId: null, start: 0, maxScroll: 0, sent: false })

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (isOwner()) return // never count the owner's own visits

    const path = window.location.pathname
    const now = Date.now()
    if (now - (lastSent.get(path) || 0) < DEDUPE_MS) return
    lastSent.set(path, now)

    const s = state.current
    s.start = now
    s.maxScroll = 0
    s.sent = false

    const firstVisit = isFirstVisit()

    trackView({
      path,
      slug: slug ?? null,
      referrer: document.referrer || null,
      campaign: getCampaign(),
    }).then((r) => {
      s.rowId = r?.id ?? null
    })

    if (firstVisit) trackEvent('first_visit', { path, slug: slug ?? null })

    // ── Scroll depth ──────────────────────────────────────────────────
    // "Did anyone read past the hero?" is a different question from "did the
    // page load", and it's the more useful one.
    const measureScroll = () => {
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - window.innerHeight
      const pct = scrollable <= 0 ? 100 : Math.round(((window.scrollY || 0) / scrollable) * 100)
      s.maxScroll = Math.min(100, Math.max(s.maxScroll, pct))
    }
    measureScroll()
    window.addEventListener('scroll', measureScroll, { passive: true })

    // ── Engagement on exit ────────────────────────────────────────────
    // `visibilitychange` fires reliably on mobile, where `beforeunload` often
    // doesn't, so it's the primary signal; `pagehide` covers the rest.
    const flush = () => {
      if (s.sent || !s.rowId) return
      s.sent = true
      trackEngagement({
        id: s.rowId,
        durationMs: Date.now() - s.start,
        maxScroll: s.maxScroll,
      })
    }
    const onHide = () => {
      if (document.visibilityState === 'hidden') flush()
    }
    document.addEventListener('visibilitychange', onHide)
    window.addEventListener('pagehide', flush)

    return () => {
      window.removeEventListener('scroll', measureScroll)
      document.removeEventListener('visibilitychange', onHide)
      window.removeEventListener('pagehide', flush)
      flush() // client-side route change away from this page
    }
  }, [slug])
}
