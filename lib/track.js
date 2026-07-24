import { getVisitorId, getSessionId, isOwner } from './visitor'

// Client-side transport for analytics. Everything goes to our own /api/track.
// Analytics is never allowed to surface an error to the visitor, so failures
// are swallowed — a lost page view is always preferable to a broken page.

const ENDPOINT = '/api/track'

// `keepalive` lets the request survive the page being navigated away from,
// which matters because most interesting clicks are the ones that leave.
async function post(payload) {
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    })
    if (!res.ok || res.status === 204) return null
    return await res.json().catch(() => null)
  } catch {
    return null
  }
}

// sendBeacon is the only transport the browser guarantees during unload.
// It can't read a response, which is fine — engagement pings don't need one.
function beacon(payload) {
  try {
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
    if (navigator.sendBeacon && navigator.sendBeacon(ENDPOINT, blob)) return
  } catch {
    /* fall through */
  }
  post(payload)
}

export function trackView({ path, slug, referrer, campaign = {} }) {
  return post({
    type: 'view',
    path,
    slug,
    referrer,
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    ...campaign,
  })
}

// Records an interaction. `name` buckets it ('outbound', 'download', 'cta'…),
// `label` is the human-readable thing that was clicked.
export function trackEvent(name, { label, href, path, slug, props } = {}) {
  if (isOwner()) return
  return post({
    type: 'event',
    name,
    label,
    href,
    path: path ?? (typeof window !== 'undefined' ? window.location.pathname : null),
    slug,
    props,
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
  })
}

export function trackEngagement({ id, durationMs, maxScroll }) {
  if (!id) return
  beacon({ type: 'ping', id, durationMs, maxScroll, visitorId: getVisitorId() })
}
