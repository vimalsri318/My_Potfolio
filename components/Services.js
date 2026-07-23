import Reveal from './Reveal'
import services from '../data/services'

export default function Services() {
  return (
    <section className="section" id="services">
      <div className="container">
        <p className="mono" style={{ color: 'var(--ink-soft)', marginBottom: 26 }}>
          What I do ⎯ pick your flavour <span style={{ color: 'var(--accent)' }}>↗</span>
        </p>
        <div className="cards">
          {services.map((service, i) => (
            <Reveal key={service.id} delay={i * 90}>
              <article className="card">
                <span className="card__kicker">
                  {service.kicker} <span className="arrow">↗</span>
                </span>
                <p className="card__description">{service.description}</p>
                <div className="card__tags">
                  {service.tags.map(tag => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="card__title">{service.title}</h3>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
