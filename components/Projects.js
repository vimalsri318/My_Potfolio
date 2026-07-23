import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Reveal from './Reveal'
import projects from '../data/projects'

export default function Projects() {
  const [active, setActive] = useState(null)
  const [ratios, setRatios] = useState({})
  const router = useRouter()

  // Deterministic scroll trigger: the row whose centre is closest to the
  // viewport centre is the active one — projects can never be skipped,
  // no matter how fast the user scrolls. Driven by scroll events, with an
  // IntersectionObserver as a fallback for environments that throttle them.
  useEffect(() => {
    const rows = Array.from(document.querySelectorAll('.project-row'))
    if (rows.length === 0) return
    let ticking = false

    const update = () => {
      ticking = false
      const viewportCenter = window.innerHeight / 2
      let bestId = null
      let bestDist = Infinity
      rows.forEach((row) => {
        const rect = row.getBoundingClientRect()
        const dist = Math.abs(rect.top + rect.height / 2 - viewportCenter)
        if (dist < bestDist) {
          bestDist = dist
          bestId = Number(row.getAttribute('data-id'))
        }
      })
      if (bestId !== null) {
        setActive((prev) =>
          prev?.id === bestId ? prev : projects.find((p) => p.id === bestId)
        )
      }
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }

    const observer = new IntersectionObserver(update, {
      threshold: [0, 0.25, 0.5, 0.75, 1],
    })
    rows.forEach((row) => observer.observe(row))

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // Remember each image's natural ratio so the frame can match it
  const recordRatio = (id, img) => {
    const { naturalWidth, naturalHeight } = img
    if (!naturalWidth || !naturalHeight) return
    setRatios((r) => (r[id] ? r : { ...r, [id]: naturalWidth / naturalHeight }))
  }

  const handleImageLoad = (id) => (e) => recordRatio(id, e.target)

  // Cached images can finish loading before hydration, so onLoad never
  // fires for them — pick their ratios up here instead.
  useEffect(() => {
    document.querySelectorAll('.projects-image-frame__img').forEach((img) => {
      if (img.complete) recordRatio(Number(img.dataset.id), img)
    })
  }, [])

  return (
    <section id="projects" className="projects-section">
      {/* Sticky title bar — full width */}
      <div className="projects-title-bar">
        <div className="projects-title-inner">
          <h2 className="projects__title">
            <span className="projects__title-arrow">↘</span> Projects
          </h2>
        </div>
      </div>

      {/* Content area */}
      <div className="projects-body">
        {/* Sticky image column — aligned to the rows' image slot */}
        <div className="projects-image-col" aria-hidden="true">
          <div className="projects-image-slot">
            <div
              className="projects-image-frame"
              style={{
                aspectRatio: (active && ratios[active.id]) || 16 / 10,
              }}
            >
              {projects.map((project) => (
                <img
                  key={project.id}
                  data-id={project.id}
                  src={project.image}
                  alt={project.title}
                  onLoad={handleImageLoad(project.id)}
                  className={`projects-image-frame__img ${active?.id === project.id ? 'is-visible' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Rows */}
        <Reveal>
          <div className="projects-rows">
            {projects.map((project) => (
              <div
                key={project.id}
                data-id={project.id}
                className={`project-row ${active?.id === project.id ? 'is-active' : ''}`}
                role="link"
                tabIndex={0}
                onClick={() => router.push(`/projects/${project.slug}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') router.push(`/projects/${project.slug}`)
                }}
              >
                {/* Left: name + category */}
                <div className="project-row__left">
                  <span className="project-row__title">{project.title}</span>
                  <span className="project-row__sep">—</span>
                  <span className="project-row__category">{project.category}</span>
                </div>

                {/* Mobile Image (hidden on desktop) */}
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="project-row__mobile-img" 
                />

                {/* Centre: intentional gap where image floats */}
                <div className="project-row__center" />

                {/* Right: CTA */}
                {project.link ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="project-row__cta"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Visit project ↗
                  </a>
                ) : (
                  <span className="project-row__cta">View details →</span>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
