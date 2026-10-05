import { useEffect, useRef } from 'react'

// Scroll-triggered reveal via IntersectionObserver.
// Elements already in the viewport reveal immediately on mount,
// so the page is never blank on first paint.
export default function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // One-shot: reveal once and stop observing. Re-hiding on scroll-out made
    // sections flash and re-run their transition every time they passed the
    // viewport edge — the "animation glitch" you could feel while scrolling.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.classList.add('is-visible')
        // Drop the compositing hint once the transition has run.
        const done = () => el.classList.add('is-settled')
        el.addEventListener('transitionend', done, { once: true })
        setTimeout(done, 1000)
        observer.disconnect()
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
