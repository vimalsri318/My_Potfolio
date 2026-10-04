import Head from 'next/head'
import Link from 'next/link'
import Navigation from './Navigation'
import Footer from './Footer'
import Reveal from './Reveal'
import FeedbackForm from './FeedbackForm'
import LikeButton from './LikeButton'
import { useTrackView } from '../hooks/useTrackView'
import { kindLabel } from '../data/catalogue'
import { interestHref } from '../lib/interest'

// One page layout for every project — pass a project (and the next one)
// as props and it renders the full case study.
export default function ProjectDetail({ project, nextProject }) {
  useTrackView(project?.slug)

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
              {project.status && <span className="project-detail__status">{project.status}</span>}
              {project.kind ? kindLabel(project.kind) : project.category}{' '}
              <span className="project-detail__dot">●</span> {project.year}
            </p>
            <h1 className="display project-detail__title">{project.title}</h1>
            {project.tagline && (
              <p className="project-detail__tagline">{project.tagline}</p>
            )}
            <p className="project-detail__summary">{project.summary}</p>
          </header>

          {/* Hero image */}
          <Reveal>
            <div className="project-detail__hero">
              {project.video ? (
                <video
                  src={project.video}
                  poster={project.cover || project.image}
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-label={`${project.title} in motion`}
                />
              ) : (
                <img src={project.image} alt={project.title} />
              )}
            </div>
          </Reveal>

          {/* Key Metrics Bar (Apple Style) */}
          {project.metrics && project.metrics.length > 0 && (
            <Reveal>
              <div className="project-detail__metrics-bar">
                {project.metrics.map((m, i) => (
                  <div key={i} className="project-detail__metric-item">
                    <span className="project-detail__metric-val">{m.value}</span>
                    <span className="project-detail__metric-label">{m.label}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          {/* Product film — the narrated walkthrough, with sound and controls */}
          {project.film && (
            <Reveal>
              <section id="film" className="project-detail__film">
                <span className="mono project-detail__label">Product film</span>
                <div className="project-detail__film-frame">
                  <video
                    src={project.film}
                    poster={project.filmPoster || project.cover || project.image}
                    controls
                    preload="metadata"
                    playsInline
                    aria-label={`${project.title} — product film`}
                  />
                </div>
              </section>
            </Reveal>
          )}

          {/* Meta grid */}
          <div className="project-detail__grid">
            <div className="project-detail__cell">
              <span className="mono project-detail__label">Role</span>
              <p>{project.role}</p>
            </div>
            <div className="project-detail__cell">
              <span className="mono project-detail__label">Tech</span>
              <p>{Array.isArray(project.tech) ? project.tech.join(' — ') : project.tech}</p>
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
                <p>Private build — demo on request</p>
              )}
            </div>
          </div>

          {/* Overview */}
          {project.description && project.description.length > 0 && (
            <section className="project-detail__section">
              <span className="mono project-detail__label">Overview</span>
              <div className="project-detail__text">
                {Array.isArray(project.description) ? (
                  project.description.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))
                ) : (
                  <p>{project.description}</p>
                )}
              </div>
            </section>
          )}

          {/* The problem */}
          {Array.isArray(project.challenge) && project.challenge.length > 0 && (
            <section className="project-detail__section">
              <span className="mono project-detail__label">The problem</span>
              <div className="project-detail__text">
                {project.challenge.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </section>
          )}

          {/* Architecture — a diagram plus the numbered flow through it */}
          {project.architecture && (
            <section
              className="project-detail__section project-detail__section--wide"
              style={project.accent ? { '--card-accent': project.accent } : undefined}
            >
              <span className="mono project-detail__label">Architecture</span>
              {project.architecture.image && (
                <figure className="project-detail__figure">
                  <a href={project.architecture.image} target="_blank" rel="noreferrer">
                    <img src={project.architecture.image} alt={project.architecture.alt || `${project.title} architecture`} loading="lazy" />
                  </a>
                  {project.architecture.caption && <figcaption>{project.architecture.caption}</figcaption>}
                </figure>
              )}
              {Array.isArray(project.architecture.steps) && project.architecture.steps.length > 0 && (
                <ol className="project-detail__steps">
                  {project.architecture.steps.map((step, i) => (
                    <li key={i} className="project-detail__step">
                      <span className="mono project-detail__step-index">{String(i + 1).padStart(2, '0')}</span>
                      <h4 className="project-detail__feature-title">{step.title}</h4>
                      <p className="project-detail__feature-desc">{step.desc}</p>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          )}

          {/* Inside the product — captioned screens */}
          {Array.isArray(project.screens) && project.screens.length > 0 && (
            <section className="project-detail__section project-detail__section--wide">
              <span className="mono project-detail__label">Inside the product</span>
              <div className="project-detail__screens">
                {project.screens.map((screen, i) => (
                  <figure key={i} className={`project-detail__figure${screen.wide ? ' project-detail__figure--wide' : ''}`}>
                    <a href={screen.src} target="_blank" rel="noreferrer">
                      <img src={screen.src} alt={screen.alt || screen.caption || `${project.title} — ${i + 1}`} loading="lazy" />
                    </a>
                    {screen.caption && <figcaption>{screen.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            </section>
          )}

          {/* Architecture & Features */}
          {project.features && project.features.length > 0 && (
            <section className="project-detail__section project-detail__features-section">
              <span className="mono project-detail__label">{project.architecture ? 'Features' : 'Architecture & Features'}</span>
              <div className="project-detail__features-grid">
                {project.features.map((f, i) => (
                  <div key={i} className="project-detail__feature-card">
                    <h4 className="project-detail__feature-title">{f.title}</h4>
                    <p className="project-detail__feature-desc">{f.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Highlights */}
          {project.highlights && project.highlights.length > 0 && (
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
          )}

          {/* Key decisions & trade-offs */}
          {Array.isArray(project.decisions) && project.decisions.length > 0 && (
            <section className="project-detail__section">
              <span className="mono project-detail__label">Key decisions</span>
              <div className="project-detail__features-grid project-detail__features-grid--pairs">
                {project.decisions.map((d, i) => (
                  <div key={i} className="project-detail__feature-card">
                    <h4 className="project-detail__feature-title">{d.title}</h4>
                    <p className="project-detail__feature-desc">{d.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* What's next */}
          {Array.isArray(project.roadmap) && project.roadmap.length > 0 && (
            <section className="project-detail__section">
              <span className="mono project-detail__label">What&apos;s next</span>
              <ul className="project-detail__highlights">
                {project.roadmap.map((item, i) => (
                  <li key={i}>
                    <span className="project-detail__hl-index">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Gallery */}
          {Array.isArray(project.gallery) && project.gallery.length > 0 && (
            <section className="project-detail__section">
              <span className="mono project-detail__label">Gallery</span>
              <div className="project-detail__gallery">
                {project.gallery.map((src, i) => (
                  <img key={i} src={src} alt={`${project.title} — ${i + 1}`} loading="lazy" />
                ))}
              </div>
            </section>
          )}

          {/* Order one like it */}
          <section className="project-detail__order" style={project.accent ? { '--card-accent': project.accent } : undefined}>
            <div>
              <p className="mono project-detail__label">Want something like this?</p>
              <h2 className="project-detail__order-title">I can build one for you.</h2>
              <p className="project-detail__order-text">
                Tell me what you have in mind — I&apos;ll reply with questions, a plan and a quote.
              </p>
            </div>
            <div className="project-detail__order-actions">
              <a href={interestHref(`Something like ${project.title}`)} className="project-detail__order-cta">
                Build me one like this <span aria-hidden="true">↗</span>
              </a>
              <a
                href="https://wa.me/918270942966?text=Hi%20Vimal%2C%20I%27d%20like%20to%20talk%20about%20a%20project"
                target="_blank"
                rel="noreferrer"
                className="project-detail__order-alt"
              >
                or WhatsApp me
              </a>
            </div>
          </section>

          {/* Next project */}
          {nextProject && (
            <Link href={`/projects/${nextProject.slug}`} className="project-detail__next">
              <span className="mono project-detail__label">Next project</span>
              <span className="display project-detail__next-title">
                {nextProject.title} <span className="project-detail__next-arrow">→</span>
              </span>
            </Link>
          )}

          {/* Feedback Form */}
          <section className="project-detail__section" style={{ marginTop: '80px', borderTop: '1px solid var(--line)', paddingTop: '40px' }}>
            <div className="project-detail__engagement">
              <LikeButton path={`/projects/${project.slug}`} />
            </div>
            
            <FeedbackForm path={`/projects/${project.slug}`} />
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}
