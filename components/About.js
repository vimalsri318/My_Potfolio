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
              words="I ship **products, not prototypes**. Web apps, mobile apps, full-stack builds that go from idea to something **real people use**. Based in **Coimbatore**, I work end-to-end — front to back, web to mobile — and bring **AI** in where it actually earns its place: chatbots, fine-tuned models, systems that feel intelligent instead of bolted-on. Web and AR/VR started as side projects, and they're still why I care as much about **how something feels** to use as whether it works."
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
