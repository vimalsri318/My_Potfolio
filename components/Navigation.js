import { useEffect, useRef, useState } from 'react'
import { siteConfig } from '../data/site'
import { supabasePublic } from '../lib/supabasePublic'

const LINKS = [
  { label: 'Research', href: '/research', internal: true },
  { label: 'Courses', href: '/courses', internal: true },
  { label: 'GitHub', href: 'https://github.com/vimalsri318' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/vimalsrinivasan-r/' },
  { label: 'Instagram', href: 'https://www.instagram.com/vimal_sri_718/' },
  { label: 'Behance', href: 'https://www.behance.net/vimalsrinivasan' },
  { label: 'WhatsApp', href: 'https://wa.me/918270942966?text=Hai' },
  { label: 'My resume', href: '/assets/pdf/Vimalsrinivasan_Resume.pdf' },
]

// Fixed chrome: top pill bar with an expanding LINK TREE tray + © badge.
// `sections` (from the home page's getStaticProps) drives which links show;
// other pages fetch the flags client-side so the nav stays consistent.
export default function Navigation({ sections: sectionsProp = null }) {
  const [open, setOpen] = useState(false)
  const [sections, setSections] = useState(sectionsProp)
  const trayRef = useRef(null)
  const year = new Date().getFullYear()

  useEffect(() => {
    if (sectionsProp) return
    let active = true
    ;(async () => {
      try {
        const { data } = await supabasePublic.from('site_sections').select('key, enabled')
        if (!active || !data) return
        const map = {}
        data.forEach((s) => { map[s.key] = s.enabled })
        setSections(map)
      } catch {
        /* keep file defaults */
      }
    })()
    return () => { active = false }
  }, [sectionsProp])

  // Before flags load, fall back to the file default (coming-soon) so we
  // never briefly flash links that should be hidden.
  const comingSoon = sections ? sections.coming_soon !== false : siteConfig.comingSoon
  const showProjects = !comingSoon && sections?.projects !== false
  const showContact = !comingSoon && sections?.contact !== false

  useEffect(() => {
    if (!open) return
    const onKey = e => e.key === 'Escape' && setOpen(false)
    const onClick = e => {
      if (trayRef.current && !trayRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onClick)
    }
  }, [open])

  return (
    <>
      <header className="topbar">
        <div className="topbar__brand">
          <a href="/" className="topbar__logo" aria-label="Home — Vimal Srinivasan">
            VS<span className="topbar__logo-dot">.</span>
          </a>
          <p className="topbar__tagline">
            AI developer &amp; architect, building production-ready intelligent systems.
          </p>
        </div>
        <nav className="topbar__links">
          {showProjects && (
            <a href="/#projects" className="topbar__link">
              Projects
            </a>
          )}
          <a href="/research" className="topbar__link">
            Research
          </a>
          {showContact && (
            <a href="/#contact" className="topbar__link">
              Contact
            </a>
          )}
          {!comingSoon && (
            <button
              type="button"
              className="topbar__link"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              aria-expanded={open}
              onClick={e => {
                e.stopPropagation()
                setOpen(v => !v)
              }}
            >
              🔗 Link tree
            </button>
          )}
        </nav>
      </header>

      {!comingSoon && (
        <div ref={trayRef} className={`linktray ${open ? 'is-open' : ''}`}>
          {LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              target={link.internal ? undefined : '_blank'}
              rel={link.internal ? undefined : 'noreferrer'}
              className="linktray__item"
              onClick={() => setOpen(false)}
            >
              <span>{link.label}</span>
              <span>↗</span>
            </a>
          ))}
        </div>
      )}

      <span className="badge-copy">©{year}</span>
    </>
  )
}
