import { memo, useMemo, useState } from 'react'
import Link from 'next/link'
import Reveal from './Reveal'
import { KINDS, kindLabel } from '../data/catalogue'
import { interestHref, requestInterest } from '../lib/interest'
import { linkLabel } from '../data/stack'
import { PlatformChips, StackLogos } from './ui/stack'
import DeviceMock from './ui/DeviceMock'

// The Work section, laid out as a catalogue: every project is a listing a
// client can open as a case study or order "one like this" from.
export default function Projects({ projects = [] }) {
  const [kind, setKind] = useState('all')

  const counts = useMemo(() => {
    const c = {}
    projects.forEach((p) => { c[p.kind || 'other'] = (c[p.kind || 'other'] || 0) + 1 })
    return c
  }, [projects])

  const filters = [
    { id: 'all', label: 'All', count: projects.length },
    ...KINDS.filter((k) => counts[k.id]).map((k) => ({ ...k, count: counts[k.id] })),
  ]
  const shown = kind === 'all' ? projects : projects.filter((p) => (p.kind || 'other') === kind)

  return (
    <section id="projects" className="shop">
      <div className="shop__container">
        <header className="shop__head">
          <p className="shop__eyebrow">Work · {projects.length} builds</p>
          <h2 className="shop__title">Products I&apos;ve built.</h2>
          <p className="shop__lede">
            Every build here is a pattern I can ship for you. Open a case study, or tap
            “Build me one like this” to start yours.
          </p>
        </header>

        <div className="shop__filters" role="group" aria-label="Filter projects">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              className="shop__filter"
              aria-pressed={kind === f.id}
              onClick={() => setKind(f.id)}
            >
              {f.label} <span className="shop__filter-count">{f.count}</span>
            </button>
          ))}
        </div>

        <ol className="work-list">
          {shown.map((project, i) => (
            <Reveal key={project.slug} as="li" className="work-list__item">
              <ProjectFeature project={project} index={i} total={shown.length} />
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

// One project per row: a single screenshot in a device frame (laptop for web,
// plus a phone when it has phone screens) beside what it is. No video here;
// the clips and full gallery load on the case-study page.
const ProjectFeature = memo(function ProjectFeature({ project, index, total }) {
  const href = `/projects/${project.slug}`
  const metrics = Array.isArray(project.metrics) ? project.metrics.slice(0, 3) : []
  const tech = Array.isArray(project.tech) ? project.tech.slice(0, 8) : []

  return (
    <article
      className={`work-feature${index % 2 ? ' work-feature--flip' : ''}`}
      style={project.accent ? { '--card-accent': project.accent } : undefined}
    >
      <Link href={href} className="work-feature__media" aria-label={`${project.title} case study`}>
        <DeviceMock mock={project.mock} platforms={project.platforms} title={project.title} />
        <span className="work-feature__hint" aria-hidden="true">
          Click to read more <span>→</span>
        </span>
      </Link>

      <div className="work-feature__body">
        <p className="work-feature__meta">
          <span className="work-feature__index">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          {project.kind ? kindLabel(project.kind) : project.category} · {project.year}
          {project.status && (
            <span className="work-feature__status">
              <span className="work-feature__status-dot" aria-hidden="true" />
              {project.status}
            </span>
          )}
        </p>
        <h3 className="work-feature__title">
          <Link href={href}>{project.title}</Link>
        </h3>
        {project.tagline && <p className="work-feature__tagline">{project.tagline}</p>}
        <PlatformChips platforms={project.platforms} />

        {metrics.length > 0 && (
          <dl className="work-feature__metrics">
            {metrics.map((m) => (
              <div key={m.label}>
                <dt>{m.value}</dt>
                <dd>{m.label}</dd>
              </div>
            ))}
          </dl>
        )}

        {/* Logos, resolved from `stack` keys or (for older projects and
            published rows without one) the plain-text `tech` list. */}
        <StackLogos stack={project.stack} tech={tech} />

        <div className="work-feature__actions">
          <Link href={href} className="work-feature__cta">
            Read the case study <span aria-hidden="true">→</span>
          </Link>
          {project.link && (
            <a href={project.link} target="_blank" rel="noreferrer" className="work-feature__film work-feature__live">
              {linkLabel(project.link, project.title)} <span aria-hidden="true">↗</span>
            </a>
          )}
          {project.film && (
            <Link href={`${href}#film`} className="work-feature__film">
              <span aria-hidden="true">▶</span> Watch the film
            </Link>
          )}
          <a
            href={interestHref(`Something like ${project.title}`)}
            className="work-feature__order"
            onClick={(e) => {
              e.preventDefault()
              requestInterest(`Something like ${project.title}`)
            }}
          >
            Build me one like this
          </a>
        </div>
      </div>
    </article>
  )
})
