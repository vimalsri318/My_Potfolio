import Reveal from './Reveal'

export default function About() {
  return (
    <section className="section section--light" id="about">
      <div className="container">
        <Reveal>
          <span className="eyebrow">About</span>
          <p className="statement about__statement">
            Based in <strong>Coimbatore</strong>, I bring years of experience in{' '}
            <strong>web development</strong> and <strong>design</strong> across
            industries.
          </p>
        </Reveal>

        <div className="about__row">
          <Reveal>
            <div className="about__photo">
              <img src="/assets/img/1000071216-02 (1).jpeg" alt="Vimal Srinivasan" />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="about__meta">
              <p className="about__note">
                I love crafting engaging websites and advancing AR/VR experiences.
              </p>
              <div className="about__social">
                <a
                  href="https://www.linkedin.com/in/vimalsrinivasan-r/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                >
                  <i className="ri-linkedin-box-line"></i>
                </a>
                <a
                  href="https://github.com/vimalsri318"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                >
                  <i className="ri-github-line"></i>
                </a>
                <a
                  href="https://www.behance.net/vimalsrinivasan"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Behance"
                >
                  <i className="ri-behance-line"></i>
                </a>
              </div>
              <a href="#contact" className="btn btn--primary">
                Contact me
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
