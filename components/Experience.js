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
    <section className="section" id="experience">
      <div className="container">
        <p className="mono" style={{ color: 'var(--ink-soft)', marginBottom: 26 }}>
          Where I&apos;ve worked
        </p>
        <Reveal>
          <div className="exp__list">
            {experiences.map(exp => (
              <article key={exp.id} className="exp__row">
                <h3 className="exp__company">{exp.company}</h3>
                <div className="exp__meta">
                  {exp.position}
                  <br />
                  {exp.date}
                </div>
                <p className="exp__description">{exp.description}</p>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
