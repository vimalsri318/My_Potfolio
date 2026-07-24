import { useRef, useEffect } from 'react'
import Link from 'next/link'

// Horizontal strip of cards. Each card is collapsed to a narrow slice of its
// image; hovering (or keyboard-focusing) a card expands THAT card in place to
// the full image, sliding the rest of the row along. No modal, no new card —
// the same card just grows. Clicking a card opens its detail page.
//
// The expanded width is the image's full width at the card's height, so the
// whole image shows edge-to-edge with no letterboxing. Because that depends on
// each image's aspect ratio, it's measured once the image loads and re-applied
// on resize, written to the card as a CSS variable the hover rule reads.
const MAX_EXPAND_VW = 0.82

export default function Projects({ projects = [] }) {
  const trackRef = useRef(null)
  const ratios = useRef({})

  const applyWidths = () => {
    const track = trackRef.current
    if (!track) return
    const maxExpand = window.innerWidth * MAX_EXPAND_VW
    track.querySelectorAll('.proj-card').forEach((card) => {
      const ratio = ratios.current[card.dataset.id]
      if (!ratio) return
      const full = Math.round(card.clientHeight * ratio)
      card.style.setProperty('--w-exp', `${Math.min(maxExpand, full)}px`)
    })
  }

  const handleLoad = (id) => (e) => {
    const { naturalWidth, naturalHeight } = e.target
    if (naturalWidth && naturalHeight) {
      ratios.current[id] = naturalWidth / naturalHeight
      applyWidths()
    }
  }

  // Cached images can finish before hydration, so onLoad never fires for them —
  // seed their ratios here. Then keep the expanded widths correct on resize.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    track.querySelectorAll('.proj-card__img').forEach((img) => {
      if (img.complete && img.naturalWidth) {
        ratios.current[img.dataset.id] = img.naturalWidth / img.naturalHeight
      }
    })
    applyWidths()

    const onResize = () => applyWidths()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <section id="projects" className="proj">
      <div className="proj__head">
        <h2 className="proj__title">Get to know my work.</h2>
        <p className="proj__hint">Hover a project to see the full picture.</p>
      </div>

      <ul className="proj-track" ref={trackRef}>
        {projects.map((project) => (
          <li key={project.id} className="proj-card" data-id={project.id}>
            <Link href={`/projects/${project.slug}`} className="proj-card__btn">
              <img
                className="proj-card__img"
                data-id={project.id}
                src={project.image}
                alt={project.title}
                loading="lazy"
                onLoad={handleLoad(project.id)}
              />
              <span className="proj-card__scrim" aria-hidden="true" />
              <span className="proj-card__top">
                <span className="proj-card__eyebrow">{project.category}</span>
                <span className="proj-card__title">{project.title}</span>
              </span>
              <span className="proj-card__cta">
                View project <span aria-hidden="true">→</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
