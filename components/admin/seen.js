// Tracks when the admin last acknowledged activity, so "new since your last
// visit" counts have a baseline. Local to this browser (localStorage) — fitting
// for a single-user local admin.
export const SEEN_KEY = 'studio:lastSeenAt'

export function getLastSeen() {
  try { return localStorage.getItem(SEEN_KEY) } catch { return null }
}

export function setLastSeen(iso) {
  try { localStorage.setItem(SEEN_KEY, iso || new Date().toISOString()) } catch { /* ignore */ }
}
