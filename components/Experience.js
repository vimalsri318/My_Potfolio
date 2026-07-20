import Reveal from './Reveal'

const experiences = [
  {
    id: 1,
    company: 'i Qube',
    position: 'Software Developer',
    date: 'March 2024 - Present',
    description:
      'Developed a mobile-, laptop- and TV-friendly OTT platform for audio synchronization, using web and app development.',
  },
  {
    id: 2,
    company: 'Quantum Pulse Technology',
    position: 'Frontend Developer',
    date: 'Feb 2024 to Present',
    description:
      'Created the frontend design and functionality for our college website using React, Tailwind and MySQL.',
  },
  {
    id: 3,
    company: 'RV Tech Learn',
    position: 'Web Development',
    date: 'March 2024 - July 2024',
    description:
      'Developed a full website from scratch using HTML, CSS and JS for the coaching company "RV Tech Learn" and hosted it on GoDaddy.',
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
