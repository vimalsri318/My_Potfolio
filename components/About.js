import Reveal from './Reveal'
import TextGenerateEffect from './ui/text-generate-effect'
import SpotlightText from './ui/spotlight-text'

export default function About() {
  return (
    <section className="section" id="about">
      <div className="container about">
        <div className="about__grid">
          {/* Big interactive label on the left — hover it and the letters
              turn to outline under the cursor. */}
          <div className="about__aside">
            <span className="about__arrow" aria-hidden="true">↘</span>
            <SpotlightText className="about__big" text="About" radius={130} />
          </div>

          {/* Plain content on the right — no card */}
          <Reveal className="about__content">
            <TextGenerateEffect
              className="about__statement"
              words="Vimal (he/him) is an **AI developer & architect** building intelligent, production-ready systems. Based in **Coimbatore, India**, he has worked across **AI & ML products** — from data-driven platforms to **RAG chatbots** running in production for clients — alongside end-to-end full-stack engineering. Web & AR/VR began as a hobby, and it still shapes how his products look and feel"
            />

            <p className="about__crosspath">
              Building at the crosspaths of AI ⎯ full-stack ⎯ product
            </p>

            <p className="about__role">Software Developer</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
