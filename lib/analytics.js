// Pure analytics aggregation, shared by the dashboard. It runs on the client so
// the filter bar can re-aggregate instantly over the rows fetched once in
// getServerSideProps — no round-trip per filter change. No imports, no I/O.

export const COUNTRY_NAMES = {
  IN: 'India', US: 'United States', GB: 'United Kingdom', CA: 'Canada', AU: 'Australia',
  DE: 'Germany', FR: 'France', NL: 'Netherlands', SG: 'Singapore', AE: 'UAE',
  JP: 'Japan', BR: 'Brazil', ES: 'Spain', IT: 'Italy', SE: 'Sweden', PL: 'Poland',
  ID: 'Indonesia', PH: 'Philippines', PK: 'Pakistan', BD: 'Bangladesh', LK: 'Sri Lanka',
  NG: 'Nigeria', ZA: 'South Africa', MX: 'Mexico', KR: 'South Korea', CN: 'China',
  RU: 'Russia', TR: 'Turkey', CH: 'Switzerland', IE: 'Ireland', NZ: 'New Zealand',
}

export function countryName(code) {
  if (!code) return 'Unknown'
  return COUNTRY_NAMES[code.toUpperCase()] || code.toUpperCase()
}

// Turns a stored path into a short human label.
export function labelFor(path, slug) {
  if (slug && slug !== 'home') return slug
  if (!path || path === '/') return 'home'
  const seg = path.split('/').filter(Boolean).pop()
  return seg || path
}

// Which part of the site a path belongs to — powers the page-type filter.
export function pageType(path) {
  if (!path || path === '/') return 'home'
  if (path.startsWith('/projects')) return 'projects'
  if (path.startsWith('/research')) return 'research'
  return 'other'
}

// A campaign tag wins over the referrer host; bare referrer -> 'other'; none -> 'direct'.
export function sourceKey(r) {
  return r.utm_source || r.referrer_host || (r.referrer ? 'other' : 'direct')
}

export function median(nums) {
  if (!nums.length) return 0
  const s = [...nums].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2)
}

// null (not 0) for an empty set, so "nobody scrolled" (real 0%) differs from
// "no scroll data recorded yet".
export const mean = (nums) => (nums.length ? Math.round(nums.reduce((a, b) => a + b, 0) / nums.length) : null)

const viewsOf = (r) => 1 + (r.revisit_count || 0)

// Group rows by a key, biggest buckets first, counting distinct visitors.
export function groupBy(rows, keyFn, { limit = 8, labelFn } = {}) {
  const map = new Map()
  rows.forEach((r) => {
    const key = keyFn(r)
    if (!key) return
    if (!map.has(key)) map.set(key, { key, label: labelFn ? labelFn(r, key) : key, views: 0, visitors: new Set() })
    const b = map.get(key)
    b.views += viewsOf(r)
    if (r.visitor_id) b.visitors.add(r.visitor_id)
  })
  return [...map.values()]
    .map((b) => ({ key: b.key, label: b.label, views: b.views, uniques: b.visitors.size }))
    .sort((a, b) => b.uniques - a.uniques || b.views - a.views)
    .slice(0, limit)
}

// Rows within the selected time window (used for both aggregation and to build
// the filter dropdown option lists, so options don't vanish as you filter).
export function windowRows(rows, windowDays) {
  if (!windowDays) return rows
  const since = Date.now() - windowDays * 24 * 60 * 60 * 1000
  return rows.filter((r) => r.created_at && new Date(r.created_at).getTime() >= since)
}

// Apply the dimension filters (device / country / source / page-type).
function applyDims(rows, f) {
  return rows.filter((r) => {
    if (f.device && r.device !== f.device) return false
    if (f.country && r.country !== f.country) return false
    if (f.source && sourceKey(r) !== f.source) return false
    if (f.pageType && pageType(r.path) !== f.pageType) return false
    return true
  })
}

// The distinct values available for each dimension, within the window.
export function filterOptions(rows) {
  const uniq = (fn) => [...new Set(rows.map(fn).filter(Boolean))]
  return {
    devices: uniq((r) => r.device).sort(),
    countries: uniq((r) => r.country).sort().map((c) => ({ value: c, label: countryName(c) })),
    sources: uniq((r) => sourceKey(r)).sort(),
  }
}

// The one aggregation entry point. Returns everything the dashboard renders.
export function aggregate({ rows = [], events = [], likes = [], filters = {} }) {
  const windowDays = filters.windowDays || 90
  const inWindow = windowRows(rows, windowDays)
  const rws = applyDims(inWindow, filters)

  // Scope events to the same window and to visitors that survived the filters
  // (so "most clicked" reflects the same audience as the rest of the board).
  const keepVisitor = new Set(rws.map((r) => r.visitor_id).filter(Boolean))
  const evs = windowRows(events, windowDays).filter(
    (e) => !e.visitor_id || keepVisitor.size === 0 || keepVisitor.has(e.visitor_id)
  )

  // ── Per page ────────────────────────────────────────────────────────
  const byPath = {}
  const ensure = (path, slug) => {
    if (!byPath[path]) byPath[path] = { path, label: labelFor(path, slug), views: 0, visitors: new Set(), likes: 0, durations: [], scrolls: [] }
    return byPath[path]
  }
  rws.forEach((v) => {
    const path = v.path || `/${v.slug || 'unknown'}`
    const row = ensure(path, v.slug)
    row.views += viewsOf(v)
    if (v.visitor_id) row.visitors.add(v.visitor_id)
    if (v.duration_ms > 0) row.durations.push(v.duration_ms)
    if (typeof v.max_scroll === 'number') row.scrolls.push(v.max_scroll)
  })
  // Likes carry no timestamp/dimension, so they map by path onto whatever pages
  // are in view. Only counted for pages the current filter shows.
  ;(likes || []).forEach((l) => {
    if (byPath[l.path]) byPath[l.path].likes += 1
  })
  const pages = Object.values(byPath)
    .map((p) => ({
      path: p.path, label: p.label, views: p.views, uniques: p.visitors.size, likes: p.likes,
      medianSeconds: Math.round(median(p.durations) / 1000),
      avgScroll: mean(p.scrolls),
    }))
    .sort((a, b) => b.uniques - a.uniques || b.views - a.views)

  // ── Daily trend across the window ───────────────────────────────────
  const days = []
  const now = new Date()
  for (let i = windowDays - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    days.push({ date: d.toISOString().slice(0, 10), views: 0, visitors: new Set() })
  }
  const idxByDate = Object.fromEntries(days.map((d, i) => [d.date, i]))
  rws.forEach((v) => {
    if (!v.created_at) return
    const i = idxByDate[new Date(v.created_at).toISOString().slice(0, 10)]
    if (i !== undefined) {
      days[i].views += viewsOf(v)
      if (v.visitor_id) days[i].visitors.add(v.visitor_id)
    }
  })
  const series = days.map((d) => ({ date: d.date, views: d.views, uniques: d.visitors.size }))

  // ── Audience breakdowns ─────────────────────────────────────────────
  const countries = groupBy(rws, (r) => r.country, { limit: 10, labelFn: (r, k) => countryName(k) })
  const cities = groupBy(rws, (r) => (r.city ? [r.city, r.country].filter(Boolean).join(', ') : null), { limit: 10 })
  const devices = groupBy(rws, (r) => r.device, { limit: 5 })
  const browsers = groupBy(rws, (r) => r.browser, { limit: 6 })
  const sources = groupBy(rws, (r) => sourceKey(r), { limit: 10 })

  // ── Clicks ──────────────────────────────────────────────────────────
  const clickMap = new Map()
  evs.filter((e) => ['outbound', 'download', 'cta', 'contact', 'internal'].includes(e.name)).forEach((e) => {
    const label = e.label || e.href || e.name
    const key = `${e.name}::${label}`
    if (!clickMap.has(key)) clickMap.set(key, { key, name: e.name, label, count: 0, visitors: new Set() })
    const c = clickMap.get(key)
    c.count += 1
    if (e.visitor_id) c.visitors.add(e.visitor_id)
  })
  const clicks = [...clickMap.values()]
    .map((c) => ({ key: c.key, name: c.name, label: c.label, count: c.count, uniques: c.visitors.size }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12)

  // ── Totals ──────────────────────────────────────────────────────────
  const uniqueVisitors = new Set(rws.map((v) => v.visitor_id).filter(Boolean)).size
  const sessionedViews = rws.filter((v) => v.session_id)
  const sessions = new Set(sessionedViews.map((v) => v.session_id)).size
  const newVisitors = new Set(
    evs.filter((e) => e.name === 'first_visit').map((e) => e.visitor_id).filter(Boolean)
  ).size
  const totals = {
    uniqueVisitors,
    views: rws.reduce((sum, r) => sum + viewsOf(r), 0),
    likes: pages.reduce((sum, p) => sum + p.likes, 0),
    sessions,
    pagesPerSession: sessions ? Math.round((sessionedViews.length / sessions) * 10) / 10 : 0,
    medianSeconds: Math.round(median(rws.filter((r) => r.duration_ms > 0).map((r) => r.duration_ms)) / 1000),
    avgScroll: mean(rws.filter((r) => typeof r.max_scroll === 'number').map((r) => r.max_scroll)),
    newVisitors,
    returningVisitors: Math.max(0, uniqueVisitors - newVisitors),
  }

  return { totals, pages, series, countries, cities, devices, browsers, sources, clicks }
}
