import { useEffect, useRef, useState } from 'react'
import { SHOWREEL } from '../data/catalogue'

// Muted showreel that plays only while on screen. Visitors who prefer
// reduced motion get the poster and a play button instead of autoplay.
export default function Showreel() {
  const ref = useRef(null)
  const [paused, setPaused] = useState(true)
  const [userPaused, setUserPaused] = useState(false)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setUserPaused(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !userPaused) v.play().catch(() => {})
        else v.pause()
      },
      { threshold: 0.35 }
    )
    io.observe(v)
    return () => io.disconnect()
  }, [userPaused])

  const toggle = () => {
    const v = ref.current
    if (!v) return
    if (v.paused) {
      setUserPaused(false)
      v.play().catch(() => {})
    } else {
      setUserPaused(true)
      v.pause()
    }
  }

  return (
    <figure className="reel">
      <video
        ref={ref}
        className="reel__video"
        src={SHOWREEL.src}
        poster={SHOWREEL.poster}
        muted
        loop
        playsInline
        preload="metadata"
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        aria-label="Showreel of projects by Vimal Srinivasan"
      />
      <button type="button" className="reel__toggle" onClick={toggle} aria-label={paused ? 'Play showreel' : 'Pause showreel'}>
        <span aria-hidden="true">{paused ? '▶' : '❚❚'}</span>
        {paused ? 'Play reel' : 'Pause'}
      </button>
    </figure>
  )
}
