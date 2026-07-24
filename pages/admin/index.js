import { useState } from 'react'
import AdminShell from '../../components/admin/AdminShell'
import Analytics from '../../components/admin/Analytics'
import SectionsManager from '../../components/admin/SectionsManager'
import ProjectsManager from '../../components/admin/ProjectsManager'
import ResearchManager from '../../components/admin/ResearchManager'

const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'sections', label: 'Sections' },
  { id: 'projects', label: 'Projects' },
  { id: 'research', label: 'Research' },
]

// How far back the breakdowns look. Detail rows are bounded so the dashboard
// keeps loading quickly as traffic grows; likes and feedback stay all-time
// because they're small and you want the full history of both.
const WINDOW_DAYS = 90
const MAX_ROWS = 50000

// Turns a stored path into a short human label for the dashboard.
function labelFor(path, slug) {
  if (slug && slug !== 'home') return slug
  if (!path || path === '/') return 'home'
  const seg = path.split('/').filter(Boolean).pop()
  return seg || path
}

// Group rows by some key and return the biggest buckets first. `uniques`
// counts distinct visitors rather than hits, because ten visits from one
// person isn't ten people — that distinction is the whole point here.
function groupBy(rows, keyFn, { limit = 8, labelFn } = {}) {
  const map = new Map()
  rows.forEach((r) => {
    const key = keyFn(r)
    if (!key) return
    if (!map.has(key)) map.set(key, { key, label: labelFn ? labelFn(r, key) : key, views: 0, visitors: new Set() })
    const b = map.get(key)
    b.views += 1 + (r.revisit_count || 0)
    if (r.visitor_id) b.visitors.add(r.visitor_id)
  })
  return [...map.values()]
    .map((b) => ({ key: b.key, label: b.label, views: b.views, uniques: b.visitors.size }))
    .sort((a, b) => b.uniques - a.uniques || b.views - a.views)
    .slice(0, limit)
}

// Median rather than mean for time-on-page: one tab left open overnight would
// drag an average into nonsense, while the median stays representative.
function median(nums) {
  if (!nums.length) return 0
  const s = [...nums].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2)
}

// Returns null rather than 0 for an empty set, so the dashboard can tell
// "nobody scrolled" (a real 0%) apart from "no scroll data recorded yet".
const mean = (nums) => (nums.length ? Math.round(nums.reduce((a, b) => a + b, 0) / nums.length) : null)

const EMPTY = {
  feedback: [],
  pages: [],
  series: [],
  countries: [],
  cities: [],
  devices: [],
  browsers: [],
  sources: [],
  clicks: [],
  totals: {
    uniqueVisitors: 0, views: 0, likes: 0, sessions: 0,
    pagesPerSession: 0, medianSeconds: 0, avgScroll: null,
    newVisitors: 0, returningVisitors: 0,
  },
  windowDays: WINDOW_DAYS,
  configured: false,
}

// Analytics data comes from Supabase. Everything is wrapped so the admin
// still works fully for content even before Supabase is set up.
export async function getServerSideProps() {
  if (process.env.NODE_ENV === 'production') return { notFound: true }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return { props: EMPTY }

  try {
    const { createClient } = require('@supabase/supabase-js')
    const admin = createClient(url, key)

    const since = new Date(Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString()

    // `select('*')` on purpose: if the enrichment migration hasn't been run
    // yet, the new columns simply come back undefined and those panels show
    // empty, instead of the whole dashboard erroring on a missing column.
    const [{ data: feedback }, { data: views }, { data: likes }] = await Promise.all([
      admin.from('feedback').select('*').order('created_at', { ascending: false }),
      admin.from('page_views').select('*').gte('created_at', since).order('created_at', { ascending: false }).limit(MAX_ROWS),
      admin.from('likes').select('path'),
    ])

    // The events table is newer than the rest — tolerate it not existing yet.
    let events = []
    try {
      const { data } = await admin
        .from('events')
        .select('*')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(MAX_ROWS)
      events = data || []
    } catch {
      events = []
    }

    const rows = views || []

    // ── Per page ──────────────────────────────────────────────────────
    // Keyed by `path` — page_views and likes both store the full pathname,
    // so they line up.
    const byPath = {}
    const ensure = (path, slug) => {
      if (!byPath[path]) {
        byPath[path] = { path, label: labelFor(path, slug), views: 0, visitors: new Set(), likes: 0, durations: [], scrolls: [] }
      }
      return byPath[path]
    }
    rows.forEach((v) => {
      const path = v.path || `/${v.slug || 'unknown'}`
      const row = ensure(path, v.slug)
      row.views += 1 + (v.revisit_count || 0)
      if (v.visitor_id) row.visitors.add(v.visitor_id)
      if (v.duration_ms > 0) row.durations.push(v.duration_ms)
      if (typeof v.max_scroll === 'number') row.scrolls.push(v.max_scroll)
    })
    ;(likes || []).forEach((l) => {
      ensure(l.path || 'unknown').likes += 1
    })

    const pages = Object.values(byPath)
      .map((p) => ({
        path: p.path,
        label: p.label,
        views: p.views,
        uniques: p.visitors.size,
        likes: p.likes,
        medianSeconds: Math.round(median(p.durations) / 1000),
        avgScroll: mean(p.scrolls),
      }))
      .sort((a, b) => b.uniques - a.uniques || b.views - a.views)

    // ── Daily trend, last 14 days ─────────────────────────────────────
    const days = []
    const now = new Date()
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(now.getDate() - i)
      days.push({ date: d.toISOString().slice(0, 10), views: 0, visitors: new Set() })
    }
    const idxByDate = Object.fromEntries(days.map((d, i) => [d.date, i]))
    rows.forEach((v) => {
      if (!v.created_at) return
      const i = idxByDate[new Date(v.created_at).toISOString().slice(0, 10)]
      if (i !== undefined) {
        days[i].views += 1 + (v.revisit_count || 0)
        if (v.visitor_id) days[i].visitors.add(v.visitor_id)
      }
    })
    const series = days.map((d) => ({ date: d.date, views: d.views, uniques: d.visitors.size }))

    // ── Audience breakdowns ───────────────────────────────────────────
    const countries = groupBy(rows, (r) => r.country, { limit: 10, labelFn: (r, k) => countryName(k) })
    const cities = groupBy(rows, (r) => (r.city ? [r.city, r.country].filter(Boolean).join(', ') : null), { limit: 10 })
    const devices = groupBy(rows, (r) => r.device, { limit: 5 })
    const browsers = groupBy(rows, (r) => r.browser, { limit: 6 })

    // A campaign tag wins over the referrer: if you tagged the link yourself,
    // that label is more meaningful than "linkedin.com".
    const sources = groupBy(
      rows,
      (r) => r.utm_source || r.referrer_host || (r.referrer ? 'other' : 'direct'),
      { limit: 10 }
    )

    // ── Clicks ────────────────────────────────────────────────────────
    const clickMap = new Map()
    events
      .filter((e) => ['outbound', 'download', 'cta', 'contact', 'internal'].includes(e.name))
      .forEach((e) => {
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

    // ── Totals ────────────────────────────────────────────────────────
    const uniqueVisitors = new Set(rows.map((v) => v.visitor_id).filter(Boolean)).size

    // Pages-per-session only divides views that actually carry a session id.
    // Rows logged before the enrichment migration have none, and counting
    // them in the numerator but not the denominator inflates the average.
    const sessionedViews = rows.filter((v) => v.session_id)
    const sessions = new Set(sessionedViews.map((v) => v.session_id)).size
    const newVisitors = new Set(
      events.filter((e) => e.name === 'first_visit').map((e) => e.visitor_id).filter(Boolean)
    ).size

    const totals = {
      uniqueVisitors,
      views: rows.reduce((sum, r) => sum + 1 + (r.revisit_count || 0), 0),
      likes: (likes || []).length,
      sessions,
      pagesPerSession: sessions ? Math.round((sessionedViews.length / sessions) * 10) / 10 : 0,
      medianSeconds: Math.round(median(rows.filter((r) => r.duration_ms > 0).map((r) => r.duration_ms)) / 1000),
      avgScroll: mean(rows.filter((r) => typeof r.max_scroll === 'number').map((r) => r.max_scroll)),
      newVisitors,
      returningVisitors: Math.max(0, uniqueVisitors - newVisitors),
    }

    return {
      props: {
        feedback: feedback ?? [],
        pages, series, countries, cities, devices, browsers, sources, clicks, totals,
        windowDays: WINDOW_DAYS,
        configured: true,
      },
    }
  } catch (e) {
    return { props: EMPTY }
  }
}

// Just the countries likely to show up — anything else falls back to the ISO
// code, which is still perfectly readable.
const COUNTRY_NAMES = {
  IN: 'India', US: 'United States', GB: 'United Kingdom', CA: 'Canada', AU: 'Australia',
  DE: 'Germany', FR: 'France', NL: 'Netherlands', SG: 'Singapore', AE: 'UAE',
  JP: 'Japan', BR: 'Brazil', ES: 'Spain', IT: 'Italy', SE: 'Sweden', PL: 'Poland',
  ID: 'Indonesia', PH: 'Philippines', PK: 'Pakistan', BD: 'Bangladesh', LK: 'Sri Lanka',
  NG: 'Nigeria', ZA: 'South Africa', MX: 'Mexico', KR: 'South Korea', CN: 'China',
  RU: 'Russia', TR: 'Turkey', CH: 'Switzerland', IE: 'Ireland', NZ: 'New Zealand',
}
function countryName(code) {
  if (!code) return 'Unknown'
  return COUNTRY_NAMES[code.toUpperCase()] || code.toUpperCase()
}

export default function AdminDashboard(analytics) {
  const [tab, setTab] = useState('dashboard')
  return (
    <AdminShell tabs={TABS} active={tab} onSelect={setTab}>
      {tab === 'dashboard' && <Analytics {...analytics} />}
      {tab === 'sections' && <SectionsManager />}
      {tab === 'projects' && <ProjectsManager />}
      {tab === 'research' && <ResearchManager />}
    </AdminShell>
  )
}
