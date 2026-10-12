'use client'
import { useEffect, useRef, useState } from 'react'
import { FloatingStack } from './ui/stack'

const NAME = 'VIMAL SRINIVASAN'

export default function Home({ showActions = false }) {
  const [hovered, setHovered] = useState(false)
  const heroRef = useRef(null)

  // The hero is pinned and the page slides over it. Once it is fully covered
  // nobody can see its marquee or badges, so freeze them instead of letting
  // the browser keep painting (and re-blurring the nav over) a hidden layer.
  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    let covered = false
    let ticking = false
    const update = () => {
      ticking = false
      const next = window.scrollY > el.offsetHeight
      if (next !== covered) {
        covered = next
        el.classList.toggle('is-covered', covered)
      }
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section className="hero" id="home" ref={heroRef}>

      {/* The empty top band: logos of what I build with, drifting */}
      <FloatingStack />

      {/* Layer 1: filled text — always behind portrait, NEVER changes */}
      <div className="hero__marquee hero__marquee--filled" aria-hidden="true">
        <div className="hero__marquee-track">
          <span>{NAME}</span>
          <span>{NAME}</span>
        </div>
      </div>

      {/* Portrait — hover triggers outlined layer */}
      <img
        src="/assets/img/home-perfil-web-1800.webp"
        srcSet="/assets/img/home-perfil-web-1200.webp 1200w, /assets/img/home-perfil-web-1800.webp 1800w"
        sizes="(max-width: 720px) 112vh, 108vh"
        width="1800"
        height="1450"
        alt="Vimal Srinivasan"
        className="hero__portrait"
        decoding="async"
        fetchpriority="high"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />

      {/* Layer 2: outlined text — hidden by default, shown above portrait on hover */}
      <div
        className={`hero__marquee hero__marquee--outlined ${hovered ? 'is-visible' : ''}`}
        aria-hidden="true"
      >
        <div className="hero__marquee-track">
          <span>{NAME}</span>
          <span>{NAME}</span>
        </div>
      </div>

      <div className="hero__foot">
        <p className="hero__caption">
          AI developer &amp; architect based in Coimbatore, India.
        </p>
        {showActions && (
          <div className="hero__actions">
            <a href="#contact" className="hero__action hero__action--primary">
              Start a project <span aria-hidden="true">↗</span>
            </a>
            <a href="#projects" className="hero__action">
              See my work
            </a>
          </div>
        )}
      </div>
      <span className="hero__badge">AI / ML</span>
    </section>
  )
}
