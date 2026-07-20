import { useEffect, useRef, useState } from 'react'

const LINKS = [
  { label: 'Courses', href: '/courses', internal: true },
  { label: 'GitHub', href: 'https://github.com/vimalsri318' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/vimalsrinivasan-r/' },
  { label: 'Instagram', href: 'https://www.instagram.com/vimal_sri_718/' },
  { label: 'Behance', href: 'https://www.behance.net/vimalsrinivasan' },
  { label: 'WhatsApp', href: 'https://wa.me/918270942966?text=Hai' },
  { label: 'My resume', href: '/assets/pdf/Vimalsrinivasan_Resume.pdf' },
]

// Fixed chrome: top pill bar with an expanding LINK TREE tray + © badge
export default function Navigation() {
  const [open, setOpen] = useState(false)
  const trayRef = useRef(null)

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
        <p className="topbar__tagline">
          AI developer &amp; architect, building production-ready intelligent systems.
        </p>
        <nav className="topbar__links">
          <a href="/#projects" className="topbar__link">
            Projects
          </a>
          <a href="/#contact" className="topbar__link">
            Contact
          </a>
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
        </nav>
      </header>

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

      <span className="badge-copy">©2025</span>
    </>
  )
}
