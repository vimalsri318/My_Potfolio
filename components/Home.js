'use client'
import { useState } from 'react'

const NAME = 'VIMAL SRINIVASAN'

export default function Home() {
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

      <p className="hero__caption">
        Web &amp; AR/VR developer based in Coimbatore, India.
      </p>
      <span className="hero__badge">AR / VR</span>
    </section>
  )
}
