import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Reveal from './Reveal'
import projects from '../data/projects'

export default function Projects() {
  const [active, setActive] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const rows = document.querySelectorAll('.project-row')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = Number(entry.target.getAttribute('data-id'))
            const project = projects.find((p) => p.id === id)
            if (project) setActive(project)
          }
        })
      },
      {
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0,
      }
    )

    rows.forEach((row) => observer.observe(row))
    return () => observer.disconnect()
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
        {/* Sticky centre image column */}
        <div className="projects-image-col" aria-hidden="true">
          <div className="projects-image-frame">
            {projects.map((project) => (
              <img
                key={project.id}
                src={project.image}
                alt={project.title}
                className={`projects-image-frame__img ${active?.id === project.id ? 'is-visible' : ''}`}
              />
            ))}
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
