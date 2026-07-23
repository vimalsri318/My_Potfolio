import Head from 'next/head'
import Link from 'next/link'
import Navigation from './Navigation'
import Footer from './Footer'
import Reveal from './Reveal'

// One page layout for every project — pass a project (and the next one)
// as props and it renders the full case study.
export default function ProjectDetail({ project, nextProject }) {
  if (!project) return null

  return (
    <>
      <Head>
        <title>{`${project.title} — Vimal Srinivasan`}</title>
        <meta name="description" content={project.summary} />
        <link rel="shortcut icon" href="/assets/img/favicon.png" type="image/x-icon" />
      </Head>

      <Navigation />

      <main className="main project-detail">
        <div className="container">
          {/* Back link */}
          <Link href="/#projects" className="project-detail__back mono">
            ← Back to projects
          </Link>

          {/* Header */}
          <header className="project-detail__header">
            <p className="mono project-detail__meta-line">
              {project.category} <span className="project-detail__dot">●</span> {project.year}
            </p>
            <h1 className="display project-detail__title">{project.title}</h1>
            <p className="project-detail__summary">{project.summary}</p>
          </header>

          {/* Hero image */}
          <Reveal>
            <div className="project-detail__hero">
              <img src={project.image} alt={project.title} />
            </div>
          </Reveal>

          {/* Meta grid */}
          <div className="project-detail__grid">
            <div className="project-detail__cell">
              <span className="mono project-detail__label">Role</span>
              <p>{project.role}</p>
            </div>
            <div className="project-detail__cell">
              <span className="mono project-detail__label">Tech</span>
              <p>{project.tech.join(' — ')}</p>
            </div>
            <div className="project-detail__cell">
              <span className="mono project-detail__label">Year</span>
              <p>{project.year}</p>
            </div>
            <div className="project-detail__cell">
              <span className="mono project-detail__label">Live</span>
              {project.link ? (
                <p>
                  <a href={project.link} target="_blank" rel="noreferrer" className="project-detail__live">
                    Visit project ↗
                  </a>
                </p>
              ) : (
                <p>Available on request</p>
              )}
            </div>
          </div>

          {/* Overview */}
          <section className="project-detail__section">
            <span className="mono project-detail__label">Overview</span>
            <div className="project-detail__text">
              {project.description.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </section>

          {/* Highlights */}
          <section className="project-detail__section">
            <span className="mono project-detail__label">Highlights</span>
            <ul className="project-detail__highlights">
              {project.highlights.map((item, i) => (
                <li key={i}>
                  <span className="project-detail__hl-index">0{i + 1}</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Gallery (optional — add image paths to `gallery` in data/projects.js) */}
          {project.gallery.length > 0 && (
            <section className="project-detail__section">
              <span className="mono project-detail__label">Gallery</span>
              <div className="project-detail__gallery">
                {project.gallery.map((src, i) => (
                  <img key={i} src={src} alt={`${project.title} — ${i + 1}`} />
                ))}
              </div>
            </section>
          )}

          {/* Next project */}
          {nextProject && (
            <Link href={`/projects/${nextProject.slug}`} className="project-detail__next">
              <span className="mono project-detail__label">Next project</span>
              <span className="display project-detail__next-title">
                {nextProject.title} <span className="project-detail__next-arrow">→</span>
              </span>
            </Link>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
