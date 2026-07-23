// Single source of truth for the "Research & Learnings" section lives in
// research.json. Edit it through the local admin (npm run dev → /admin) or
// by hand. Each entry appears at /research and gets its own shareable page
// at /research/<slug>.
//
// ── Entry shape ────────────────────────────────────────────────────
//   slug        the shareable name — never change it once shared
//   title, topic, date (ISO — controls newest-first order), readingTime
//   tags        ['#AI', ...]
//   summary     one-line teaser
//   cover       optional hero image path
//   interactive optional { src, title } — an HTML app in /public/research/<slug>/
//   resources   [{ label, href }]   external links
//   downloads   [{ label, href }]   files to grab
//   body        the article, a list of blocks rendered top-to-bottom:
//     { type: 'heading',   text }
//     { type: 'paragraph', text }
//     { type: 'list',      items: [...] }
//     { type: 'image',     src, caption? }
//     { type: 'code',      language?, text }
//     { type: 'quote',     text }
import research from './research.json'

export default research

// Newest first, for the list page.
export function getAllResearch() {
  return [...research].sort((a, b) => new Date(b.date) - new Date(a.date))
}

export function getResearchBySlug(slug) {
  return research.find((r) => r.slug === slug) || null
}

// "Next read" navigation, following the sorted (newest-first) order.
export function getNextResearch(slug) {
  const ordered = getAllResearch()
  const index = ordered.findIndex((r) => r.slug === slug)
  if (index === -1 || ordered.length < 2) return null
  return ordered[(index + 1) % ordered.length]
}
