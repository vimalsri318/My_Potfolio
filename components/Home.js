import { useEffect, useRef } from 'react'

// Hero — "AR horizon". Giant gradient name over a receding wireframe
// floor, scroll-scrubbed: the content scales down and fades as you scroll,
// like Apple's product intros.
export default function Home() {
  const contentRef = useRef(null)

  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const progress = Math.min(window.scrollY / (window.innerHeight * 0.72), 1)
        el.style.opacity = String(1 - progress)
        el.style.transform = `scale(${1 - progress * 0.12}) translateY(${progress * -46}px)`
        ticking = false
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="hero" id="home">
      <div className="hero__glow hero__glow--violet" aria-hidden="true"></div>
      <div className="hero__glow hero__glow--blue" aria-hidden="true"></div>
      <div className="hero__floor" aria-hidden="true"></div>

      <div className="hero__content" ref={contentRef}>
        <p className="hero__eyebrow">Web &amp; AR/VR Developer</p>
        <h1 className="display hero__name">
          Vimal
          <br />
          Srinivasan
        </h1>
        <p className="hero__tagline">
          Passionate about immersive, user-friendly digital solutions.
        </p>
        <div className="hero__actions">
          <a href="#projects" className="btn btn--primary">
            See my work
          </a>
          <a
            href="/assets/pdf/Vimalsrinivasan_Resume.pdf"
            download
            target="_blank"
            rel="noreferrer"
            className="btn btn--glass"
          >
            Download CV
          </a>
        </div>
      </div>

      <a href="#about" className="hero__scroll" aria-label="Scroll down">
        <i className="ri-arrow-down-line"></i>
      </a>
    </section>
  )
}
