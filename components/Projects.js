import Reveal from './Reveal'

const projects = [
  {
    id: 1,
    title: 'D-MART Analysis',
    description:
      "This project offers a deep dive into D-Mart's grocery sales data, providing key business insights and a highly accurate machine learning model for future sales forecasting.",
    image: '/assets/img/ANALYSIS.png',
    link: 'https://ltqapcfmatgt2.mocha.app/',
    skills: ['/assets/img/python.svg'],
  },
  {
    id: 2,
    title: 'Carspace',
    description:
      'A web app for buying and selling second-hand cars, integrated with Firebase for real-time data and user authentication, built with React and Tailwind CSS.',
    image: '/assets/img/Carspace.png',
    link: 'https://secondhandcarapp.web.app/',
    skills: [
      '/assets/img/skills-react.svg',
      '/assets/img/skills-html.svg',
      '/assets/img/skills-tailwind-css.svg',
      '/assets/img/firebase-svgrepo-com.svg',
    ],
  },
  {
    id: 3,
    title: 'D7 Sports',
    description:
      'A sports management platform with real-time updates and analytics, powered by MongoDB for data storage and React for the frontend.',
    image: '/assets/img/D7.png',
    link: 'https://drive.google.com/file/d/18_hxmycJTo6qIy9MebsEbzJyGbl6s_Tz/view?usp=sharing',
    skills: [
      '/assets/img/skills-react.svg',
      '/assets/img/skills-html.svg',
      '/assets/img/skills-css.svg',
      '/assets/img/MongoDB.svg',
    ],
  },
  {
    id: 4,
    title: 'Interior Design Prototype',
    description:
      'An interactive desktop prototype for interior design visualization, showcasing minimalist aesthetics with React and Tailwind CSS.',
    image: '/assets/img/White and Brown Minimalist Interior Desktop Prototype.gif',
    link: '#',
    skills: [
      '/assets/img/skills-react.svg',
      '/assets/img/skills-html.svg',
      '/assets/img/skills-tailwind-css.svg',
    ],
  },
  {
    id: 5,
    title: 'AR Mart',
    description:
      'An augmented reality shopping platform that allows users to visualize products in 3D before purchase, built with React and AR.js for an immersive experience.',
    image: '/assets/img/AR_Mart.png',
    link: '#',
    skills: [
      '/assets/img/skills-react.svg',
      '/assets/img/skills-html.svg',
      '/assets/img/skills-tailwind-css.svg',
      '/assets/img/unity-svgrepo-com.svg',
    ],
  },
  {
    id: 6,
    title: 'PricePulse',
    description:
      'A price comparison website that aggregates data from multiple e-commerce platforms, designed with React and styled using Tailwind CSS for a sleek UI.',
    image: '/assets/img/Comapre_website.png',
    link: '#',
    skills: [
      '/assets/img/skills-react.svg',
      '/assets/img/skills-html.svg',
      '/assets/img/skills-tailwind-css.svg',
      '/assets/img/python.svg',
    ],
  },
  {
    id: 7,
    title: 'Namwear Oversized T-shirt Design',
    description:
      "A modern T-shirt design for Namwear's Oversized collection, crafted in Figma with a pastel gradient aesthetic and interactive prototyping.",
    image: '/assets/img/namwear-design.png',
    link: 'https://www.figma.com/proto/TX6zJj6Lz5934ZjVsanK5M/vs?page-id=0%3A1&node-id=984-372&viewport=-20038%2C-5262%2C0.31&t=zYGrmhAeN2Xhj9fw-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=1004%3A291&show-proto-sidebar=1',
    skills: ['/assets/img/skills-figma.svg'],
  },
]

// 3D tilt on hover (mouse only — touch devices skip it)
function handleTilt(e) {
  const card = e.currentTarget
  const rect = card.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width - 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5
  card.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${y * -6}deg) translateY(-4px)`
}

function resetTilt(e) {
  e.currentTarget.style.transform = ''
}

export default function Projects() {
  return (
    <section className="section section--dark" id="projects">
      <div className="container container--wide">
        <div className="section__header">
          <Reveal>
            <span className="eyebrow">Portfolio</span>
            <h2 className="headline">Recent work.</h2>
          </Reveal>
        </div>

        <div className="projects__grid">
          {projects.map((project, index) => (
            <Reveal key={project.id} delay={(index % 3) * 90}>
              <article
                className="project-card"
                onMouseMove={handleTilt}
                onMouseLeave={resetTilt}
              >
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="project-card__media"
                  tabIndex={-1}
                >
                  <img src={project.image} alt={project.title} loading="lazy" />
                </a>
                <div className="project-card__body">
                  <h3 className="project-card__name">{project.title}</h3>
                  <p className="project-card__description">{project.description}</p>
                  <div className="project-card__skills">
                    {project.skills.map((skill, i) => (
                      <img key={i} src={skill} alt="" loading="lazy" />
                    ))}
                  </div>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="link-more"
                  >
                    Visit project
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
