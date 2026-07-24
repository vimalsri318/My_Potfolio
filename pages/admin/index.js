import { useState } from 'react'
import AdminShell from '../../components/admin/AdminShell'
import Analytics from '../../components/admin/Analytics'
import SectionsManager from '../../components/admin/SectionsManager'
import ProjectsManager from '../../components/admin/ProjectsManager'
import ResearchManager from '../../components/admin/ResearchManager'
import MessagesManager from '../../components/admin/MessagesManager'

const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'sections', label: 'Sections' },
  { id: 'projects', label: 'Projects' },
  { id: 'research', label: 'Research' },
  { id: 'messages', label: "Let's talk" },
]

// The dashboard fetches raw-ish rows for this many days and aggregates them on
// the client, so the filter bar re-slices instantly without a round-trip. Rows
// are trimmed to the fields the aggregator needs and capped so the payload
// stays reasonable as traffic grows.
const WINDOW_DAYS = 90
const MAX_ROWS = 20000

const EMPTY = { rows: [], events: [], likes: [], feedback: [], windowDays: WINDOW_DAYS, configured: false }

// Analytics data comes from Supabase. Everything is wrapped so the admin still
// works fully for content even before Supabase is set up.
export async function getServerSideProps() {
  if (process.env.NODE_ENV === 'production') return { notFound: true }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return { props: EMPTY }

  try {
    const { createClient } = require('@supabase/supabase-js')
    const admin = createClient(url, key)
    const since = new Date(Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString()

    const [{ data: feedback }, { data: views }, { data: likes }] = await Promise.all([
      admin.from('feedback').select('id, created_at, path, name, message').order('created_at', { ascending: false }),
      admin
        .from('page_views')
        .select('path, slug, visitor_id, session_id, country, city, device, browser, referrer, referrer_host, utm_source, created_at, revisit_count, duration_ms, max_scroll')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(MAX_ROWS),
      admin.from('likes').select('path'),
    ])

    // The events table is newer than the rest — tolerate it not existing yet.
    let events = []
    try {
      const { data } = await admin
        .from('events')
        .select('name, label, href, visitor_id, created_at')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(MAX_ROWS)
      events = data || []
    } catch {
      events = []
    }

    return {
      props: {
        rows: views || [],
        events,
        likes: likes || [],
        feedback: feedback || [],
        windowDays: WINDOW_DAYS,
        configured: true,
      },
    }
  } catch (e) {
    return { props: EMPTY }
  }
}

export default function AdminDashboard(analytics) {
  const [tab, setTab] = useState('dashboard')
  return (
    <AdminShell tabs={TABS} active={tab} onSelect={setTab}>
      {tab === 'dashboard' && <Analytics {...analytics} />}
      {tab === 'sections' && <SectionsManager />}
      {tab === 'projects' && <ProjectsManager />}
      {tab === 'research' && <ResearchManager />}
      {tab === 'messages' && <MessagesManager />}
    </AdminShell>
  )
}
