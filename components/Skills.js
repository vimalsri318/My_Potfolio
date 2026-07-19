import Reveal from './Reveal'

export default function Skills() {
  return (
    <section className="section section--light" id="skills">
      <div className="container">
        <div className="section__header">
          <Reveal>
            <span className="eyebrow">Skills</span>
            <h2 className="headline">Built with the right tools.</h2>
            <p className="subhead" style={{ marginTop: 14 }}>
              Skilled in web tech and design tools for responsive, scalable apps.
            </p>
          </Reveal>
        </div>

        <div className="bento">
          <Reveal className="bento__tile bento__tile--span2">
            <span className="bento__label">Core stack</span>
            <h3 className="bento__title">The web, end to end.</h3>
            <div className="bento__icons">
              <img src="/assets/img/skills-html.svg" alt="HTML" title="HTML" />
              <img src="/assets/img/skills-css.svg" alt="CSS" title="CSS" />
              <img src="/assets/img/skills-javascript.svg" alt="JavaScript" title="JavaScript" />
              <img src="/assets/img/skills-react.svg" alt="React" title="React" />
              <img src="/assets/img/skills-tailwind-css.svg" alt="Tailwind CSS" title="Tailwind CSS" />
              <img src="/assets/img/skills-sass.svg" alt="Sass" title="Sass" />
            </div>
          </Reveal>

          <Reveal delay={80} className="bento__tile bento__tile--dark">
            <span className="bento__label">Immersive</span>
            <h3 className="bento__title">AR / VR</h3>
            <div className="bento__icons">
              <img src="/assets/img/unity-svgrepo-com.svg" alt="Unity" title="Unity" />
            </div>
          </Reveal>

          <Reveal delay={160} className="bento__tile">
            <span className="bento__label">Design</span>
            <h3 className="bento__title">Pixel care.</h3>
            <div className="bento__icons">
              <img src="/assets/img/skills-figma.svg" alt="Figma" title="Figma" />
              <img src="/assets/img/skills-photoshop.svg" alt="Photoshop" title="Photoshop" />
            </div>
          </Reveal>

          <Reveal delay={220} className="bento__tile bento__tile--span2">
            <span className="bento__label">Workflow</span>
            <h3 className="bento__title">Version-controlled, always.</h3>
            <div className="bento__icons">
              <img src="/assets/img/skills-git.svg" alt="Git" title="Git" />
              <img src="/assets/img/skills-github.svg" alt="GitHub" title="GitHub" />
            </div>
          </Reveal>

          <Reveal delay={280} className="bento__tile bento__tile--span2">
            <span className="bento__label">Data</span>
            <h3 className="bento__title">Backed by real data.</h3>
            <div className="bento__icons">
              <img src="/assets/img/python.svg" alt="Python" title="Python" />
              <img src="/assets/img/MongoDB.svg" alt="MongoDB" title="MongoDB" />
              <img src="/assets/img/firebase-svgrepo-com.svg" alt="Firebase" title="Firebase" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
