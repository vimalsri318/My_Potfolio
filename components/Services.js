import Reveal from './Reveal'

const services = [
  {
    id: 1,
    kicker: 'Build fast, ship faster',
    title: 'Web Development.',
    description:
      'Responsive, high-performance websites tailored to client needs using modern frameworks.',
    tags: ['#REACT', '#NEXTJS', '#TAILWIND'],
  },
  {
    id: 2,
    kicker: 'Step inside the screen',
    title: 'AR/VR Development.',
    description:
      'Immersive augmented and virtual reality experiences for e-commerce, gaming, and education.',
    tags: ['#ARJS', '#UNITY', '#3D'],
  },
  {
    id: 3,
    kicker: 'Pixels with purpose',
    title: 'UI/UX Design.',
    description:
      'Intuitive, visually appealing interfaces ensuring seamless user experiences across devices.',
    tags: ['#FIGMA', '#PHOTOSHOP'],
  },
]

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
