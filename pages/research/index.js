import Head from 'next/head'
import Link from 'next/link'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import Reveal from '../../components/Reveal'
import { getResearchSorted } from '../../lib/contentStore'
import { getVisibility } from '../../lib/visibility'
import { useTrackView } from '../../hooks/useTrackView'

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// Research & learnings index. Everything comes from Supabase —
// add an entry there and it shows up here automatically, newest first.
export default function ResearchPage({ entries }) {
  useTrackView('research')

  return (
    <>
      <Head>
        <title>Research & Learnings — Vimal Srinivasan</title>
        <meta
          name="description"
          content="Research notes and learnings by Vimal Srinivasan — AI, RAG, machine learning and full-stack engineering, written up to share and study."
        />
        <link rel="shortcut icon" href="/assets/img/favicon.png" type="image/x-icon" />
      </Head>

      <Navigation />

      <main className="main project-detail">
        <div className="container">
          <Link href="/" className="project-detail__back mono">
            ← Back home
          </Link>

          <header className="project-detail__header">
            <p className="mono project-detail__meta-line">Research &amp; learnings</p>
            <h1 className="display project-detail__title">Research.</h1>
            <p className="project-detail__summary">
              A running notebook of what I&apos;m learning and building — AI, RAG,
              machine learning and the web. Every note has its own link, so I can
              point you straight to it.
            </p>
          </header>

          {entries.length === 0 ? (
            <p className="research__empty mono">First notes are on the way.</p>
          ) : (
            <ul className="research-list">
              {entries.map((entry, i) => (
                <Reveal key={entry.id} delay={i * 80}>
                  <li className="research-list__item">
                    <Link
                      href={`/research/${entry.slug}`}
                      className={`research-list__link ${entry.cover ? 'has-thumb' : ''}`}
                    >
                      {entry.cover && (
                        <div className="research-list__thumb">
                          <img src={entry.cover} alt={entry.title} loading="lazy" />
                          {entry.interactive && (
                            <span className="research-list__badge mono">▶ Interactive</span>
                          )}
                        </div>
                      )}
                      <div className="research-list__content">
                        <div className="research-list__meta mono">
                          <span>{formatDate(entry.date)}</span>
                          <span className="project-detail__dot">●</span>
                          <span>{entry.topic}</span>
                        </div>
                        <h2 className="research-list__title">{entry.title}</h2>
                        <p className="research-list__summary">{entry.summary}</p>
                        {entry.tags && entry.tags.length > 0 && (
                          <div className="card__tags">
                            {entry.tags.map((tag) => (
                              <span key={tag} className="tag">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <span className="research-list__more mono">
                          Read <span className="research-list__arrow">→</span>
                        </span>
                      </div>
                    </Link>
                  </li>
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}

export async function getStaticProps() {
  const { hiddenResearch } = await getVisibility()
  const entries = getResearchSorted().filter((r) => !hiddenResearch.includes(r.slug))
  return {
    props: { entries },
    revalidate: 15, // ISR: reflect admin publish/unpublish toggles quickly
  }
}
