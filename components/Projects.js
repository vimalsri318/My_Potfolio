import { useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Reveal from './Reveal'
import Showreel from './Showreel'
import { KINDS, kindLabel } from '../data/catalogue'
import { interestHref, requestInterest } from '../lib/interest'

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

        <ul className="shop__grid">
          {shown.map((project, i) => (
            <Reveal key={project.slug} as="li" delay={Math.min(i, 5) * 50} className="shop__cell">
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

function ProjectCard({ project }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const href = `/projects/${project.slug}`
  const cover = project.cover || project.image

  // Desktop hover plays the project's motion clip; touch devices keep the still.
  const canHover = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const onEnter = () => {
    const v = videoRef.current
    if (!v || !project.video || !canHover()) return
    if (!v.src) v.src = project.video
    v.play().then(() => setPlaying(true)).catch(() => {})
  }
  const onLeave = () => {
    const v = videoRef.current
    if (!v) return
    v.pause()
    setPlaying(false)
  }

  return (
    <article
      className="shop-card"
      style={project.accent ? { '--card-accent': project.accent } : undefined}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <Link href={href} className="shop-card__media" aria-label={`${project.title} case study`}>
        <img src={cover} alt="" loading="lazy" className="shop-card__img" />
        {project.video && (
          <video
            ref={videoRef}
            className={`shop-card__video ${playing ? 'is-playing' : ''}`}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
          />
        )}
        {project.status && (
          <span className="shop-card__status">
            <span className="shop-card__status-dot" aria-hidden="true" />
            {project.status}
          </span>
        )}
        {project.film && (
          <span className="shop-card__film" title="Narrated product film on the case study">
            <span aria-hidden="true">▶</span> Film
          </span>
        )}
      </Link>

      <div className="shop-card__body">
        <p className="shop-card__meta">
          {project.kind ? kindLabel(project.kind) : project.category}
          <span className="shop-card__meta-year"> · {project.year}</span>
        </p>
        <h3 className="shop-card__title">
          <Link href={href}>{project.title}</Link>
        </h3>
        {project.tagline && <p className="shop-card__tagline">{project.tagline}</p>}
        {Array.isArray(project.tech) && project.tech.length > 0 && (
          <ul className="shop-card__tech">
            {project.tech.slice(0, 3).map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
        <div className="shop-card__actions">
          <Link href={href} className="shop-card__cta">
            Case study <span aria-hidden="true">→</span>
          </Link>
          <a
            href={interestHref(`Something like ${project.title}`)}
            className="shop-card__order"
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
}
