export default function Services() {
  const services = [
    {
      id: 1,
      icon: "ri-code-box-line",
      title: "Web Development",
      description: "Building responsive, high-performance websites tailored to client needs using modern frameworks like React, HTML, CSS, and JavaScript."
    },
    {
      id: 2,
      icon: "ri-vidicon-line",
      title: "AR/VR Development",
      description: "Creating immersive augmented and virtual reality experiences for applications in e-commerce, gaming, and education using tools like AR.js and Unity."
    },
    {
      id: 3,
      icon: "ri-pencil-ruler-2-line",
      title: "UI/UX Design",
      description: "Designing intuitive and visually appealing interfaces with tools like Figma and Photoshop, ensuring seamless user experiences across devices."
    }
  ]

  return (
    <section className="services section" id="services">
      <h2 className="section__title">SERVICES</h2>
      <div className="services__container container grid">
        {services.map(service => (
          <article key={service.id} className="services__card">
            <div className="services__icon">
              <div className="services__circle"></div>
              <i className={service.icon} style={{color: '#555555'}}></i>
            </div>
            <h3 className="services__name">{service.title}</h3>
            <p className="services__description">
              {service.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}