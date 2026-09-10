import Link from 'next/link'
import Reveal from './Reveal'

export default function Projects({ projects = [] }) {
  return (
    <section id="projects" className="apple-projects-section">
      <div className="apple-projects-container">
        {/* Section Header (Inspired by Apple 'Switch to Mac.') */}
        <div className="apple-projects-head">
          <p className="apple-projects-eyebrow">
            Selected Work <span className="apple-dot">●</span> 01–{String(projects.length).padStart(2, '0')}
          </p>
          <h2 className="apple-projects-title">Get to know my work.</h2>
        </div>

        {/* Apple Style White Cards List */}
        <div className="apple-projects-list">
          {projects.map((project, idx) => {
            // Card 0: Content Left, Media Right (matching Apple reference)
            // Card 1: Media Left, Content Right
            const isReversed = idx % 2 === 1
            const indexNumber = String(idx + 1).padStart(2, '0')

            return (
              <Reveal key={project.slug || project.id} delay={60}>
                <article className={`apple-project-card ${isReversed ? 'is-reversed' : ''}`}>
                  {/* Content Side */}
                  <div className="apple-card-content">
                    <div className="apple-card-meta">
                      <span className="apple-card-index">{indexNumber}</span>
                      <span className="apple-card-meta-sep">/</span>
                      <span className="apple-card-category">{project.category}</span>
                      <span className="apple-card-meta-dot">•</span>
                      <span className="apple-card-year">{project.year}</span>
                    </div>

                    <h3 className="apple-card-title">
                      <Link href={`/projects/${project.slug}`}>
                        {project.title}
                      </Link>
                    </h3>

                    {project.tagline && (
                      <p className="apple-card-tagline">{project.tagline}</p>
                    )}

                    <p className="apple-card-desc">{project.summary}</p>

                    {/* Tech Pills */}
                    {project.tech && project.tech.length > 0 && (
                      <div className="apple-card-tech">
                        {project.tech.slice(0, 4).map((t) => (
                          <span key={t} className="apple-tech-tag">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Apple Style Action Links */}
                    <div className="apple-card-actions">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="apple-link-primary"
                      >
                        <span>Explore case study</span>
                        <span className="apple-chevron" aria-hidden="true">›</span>
                      </Link>

                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="apple-link-secondary"
                        >
                          <span>Visit live site</span>
                          <span className="apple-arrow" aria-hidden="true">↗</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Media Side */}
                  <div className="apple-card-media">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="apple-media-link"
                      aria-label={`View case study for ${project.title}`}
                    >
                      <div className="apple-img-wrapper">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="apple-card-img"
                          loading="lazy"
                        />
                        <div className="apple-img-hover-pill">
                          <span>View Project ›</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
