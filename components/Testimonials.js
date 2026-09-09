import Reveal from './Reveal'

export default function Testimonials({ items = [] }) {
  if (!items || items.length === 0) return null

  return (
    <section className="section testimonials-section" id="testimonials">
      <div className="container">
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
            <div>
              <p className="mono" style={{ color: 'var(--ink-soft)', marginBottom: 8 }}>
                Client notes ⎯ trust & deliverables <span style={{ color: 'var(--accent)' }}>↗</span>
              </p>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
                Testimonials
              </h2>
            </div>
            <a
              href="/testimonial"
              className="mono"
              style={{
                fontSize: '0.8rem',
                color: 'var(--ink-soft)',
                textDecoration: 'none',
                borderBottom: '1px solid var(--line)',
                paddingBottom: 2,
                transition: 'color 0.2s',
              }}
            >
              Worked with me? Leave a review ↗
            </a>
          </div>
        </Reveal>

        <div className="testimonials-grid">
          {items.map((item, index) => {
            const hasAvatar = !!item.avatar_url
            const initials = (item.name || 'C')
              .split(' ')
              .map((w) => w[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)

            return (
              <Reveal key={item.id || index} delay={index * 80}>
                <article className={`testimonial-card ${item.is_featured ? 'is-featured' : ''}`}>
                  <div>
                    <div className="testimonial-card__quote-mark">&ldquo;</div>
                    <div className="testimonial-card__stars" aria-label={`${item.rating} out of 5 stars`}>
                      {'★'.repeat(item.rating) + '☆'.repeat(Math.max(0, 5 - item.rating))}
                    </div>
                    <p className="testimonial-card__content">{item.content}</p>
                  </div>

                  <div className="testimonial-card__author">
                    {hasAvatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.avatar_url}
                        alt={item.name}
                        className="testimonial-card__avatar"
                        loading="lazy"
                      />
                    ) : (
                      <div className="testimonial-card__avatar-fallback">{initials}</div>
                    )}

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="testimonial-card__name">
                        <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {item.name}
                        </span>
                        {item.linkedin_url && (
                          <a
                            href={item.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="testimonial-card__link"
                            title="View LinkedIn profile"
                            aria-label={`${item.name} on LinkedIn`}
                          >
                            ↗
                          </a>
                        )}
                      </div>

                      <div className="testimonial-card__title">
                        {[item.role, item.company].filter(Boolean).join(' · ')}
                      </div>

                      {item.project_name && (
                        <span className="testimonial-card__project-badge">
                          {item.project_name}
                        </span>
                      )}
                    </div>
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
