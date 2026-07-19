import { useEffect, useRef } from 'react'

// Black band whose text position is driven by scroll:
// scroll down → text slides left, scroll up → it slides back right.
export default function Ticker({ items, speed = 0.5 }) {
  const trackRef = useRef(null)
  const line = items.join('  ')

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const half = el.scrollWidth / 2
        if (half > 0) {
          // modulo keeps the duplicated line looping seamlessly
          const x = -((window.scrollY * speed) % half)
          el.style.transform = `translateX(${x}px)`
        }
        ticking = false
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [speed])

  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track" ref={trackRef}>
        <span>{line}</span>
        <span>{line}</span>
      </div>
    </div>
  )
}
