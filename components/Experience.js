import Reveal from './Reveal'

const experiences = [
  {
    id: 1,
    company: 'i Qube',
    position: 'Software Developer',
    date: 'March 2024 - Present',
    description:
      'Developed a Mobile,Labtop and Tv friendly Ott software for Audio Syncronization, Using Web and App development',
  },
  {
    id: 2,
    company: 'Quantum Pulse Technology',
    position: 'Frontend Developer',
    date: 'Feb 2024 to Present',
    description:
      'Created Frontend design and functionalies for our collage website using React,Tailwind,MySql',
  },
  {
    id: 3,
    company: 'RV Tech Learn',
    position: 'Web Development',
    date: 'March 2024 - July 2024',
    description:
      'Developed a Full website from scratch using HTML, CSS, JS for the couching comapy "RV Tech Learn" and hosted it i GoDaddy',
  },
]

export default function Experience() {
  return (
    <section className="section section--light" id="experience">
      <div className="container">
        <div className="section__header">
          <Reveal>
            <span className="eyebrow">Experience</span>
            <h2 className="headline">Where I&apos;ve worked.</h2>
          </Reveal>
        </div>

        <div className="experience__list">
          {experiences.map((exp, index) => (
            <Reveal key={exp.id} delay={index * 80}>
              <article className="experience__item">
                <div>
                  <h3 className="experience__company">{exp.company}</h3>
                  <span className="experience__date">{exp.date}</span>
                </div>
                <div>
                  <p className="experience__role">{exp.position}</p>
                  <p className="experience__description">{exp.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
