import Link from 'next/link'

// Shown below the hero while the full site is still being built.
// Rides over the pinned hero (inside .page-body), just like the real
// content does — so scrolling reveals it the same way.
export default function ComingSoon() {
  return (
    <section className="coming-soon">
      <div className="container coming-soon__inner">
        <span className="coming-soon__kicker mono">🍳 Cooking right now</span>

        <h2 className="display coming-soon__title">
          The full site is<br />on its way.
        </h2>

        <p className="coming-soon__text">
          I&apos;m building out the rest — projects, services and the full story are
          coming soon. In the meantime, my research is already live.
        </p>

        <Link href="/research" className="coming-soon__cta">
          Read my research <span className="coming-soon__arrow">→</span>
        </Link>

        <p className="coming-soon__soon mono">Live soon.</p>
      </div>
    </section>
  )
}
