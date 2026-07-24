// A stable, per-browser id used to (a) count unique visitors and (b) keep
// one like per visitor. It's not personally identifying — just a random
// token in localStorage. If the visitor clears site data they get a new id
// (and count as a new visitor), which is the expected trade-off for a
// no-login setup.
export function getVisitorId() {
  if (typeof window === 'undefined') return null
  try {
    let id = localStorage.getItem('visitor_id')
    if (!id) {
      id =
        (typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID()) ||
        Date.now().toString(36) + Math.random().toString(36).slice(2)
      localStorage.setItem('visitor_id', id)
    }
    return id
  } catch {
    return null
  }
}

// You (the owner) can exclude your OWN visits from analytics: open the live
// site once with ?owner=1 (e.g. yoursite.com/?owner=1). The flag then sticks
// in that browser and your page views / likes stop being counted.
export function isOwner() {
  if (typeof window === 'undefined') return false
  try {
    const params = new URLSearchParams(window.location.search)
    if (params.get('owner') === '1') localStorage.setItem('is_owner', '1')
    return localStorage.getItem('is_owner') === '1'
  } catch {
    return false
  }
}

// A session groups the pages someone looked at in one sitting. Thirty minutes
// of inactivity ends it, which is the long-standing web-analytics convention —
// it's what makes "3 pages per visit" a meaningful number rather than just a
// count of every time the tab was ever opened.
const SESSION_IDLE_MS = 30 * 60 * 1000

export function getSessionId() {
  if (typeof window === 'undefined') return null
  try {
    const now = Date.now()
    const last = Number(localStorage.getItem('session_last') || 0)
    let id = localStorage.getItem('session_id')

    if (!id || !last || now - last > SESSION_IDLE_MS) {
      id =
        (typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID()) ||
        now.toString(36) + Math.random().toString(36).slice(2)
      localStorage.setItem('session_id', id)
    }
    localStorage.setItem('session_last', String(now)) // sliding window
    return id
  } catch {
    return null
  }
}

// True the first time this browser ever sees the site. Lets the dashboard
// split new visitors from people who came back.
export function isFirstVisit() {
  if (typeof window === 'undefined') return false
  try {
    if (localStorage.getItem('first_seen')) return false
    localStorage.setItem('first_seen', new Date().toISOString())
    return true
  } catch {
    return false
  }
}

// Campaign tags tell you which link someone followed to get here — e.g.
// sharing a project as ?utm_source=linkedin&utm_campaign=launch. They only
// appear on the landing URL, so we stash them for the rest of the session and
// attach them to every page view in that visit.
export function getCampaign() {
  if (typeof window === 'undefined') return {}
  try {
    const params = new URLSearchParams(window.location.search)
    const fresh = {
      utmSource: params.get('utm_source'),
      utmMedium: params.get('utm_medium'),
      utmCampaign: params.get('utm_campaign'),
    }
    if (fresh.utmSource || fresh.utmMedium || fresh.utmCampaign) {
      sessionStorage.setItem('campaign', JSON.stringify(fresh))
      return fresh
    }
    return JSON.parse(sessionStorage.getItem('campaign') || '{}')
  } catch {
    return {}
  }
}
