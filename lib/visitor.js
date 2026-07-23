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
