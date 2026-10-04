'use client'
import { useState } from 'react'

const NAME = 'VIMAL SRINIVASAN'

export default function Home({ showActions = false }) {
  const [hovered, setHovered] = useState(false)

  return (
    <section className="hero" id="home">

      {/* Layer 1: filled text — always behind portrait, NEVER changes */}
      <div className="hero__marquee hero__marquee--filled" aria-hidden="true">
        <div className="hero__marquee-track">
          <span>{NAME}</span>
          <span>{NAME}</span>
        </div>
      </div>

      {/* Portrait — hover triggers outlined layer */}
      <img
        src="/assets/img/home-perfil-web.png"
        alt="Vimal Srinivasan"
        className="hero__portrait"
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
