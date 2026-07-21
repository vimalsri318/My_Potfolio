export default function Home() {
  return (
    <section className="home section" id="home">
      <div className="home__container container grid">
        {/* Profile */}
        <div className="perfil">
          <img src="/assets/img/home-perfil.png" alt="Vimal Srinivasan Profile" className="perfil__img" />
          <div className="perfil__data">
            <h1 className="perfil__name" style={{color: 'linear-gradient(to right, #0090f7, #ba62fc, #f2416b)'}}>
              Vimal Srinivasan
            </h1>
            <div className="perfil__button">
              <a href="#projects" className="button">Projects</a>
              <a href="#services" className="button button__black">Services</a>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="info">
          <div className="info__data">
            <div className="info__circle"></div>
            <h1 className="info__name">VimalSrinivasan</h1>
          </div>
          <div className="info__image">
            <img src="/assets/img/1000071216-02 (1).jpeg" alt="Vimal Srinivasan" className="info__img" />
          </div>
          <p className="info__description">
            Web & AR/VR Developer passionate about immersive, user-friendly digital solutions.
          </p>
          <a href="/assets/pdf/Vimalsrinivasan_Resume.pdf" download target="_blank" className="button button__black">
            Download CV
          </a>
        </div>

        {/* About */}
        <div className="about">
          <h3 className="about__name">
            VimalSrinivasan - <b>Web & AR/VR Developer</b>
          </h3>
          <p className="about__description">
            Based in Coimbatore, I bring years of experience in web development and design across industries.
          </p>
          <div className="about__social">
            <a href="https://www.linkedin.com/in/vimalsrinivasan-r/" target="_blank" className="about__link">
              <i className="ri-linkedin-box-line"></i>
            </a>
            <a href="https://github.com/vimalsri318" target="_blank" className="about__link">
              <i className="ri-github-line"></i>
            </a>
            <a href="https://www.behance.net/vimalsrinivasan" target="_blank" className="about__link">
              <i className="ri-behance-line"></i>
            </a>
          </div>
          <div className="about__image">
            <img src="/assets/img/about-perfil.png" alt="About Vimal Srinivasan" className="about__img" />
          </div>
          <p className="about__note">
            I Love crafting engaging websites and advancing AR/VR experiences.
          </p>
          <a href="#contact" className="button">Contact Me</a>
        </div>

        {/* Skills */}
        <div className="skills">
          <h2 className="skills__title">Skills</h2>
          <div className="skills__items">
            <img src="/assets/img/skills-html.svg" alt="HTML" className="skills__item" />
            <img src="/assets/img/skills-css.svg" alt="CSS" className="skills__item" />
            <img src="/assets/img/skills-javascript.svg" alt="JavaScript" className="skills__item" />
            <img src="/assets/img/skills-react.svg" alt="React" className="skills__item" />
            <img src="/assets/img/skills-git.svg" alt="Git" className="skills__item" />
            <img src="/assets/img/skills-github.svg" alt="GitHub" className="skills__item" />
            <img src="/assets/img/skills-sass.svg" alt="Sass" className="skills__item" />
            <img src="/assets/img/skills-tailwind-css.svg" alt="Tailwind CSS" className="skills__item" />
            <img src="/assets/img/skills-figma.svg" alt="Figma" className="skills__item" />
            <img src="/assets/img/skills-photoshop.svg" alt="Photoshop" className="skills__item" />
          </div>
          <p className="skills_discription" style={{color: '#555555'}}>
            Skilled in web tech and design tools for responsive, scalable apps.
          </p>
        </div>
      </div>
    </section>
  )
}