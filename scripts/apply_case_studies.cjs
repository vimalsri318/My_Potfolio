// Merge each project's case-study content into data/projects.json.
//
//   node scripts/apply_case_studies.cjs [slug ...]
//
// Sources, per slug:
//   video/public/films/<slug>/case.json   authored content: challenge, steps, decisions,
//                                         roadmap, screens (real screenshots), sceneCaptions,
//                                         and `overrides` for any top-level field
//   video/out/films/manifest.json         film + poster URLs and film stills
// Real screenshots referenced as "media/<file>" are copied from the film's
// media folder into public/assets/img/projects/<slug>/case/.
const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const FILMS = path.join(ROOT, 'video/public/films')
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'video/out/films/manifest.json'), 'utf8'))
const dataPath = path.join(ROOT, 'data/projects.json')
const raw = fs.readFileSync(dataPath, 'utf8')
const projects = JSON.parse(raw)

const slugs = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(FILMS).filter((d) => fs.existsSync(path.join(FILMS, d, 'case.json')))
for (const slug of slugs) {
  const p = projects.find((x) => x.slug === slug)
  if (!p) { console.warn(`✗ ${slug}: not in data/projects.json`); continue }
  const c = JSON.parse(fs.readFileSync(path.join(FILMS, slug, 'case.json'), 'utf8'))
  const m = manifest[slug] || {}
  const caseDir = path.join(ROOT, 'public/assets/img/projects', slug, 'case')
  fs.mkdirSync(caseDir, { recursive: true })

  const real = (c.screens || []).map((s) => {
    if (s.src.startsWith('media/')) {
      const file = path.basename(s.src)
      fs.copyFileSync(path.join(FILMS, slug, s.src), path.join(caseDir, file))
      return { ...s, src: `/assets/img/projects/${slug}/case/${file}` }
    }
    return s
  })
  const stills = (m.screens || []).map((s, i) => ({ ...s, caption: (c.sceneCaptions || [])[i] ?? s.caption }))
  const filmStills = c.useFilmStills === false ? [] : stills.filter((_, i) => !(c.skipStills || []).includes(i + 1))

  Object.assign(p, c.overrides || {})
  if (m.film) { p.film = m.film; p.filmPoster = m.filmPoster }
  if (c.challenge) p.challenge = c.challenge
  if (c.steps || fs.existsSync(path.join(caseDir, 'architecture.jpg'))) {
    p.architecture = {
      image: fs.existsSync(path.join(caseDir, 'architecture.jpg')) ? `/assets/img/projects/${slug}/case/architecture.jpg` : undefined,
      alt: c.architectureAlt || `${p.title} system architecture`,
      caption: c.architectureCaption,
      steps: c.steps,
    }
  }
  p.screens = [...real.filter((s) => s.first), ...filmStills, ...real.filter((s) => !s.first)].map(({ first, ...s }) => s)
  if (c.decisions) p.decisions = c.decisions
  if (c.roadmap) p.roadmap = c.roadmap
  console.log(`✓ ${slug}: ${p.screens.length} screens${p.film ? ', film' : ''}${p.architecture?.image ? ', diagram' : ''}`)
}
fs.writeFileSync(dataPath, JSON.stringify(projects, null, 2) + (raw.endsWith('\n') ? '\n' : ''))
