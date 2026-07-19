import Reveal from './Reveal'

export default function About() {
  return (
    <section className="section" id="about">
      <div className="container about">
        <div className="side-label" aria-hidden="true">
          <span className="side-label__arrow">⤵</span>
          {'About'.split('').map((ch, i) => (
            <span key={i}>{ch}</span>
          ))}
        </div>

        <Reveal>
          <p className="about__statement">
            Vimal (he/him) is a <b>web &amp; AR/VR developer</b> with a passion for
            immersive, user-friendly digital solutions. Based in{' '}
            <b>Coimbatore, India</b>, he brings years of experience in web
            development and design across industries — crafting engaging websites
            and advancing AR/VR experiences.
          </p>

          <p className="about__crosspath">
            Building at the crosspaths of web ⎯ AR/VR ⎯ design.
          </p>

          <div className="about__role">
            <span className="about__role-title">Software Developer</span>
            <span className="about__role-company">i Qube</span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
