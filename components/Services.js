import Link from 'next/link'
import Reveal from './Reveal'
import services from '../data/services'
import { requestInterest } from '../lib/interest'

// Services as offers: what you get, which shipped projects prove it, and a
// button that pre-fills the contact form. `projects` are the visible
// projects, used to resolve each offer's proof slugs.
export default function Services({ projects = [] }) {
  const bySlug = Object.fromEntries(projects.map((p) => [p.slug, p]))

  return (
    <section className="offers" id="services">
      <div className="offers__container">
        <header className="offers__head">
          <p className="offers__eyebrow">Services</p>
          <h2 className="offers__title">Hire me to build it.</h2>
          <p className="offers__lede">
            Pick what you need. Every offer is backed by something I&apos;ve already shipped.
          </p>
        </header>

        <ul className="offers__grid">
          {services.map((s, i) => {
            const proof = (s.proof || []).map((slug) => bySlug[slug]).filter(Boolean)
            return (
              <Reveal as="li" key={s.id} delay={(i % 3) * 70} className="offers__cell">
                <article className="offer">
                  <p className="offer__kicker">{s.kicker}</p>
                  <h3 className="offer__title">{s.title}</h3>
                  <p className="offer__desc">{s.description}</p>
                  <ul className="offer__list">
                    {s.deliverables.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>

                  {proof.length > 0 && (
                    <div className="offer__proof">
                      <span className="offer__proof-label">Shipped in</span>
                      <div className="offer__proof-items">
                        {proof.map((p) => (
                          <Link
                            key={p.slug}
                            href={`/projects/${p.slug}`}
                            className="offer__proof-item"
                            style={p.accent ? { '--card-accent': p.accent } : undefined}
                          >
                            <span className="offer__proof-dot" aria-hidden="true" />
                            {p.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="offer__foot">
                    <span className="offer__price">{s.startingAt ? `From ${s.startingAt}` : 'Custom quote'}</span>
                    <a
                      href="#contact"
                      className="offer__cta"
                      onClick={(e) => {
                        e.preventDefault()
                        requestInterest(s.title)
                      }}
                    >
                      Request this <span aria-hidden="true">→</span>
                    </a>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
