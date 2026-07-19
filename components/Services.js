import Reveal from './Reveal'

const services = [
  {
    id: 1,
    icon: 'ri-code-box-line',
    title: 'Web Development',
    description:
      'Building responsive, high-performance websites tailored to client needs using modern frameworks like React, HTML, CSS, and JavaScript.',
  },
  {
    id: 2,
    icon: 'ri-vidicon-line',
    title: 'AR/VR Development',
    description:
      'Creating immersive augmented and virtual reality experiences for applications in e-commerce, gaming, and education using tools like AR.js and Unity.',
  },
  {
    id: 3,
    icon: 'ri-pencil-ruler-2-line',
    title: 'UI/UX Design',
    description:
      'Designing intuitive and visually appealing interfaces with tools like Figma and Photoshop, ensuring seamless user experiences across devices.',
  },
]

export default function Services() {
  return (
    <section className="section section--light" id="services">
      <div className="container">
        <div className="section__header">
          <Reveal>
            <span className="eyebrow">Services</span>
            <h2 className="headline">What I can do for you.</h2>
          </Reveal>
        </div>

        <div className="services__grid">
          {services.map((service, index) => (
            <Reveal key={service.id} delay={index * 100}>
              <article className="service-card">
                <div className="service-card__icon">
                  <i className={service.icon}></i>
                </div>
                <h3 className="service-card__name">{service.title}</h3>
                <p className="service-card__description">{service.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
