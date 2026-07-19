import { useState, useEffect } from 'react'

const LINKS = [
  { id: 'home', label: 'Home', icon: 'ri-home-line' },
  { id: 'projects', label: 'Projects', icon: 'ri-folder-line' },
  { id: 'services', label: 'Services', icon: 'ri-file-edit-line' },
  { id: 'experience', label: 'Experience', icon: 'ri-honour-line' },
  { id: 'contact', label: 'Contact', icon: 'ri-send-plane-line' },
]

export default function Navigation() {
  const [activeLink, setActiveLink] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]')
      const scrollDown = window.scrollY

      sections.forEach(current => {
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 80
        const sectionId = current.getAttribute('id')

        if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
          setActiveLink(sectionId)
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className="nav">
      <div className="nav__inner">
        <a href="#home" className="nav__logo">
          Vimal Srinivasan
        </a>
        <ul className="nav__list">
          {LINKS.map(link => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                aria-label={link.label}
                className={`nav__link ${activeLink === link.id ? 'active-link' : ''}`}
              >
                <span>{link.label}</span>
                <i className={link.icon}></i>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
