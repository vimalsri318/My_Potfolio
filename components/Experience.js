export default function Experience() {
  const experiences = [
    {
      id: 1,
      company: "i Qube",
      position: "Software Developer",
      date: "March 2024 - Present",
      description: "Developed a Mobile,Labtop and Tv friendly Ott software for Audio Syncronization, Using Web and App development"
    },
    {
      id: 2,
      company: "Quantum Pulse Technology",
      position: "Frontend Developer",
      date: "Feb 2024 to Present",
      description: "Created Frontend design and functionalies for our collage website using React,Tailwind,MySql"
    },
    {
      id: 3,
      company: "RV Tech Learn",
      position: "Web Development",
      date: "March 2024 - July 2024",
      description: "Developed a Full website from scratch using HTML, CSS, JS for the couching comapy \"RV Tech Learn\" and hosted it i GoDaddy"
    }
  ]

  return (
    <section className="experience section" id="experience">
      <h2 className="section__title">EXPERIENCE</h2>
      <div className="experience__container container grid">
        {experiences.map(exp => (
          <article key={exp.id} className="experience__card">
            <h2 className="experience__company">{exp.company}</h2>
            <div className="experiance__data">
              <h3 className="experiance__profession">{exp.position}</h3>
              <span className="experiance__date" style={{color: '#555555'}}>{exp.date}</span>
              <p className="experiance__description" style={{color: '#555555'}}>
                {exp.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}