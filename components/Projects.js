import { memo, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Reveal from './Reveal'
import Showreel from './Showreel'
import { KINDS, kindLabel } from '../data/catalogue'
import { interestHref, requestInterest } from '../lib/interest'
import { linkLabel } from '../data/stack'
import { PlatformChips, StackLogos } from './ui/stack'

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

        <Showreel />

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

// One project per row, big: the motion clip (or cover) on one side, what it is
// and what was built on the other. Rows alternate sides. The clip plays muted
// while the row is on screen and pauses when it leaves.
const ProjectFeature = memo(function ProjectFeature({ project, index, total }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const href = `/projects/${project.slug}`
  const cover = project.cover || project.image
  const metrics = Array.isArray(project.metrics) ? project.metrics.slice(0, 3) : []
  const tech = Array.isArray(project.tech) ? project.tech.slice(0, 8) : []

  useEffect(() => {
    const v = videoRef.current
    if (!v || !project.video) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (navigator.connection?.saveData) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!v.src) v.src = project.video
          v.play().then(() => setPlaying(true)).catch(() => {})
        } else {
          v.pause()
          // Only one row's clip decodes at a time: half-visible rows give
          // their frame back instead of all of them staying live.
          setPlaying(false)
        }
      },
      { threshold: 0.55 }
    )
    io.observe(v)
    return () => io.disconnect()
  }, [project.video])

  return (
    <article
      className={`work-feature${index % 2 ? ' work-feature--flip' : ''}`}
      style={project.accent ? { '--card-accent': project.accent } : undefined}
    >
      <Link href={href} className="work-feature__media" aria-label={`${project.title} case study`}>
        <img src={cover} alt="" loading="lazy" decoding="async" className="work-feature__img" />
        {project.video && (
          <video
            ref={videoRef}
            className={`work-feature__video ${playing ? 'is-playing' : ''}`}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
          />
        )}
        {project.status && (
          <span className="work-feature__status">
            <span className="work-feature__status-dot" aria-hidden="true" />
            {project.status}
          </span>
        )}
      </Link>

      <div className="work-feature__body">
        <p className="work-feature__meta">
          <span className="work-feature__index">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          {project.kind ? kindLabel(project.kind) : project.category} · {project.year}
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
