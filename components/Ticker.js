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

    // `scrollWidth` is a forced layout read; measuring it inside the scroll
    // rAF (right after writing a transform) made the browser re-layout on
    // every frame. Measure on mount/resize only and cache it.
    let half = el.scrollWidth / 2
    const measure = () => {
      half = el.scrollWidth / 2
    }
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
    ro?.observe(el)

    let ticking = false
    let last = null
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        if (half > 0) {
          // modulo keeps the duplicated line looping seamlessly
          const x = -((window.scrollY * speed) % half)
          // Skip sub-pixel writes — they cost a composite for nothing.
          if (last === null || Math.abs(x - last) >= 0.5) {
            el.style.transform = `translate3d(${x}px, 0, 0)`
            last = x
          }
        }
        ticking = false
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
      ro?.disconnect()
    }
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
