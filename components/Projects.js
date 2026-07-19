import { useRef, useState } from 'react'
import Reveal from './Reveal'

const projects = [
  {
    id: 1,
    title: 'D-MART Analysis',
    image: '/assets/img/ANALYSIS.png',
    link: 'https://ltqapcfmatgt2.mocha.app/',
  },
  {
    id: 2,
    title: 'Carspace',
    image: '/assets/img/Carspace.png',
    link: 'https://secondhandcarapp.web.app/',
  },
  {
    id: 3,
    title: 'D7 Sports',
    image: '/assets/img/D7.png',
    link: 'https://drive.google.com/file/d/18_hxmycJTo6qIy9MebsEbzJyGbl6s_Tz/view?usp=sharing',
  },
  {
    id: 4,
    title: 'Interior Design Prototype',
    image: '/assets/img/White and Brown Minimalist Interior Desktop Prototype.gif',
    link: '#',
  },
  {
    id: 5,
    title: 'AR Mart',
    image: '/assets/img/AR_Mart.png',
    link: '#',
  },
  {
    id: 6,
    title: 'PricePulse',
    image: '/assets/img/Comapre_website.png',
    link: '#',
  },
  {
    id: 7,
    title: 'Namwear T-shirt Design',
    image: '/assets/img/namwear-design.png',
    link: 'https://www.figma.com/proto/TX6zJj6Lz5934ZjVsanK5M/vs?page-id=0%3A1&node-id=984-372&viewport=-20038%2C-5262%2C0.31&t=zYGrmhAeN2Xhj9fw-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=1004%3A291&show-proto-sidebar=1',
  },
]

export default function Projects() {
  const previewRef = useRef(null)
  const [active, setActive] = useState(null)

  // floating preview follows the cursor
  const onMove = e => {
    const el = previewRef.current
    if (!el) return
    el.style.left = `${e.clientX + 24}px`
    el.style.top = `${e.clientY - 90}px`
  }

  return (
    <section className="section" id="projects">
      <div className="container">
        <div className="projects__layout">
          {/* pinned label — the rows scroll past it */}
          <div className="projects__aside">
            <div className="side-label" aria-hidden="true">
              <span className="side-label__arrow">⤵</span>
              {'Projects'.split('').map((ch, i) => (
                <span key={i}>{ch}</span>
              ))}
            </div>
            <p className="mono" style={{ color: 'var(--ink-soft)' }}>
              Hover to peek
            </p>
          </div>

          <Reveal>
            <div className="projects__list" onMouseMove={onMove}>
              {projects.map(project => (
                <a
                  key={project.id}
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="project-row"
                  onMouseEnter={() => setActive(project)}
                  onMouseLeave={() => setActive(null)}
                >
                  <h3 className="project-row__name">{project.title}</h3>
                  <span className="project-row__cta">Visit project ↗</span>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* cursor-following preview */}
      <div
        ref={previewRef}
        className={`project-preview ${active ? 'is-active' : ''}`}
        aria-hidden="true"
      >
        {active && <img src={active.image} alt="" />}
      </div>
    </section>
  )
}
