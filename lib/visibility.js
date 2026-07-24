import { createClient } from '@supabase/supabase-js'

// Default visibility when Supabase can't be reached — chosen so the site
// degrades safely: coming-soon stays ON and sections default visible.
const DEFAULT_SECTIONS = {
  coming_soon: true, about: true, projects: true, services: true, experience: true, contact: true,
}

// Local dev previews the DRAFT visibility state (what you're staging);
// production serves the LIVE state (what you've published). Toggling in the
// admin edits the draft; the Publish button copies draft -> live.
const DRAFT = process.env.NODE_ENV !== 'production'

function anonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

// Read section switches + per-item published flags. Used in getStaticProps
// with ISR so the live site reflects published toggles within the revalidate
// window. Never throws — falls back to safe defaults.
export async function getVisibility() {
  const c = anonClient()
  if (!c) return { sections: { ...DEFAULT_SECTIONS }, hiddenProjects: [], hiddenResearch: [] }
  try {
    const [{ data: secs }, { data: flags }] = await Promise.all([
      c.from('site_sections').select('key, enabled, enabled_draft'),
      c.from('content_flags').select('type, slug, published, published_draft'),
    ])
    // In dev, prefer the draft value when it's set; in prod, always the live one.
    const sectionOn = (s) => (DRAFT && s.enabled_draft != null ? s.enabled_draft : s.enabled)
    const flagOn = (f) => (DRAFT && f.published_draft != null ? f.published_draft : f.published)

    const sections = { ...DEFAULT_SECTIONS }
    ;(secs || []).forEach((s) => { sections[s.key] = sectionOn(s) })
    const hidden = (type) =>
      (flags || []).filter((f) => f.type === type && flagOn(f) === false).map((f) => f.slug)
    return { sections, hiddenProjects: hidden('project'), hiddenResearch: hidden('research') }
  } catch {
    return { sections: { ...DEFAULT_SECTIONS }, hiddenProjects: [], hiddenResearch: [] }
  }
}
