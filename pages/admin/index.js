import { useState } from 'react'
import AdminShell from '../../components/admin/AdminShell'
import Analytics from '../../components/admin/Analytics'
import ProjectsManager from '../../components/admin/ProjectsManager'
import ResearchManager from '../../components/admin/ResearchManager'

const TABS = [
  { id: 'projects', label: 'Projects' },
  { id: 'research', label: 'Research' },
  { id: 'analytics', label: 'Analytics' },
]

// Turns a stored path into a short human label for the dashboard.
function labelFor(path, slug) {
  if (slug && slug !== 'home') return slug
  if (!path || path === '/') return 'home'
  const seg = path.split('/').filter(Boolean).pop()
  return seg || path
}

// Analytics data comes from Supabase. Everything is wrapped so the admin
// still works fully for content even before Supabase is set up.
export async function getServerSideProps() {
  if (process.env.NODE_ENV === 'production') return { notFound: true }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const empty = { feedback: [], pages: [], totals: { uniqueVisitors: 0, views: 0, likes: 0 }, configured: false }
  if (!url || !key) return { props: empty }

  try {
    const { createClient } = require('@supabase/supabase-js')
    const admin = createClient(url, key)

    const [{ data: feedback }, { data: views }, { data: likes }] = await Promise.all([
      admin.from('feedback').select('*').order('created_at', { ascending: false }),
      admin.from('page_views').select('slug, path, visitor_id'),
      admin.from('likes').select('path'),
    ])

    // Everything is keyed by `path` — both page_views and likes store the
    // full pathname, so they line up (this is what fixes likes showing 0).
    const byPath = {}
    const ensure = (path, slug) => {
      if (!byPath[path]) byPath[path] = { path, label: labelFor(path, slug), views: 0, visitors: new Set(), likes: 0 }
      return byPath[path]
    }

    ;(views || []).forEach((v) => {
      const path = v.path || `/${v.slug || 'unknown'}`
      const row = ensure(path, v.slug)
      row.views += 1
      if (v.visitor_id) row.visitors.add(v.visitor_id)
    })
    ;(likes || []).forEach((l) => {
      const path = l.path || 'unknown'
      ensure(path).likes += 1
    })

    const pages = Object.values(byPath)
      .map((p) => ({ path: p.path, label: p.label, views: p.views, uniques: p.visitors.size, likes: p.likes }))
      .sort((a, b) => b.uniques - a.uniques || b.views - a.views)

    const uniqueVisitors = new Set((views || []).map((v) => v.visitor_id).filter(Boolean)).size
    const totals = {
      uniqueVisitors,
      views: (views || []).length,
      likes: (likes || []).length,
    }

    return { props: { feedback: feedback ?? [], pages, totals, configured: true } }
  } catch (e) {
    return { props: { ...empty, configured: false } }
  }
}

export default function AdminDashboard(analytics) {
  const [tab, setTab] = useState('projects')
  return (
    <AdminShell tabs={TABS} active={tab} onSelect={setTab}>
      {tab === 'projects' && <ProjectsManager />}
      {tab === 'research' && <ResearchManager />}
      {tab === 'analytics' && <Analytics {...analytics} />}
    </AdminShell>
  )
}
