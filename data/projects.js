// Single source of truth for all project content lives in projects.json.
// Edit it through the local admin (npm run dev → /admin) or by hand; the
// site reads it here at build time and every project automatically gets a
// detail page at /projects/<slug>.
import projects from './projects.json'

export default projects

export function getProjectBySlug(slug) {
  return projects.find((p) => p.slug === slug) || null
}

export function getNextProject(slug) {
  const index = projects.findIndex((p) => p.slug === slug)
  if (index === -1) return null
  return projects[(index + 1) % projects.length]
}
