// Catalogue groups for the Work section filters. A project's `kind` field
// (in data/projects.json / the admin) picks its group; anything without a
// kind lands in "More". Order here is the order of the filter chips.

export const KINDS = [
  { id: 'ai', label: 'AI & agents' },
  { id: 'saas', label: 'Platforms & SaaS' },
  { id: 'commerce', label: 'Commerce & brands' },
  { id: 'apps', label: 'Apps & dev tools' },
]

export const kindLabel = (id) => KINDS.find((k) => k.id === id)?.label || 'More'

// The showreel shown at the top of the Work section. Rendered from video/
// (see video/README.md) — re-render after adding a project.
export const SHOWREEL = {
  src: '/assets/video/showreel.mp4',
  poster: '/assets/video/showreel-poster.jpg',
  vertical: '/assets/video/showreel-vertical.mp4',
}
