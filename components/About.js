import Reveal from './Reveal'
import TextGenerateEffect from './ui/text-generate-effect'

export default function About() {
  return (
    <section className="section" id="about">
      <div className="container about">
        <div className="side-label" aria-hidden="true">
          <span className="side-label__arrow">↘</span>
          <span>ABOUT</span>
        </div>

        <Reveal>
          <TextGenerateEffect
            className="about__statement"
            words="Vimal (he/him) is an **AI developer & architect** building intelligent, production-ready systems. Based in **Coimbatore, India**, he has worked across **AI & ML products** — from data-driven platforms to **RAG chatbots** running in production for clients — alongside end-to-end full-stack engineering. Web & AR/VR began as a hobby, and it still shapes how his products look and feel."
          />

          <p className="about__crosspath">
            Building at the crosspaths of AI ⎯ full-stack ⎯ product.
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
