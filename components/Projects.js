import { useState, useEffect } from 'react'
import Reveal from './Reveal'

const projects = [
  {
    id: 1,
    title: 'D-MART Analysis',
    category: 'Data analysis & Web app',
    image: '/assets/img/ANALYSIS.png',
    link: 'https://ltqapcfmatgt2.mocha.app/',
  },
  {
    id: 2,
    title: 'Carspace',
    category: 'E-commerce & Hybrid Web app',
    image: '/assets/img/Carspace.png',
    link: 'https://secondhandcarapp.web.app/',
  },
  {
    id: 3,
    title: 'D7 Sports',
    category: 'VR & Motion Graphics',
    image: '/assets/img/D7.png',
    link: 'https://drive.google.com/file/d/18_hxmycJTo6qIy9MebsEbzJyGbl6s_Tz/view?usp=sharing',
  },
  {
    id: 4,
    title: 'Interior Design Prototype',
    category: '3D Web & Interactive prototype',
    image: '/assets/img/White and Brown Minimalist Interior Desktop Prototype.gif',
    link: '#',
  },
  {
    id: 5,
    title: 'AR Mart',
    category: 'Immersive Web & AR mockups',
    image: '/assets/img/AR_Mart.png',
    link: '#',
  },
  {
    id: 6,
    title: 'PricePulse',
    category: 'Web application & design',
    image: '/assets/img/Comapre_website.png',
    link: '#',
  },
  {
    id: 7,
    title: 'Namwear T-shirt Design',
    category: 'Merchandising & Branding',
    image: '/assets/img/namwear-design.png',
    link: 'https://www.figma.com/proto/TX6zJj6Lz5934ZjVsanK5M/vs?page-id=0%3A1&node-id=984-372&viewport=-20038%2C-5262%2C0.31&t=zYGrmhAeN2Xhj9fw-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=1004%3A291&show-proto-sidebar=1',
  },
]

export default function Projects() {
  const [active, setActive] = useState(null)

  useEffect(() => {
    const rows = document.querySelectorAll('.project-row')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = Number(entry.target.getAttribute('data-id'))
            const project = projects.find((p) => p.id === id)
            if (project) setActive(project)
          }
        })
      },
      {
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0,
      }
    )

    rows.forEach((row) => observer.observe(row))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="projects" className="projects-section">
      {/* Sticky title bar — full width */}
      <div className="projects-title-bar">
        <div className="projects-title-inner">
          <h2 className="projects__title">
            <span className="projects__title-arrow">↘</span> Projects
          </h2>
        </div>
      </div>

      {/* Content area */}
      <div className="projects-body">
        {/* Sticky centre image column */}
        <div className="projects-image-col" aria-hidden="true">
          <div className="projects-image-frame">
            {projects.map((project) => (
              <img
                key={project.id}
                src={project.image}
                alt={project.title}
                className={`projects-image-frame__img ${active?.id === project.id ? 'is-visible' : ''}`}
              />
            ))}
          </div>
        </div>

        {/* Rows */}
        <Reveal>
          <div className="projects-rows">
            {projects.map((project) => (
              <div
                key={project.id}
                data-id={project.id}
                className={`project-row ${active?.id === project.id ? 'is-active' : ''}`}
              >
                {/* Left: name + category */}
                <div className="project-row__left">
                  <span className="project-row__title">{project.title}</span>
                  <span className="project-row__sep">—</span>
                  <span className="project-row__category">{project.category}</span>
                </div>

                {/* Mobile Image (hidden on desktop) */}
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="project-row__mobile-img" 
                />

                {/* Centre: intentional gap where image floats */}
                <div className="project-row__center" />

                {/* Right: CTA */}
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="project-row__cta"
                  onClick={(e) => e.stopPropagation()}
                >
                  {project.link === '#' ? 'Contact for details' : 'Visit project ↗'}
                </a>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
