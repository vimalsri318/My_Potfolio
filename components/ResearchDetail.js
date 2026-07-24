import { useRef, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Navigation from './Navigation'
import Footer from './Footer'
import Reveal from './Reveal'
import FeedbackForm from './FeedbackForm'
import LikeButton from './LikeButton'
import { useTrackView } from '../hooks/useTrackView'

// Renders one research/learning entry as a full, shareable article.
// Pass an entry (and the next one) as props — the `body` blocks in
// data/research.js are turned into the article below.

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// The interactive demo as a big, full-width hero with a real
// fullscreen button. This is the priority — readers can play with it
// first, then read the write-up below.
function InteractiveStage({ src, title }) {
  const frameRef = useRef(null)
  const [active, setActive] = useState(false)

  const openFullscreen = () => {
    const el = frameRef.current
    if (!el) return
    const req =
      el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen
    // Fall back to opening the app in a new tab if the Fullscreen API is
    // missing or blocked (e.g. by a browser permissions policy).
    const openTab = () => window.open(src, '_blank', 'noopener,noreferrer')
    if (!req) return openTab()
    try {
      const result = req.call(el)
      if (result && typeof result.catch === 'function') result.catch(openTab)
    } catch {
      openTab()
    }
  }

  return (
    <section className="research-stage">
      <div className="research-stage__bar">
        <span className="mono research-stage__label">▶ Interactive walkthrough</span>
        <div className="research-stage__actions">
          <button
            type="button"
            onClick={openFullscreen}
            className="research-stage__btn research-stage__btn--primary"
          >
            ⛶ Open full screen
          </button>
          <a
            href={src}
            target="_blank"
            rel="noreferrer"
            className="research-stage__btn"
          >
            New tab ↗
          </a>
        </div>
      </div>
      <div ref={frameRef} className={`research-stage__frame ${active ? 'is-active' : ''}`}>
        <iframe
          src={src}
          title={title || 'Interactive walkthrough'}
          allow="fullscreen"
          allowFullScreen
        />
        {/* Mobile: the iframe is inert until tapped, so a touch-drag scrolls
            the page past the card. A tap activates it for scrolling inside. */}
        {!active && (
          <button
            type="button"
            className="research-stage__activate"
            onClick={() => setActive(true)}
            aria-label="Interact with the walkthrough"
          >
            <span className="research-stage__activate-icon" aria-hidden="true">⤢</span>
          </button>
        )}
      </div>
      <p className="research-stage__hint mono">
        Scroll and click inside to move through the stages — or open full screen for the full experience.
      </p>
    </section>
  )
}

// One `body` block -> one piece of the article.
function Block({ block }) {
  switch (block.type) {
    case 'heading':
      return <h2 className="research__h2">{block.text}</h2>
    case 'paragraph':
      return <p className="research__p">{block.text}</p>
    case 'list':
      return (
        <ul className="research__list">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )
    case 'image':
      return (
        <figure className="research__figure">
          <img src={block.src} alt={block.caption || ''} />
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      )
    case 'code':
      return (
        <pre className="research__code">
          {block.language && (
            <span className="research__code-lang mono">{block.language}</span>
          )}
          <code>{block.text}</code>
        </pre>
      )
    case 'quote':
      return <blockquote className="research__quote">{block.text}</blockquote>
    case 'embed':
      // Full-bleed interactive demo — an isolated app loaded in an iframe.
      return (
        <figure className="research__embed">
          <div className="research__embed-frame" style={block.height ? { height: block.height } : undefined}>
            <iframe
              src={block.src}
              title={block.title || 'Interactive demo'}
              loading="lazy"
              allow="fullscreen"
            />
          </div>
          <figcaption className="research__embed-hint mono">
            {block.caption || 'Scroll and click inside to explore ↑'}
          </figcaption>
        </figure>
      )
    default:
      return null
  }
}

export default function ResearchDetail({ entry, nextEntry }) {
  useTrackView(entry?.slug)

  if (!entry) return null

  const hasResources = entry.resources && entry.resources.length > 0
  const hasDownloads = entry.downloads && entry.downloads.length > 0

  return (
    <>
      <Head>
        <title>{`${entry.title} — Vimal Srinivasan`}</title>
        <meta name="description" content={entry.summary} />
        {/* Open Graph — nice preview when the link is shared on LinkedIn */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={entry.title} />
        <meta property="og:description" content={entry.summary} />
        {entry.cover && <meta property="og:image" content={entry.cover} />}
        <link rel="shortcut icon" href="/assets/img/favicon.png" type="image/x-icon" />
      </Head>

      <Navigation />

      <main className="main project-detail">
        <div className="container">
          <Link href="/research" className="project-detail__back mono">
            ← Back to research
          </Link>

          {/* Header */}
          <header className="project-detail__header">
            <p className="mono project-detail__meta-line">
              {entry.topic}
              {entry.date && (
                <>
                  {' '}
                  <span className="project-detail__dot">●</span> {formatDate(entry.date)}
                </>
              )}
              {entry.readingTime && (
                <>
                  {' '}
                  <span className="project-detail__dot">●</span> {entry.readingTime}
                </>
              )}
            </p>
            <h1 className="display project-detail__title">{entry.title}</h1>
            <p className="project-detail__summary">{entry.summary}</p>

            {entry.tags && entry.tags.length > 0 && (
              <div className="card__tags research__tags">
                {entry.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Interactive walkthrough — the priority. Sits right up top so
              readers play with it first. Falls back to a static cover image
              for entries that don't have an interactive. */}
          {entry.interactive ? (
            <InteractiveStage src={entry.interactive.src} title={entry.interactive.title} />
          ) : (
            entry.cover && (
              <Reveal>
                <div className="project-detail__hero">
                  <img src={entry.cover} alt={entry.title} />
                </div>
              </Reveal>
            )
          )}

          {/* The material */}
          <article className="research__body">
            {entry.body.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </article>

          {/* Downloads */}
          {hasDownloads && (
            <section className="research__aside">
              <span className="mono project-detail__label">Materials</span>
              <ul className="research__links">
                {entry.downloads.map((file, i) => (
                  <li key={i}>
                    <a href={file.href} download className="research__link">
                      ↓ {file.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Resources / external links */}
          {hasResources && (
            <section className="research__aside">
              <span className="mono project-detail__label">Resources</span>
              <ul className="research__links">
                {entry.resources.map((res, i) => (
                  <li key={i}>
                    <a
                      href={res.href}
                      target="_blank"
                      rel="noreferrer"
                      className="research__link"
                    >
                      {res.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Next read */}
          {nextEntry && (
            <Link href={`/research/${nextEntry.slug}`} className="project-detail__next">
              <span className="mono project-detail__label">Next read</span>
              <span className="display project-detail__next-title">
                {nextEntry.title} <span className="project-detail__next-arrow">→</span>
              </span>
            </Link>
          )}

          {/* Feedback Form */}
          <section className="project-detail__section" style={{ marginTop: '80px', borderTop: '1px solid var(--line)', paddingTop: '40px' }}>
            <div className="research-detail__engagement">
              <LikeButton path={`/research/${entry.slug}`} />
            </div>
            
            <FeedbackForm path={`/research/${entry.slug}`} />
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}
