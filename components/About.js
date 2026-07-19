import Reveal from './Reveal'
import TextGenerateEffect from './ui/text-generate-effect'

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
          <TextGenerateEffect
            className="about__statement"
            words="Vimal (he/him) is a **web & AR/VR developer** with a passion for immersive, user-friendly digital solutions. Based in **Coimbatore, India**, he brings years of experience in web development and design across industries — crafting engaging websites and advancing AR/VR experiences."
          />

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
