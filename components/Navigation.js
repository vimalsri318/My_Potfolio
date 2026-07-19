import { useState, useEffect } from 'react'

export default function Navigation() {
  const [activeLink, setActiveLink] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]')
      const scrollDown = window.scrollY

      sections.forEach(current => {
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 58
        const sectionId = current.getAttribute('id')

        if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
          setActiveLink(sectionId)
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className="nav">
      <ul className="nav__list">
        <li>
          <a href="#home" className={`nav__link ${activeLink === 'home' ? 'active-link' : ''}`}>
            <i className="ri-home-line"></i>
          </a>
        </li>
        <li>
          <a href="#projects" className={`nav__link ${activeLink === 'projects' ? 'active-link' : ''}`}>
            <i className="ri-folder-line"></i>
          </a>
        </li>
        <li>
          <a href="#services" className={`nav__link ${activeLink === 'services' ? 'active-link' : ''}`}>
            <i className="ri-file-edit-line"></i>
          </a>
        </li>
        <li>
          <a href="#experience" className={`nav__link ${activeLink === 'experience' ? 'active-link' : ''}`}>
            <i className="ri-honour-line"></i>
          </a>
        </li>
        <li>
          <a href="#contact" className={`nav__link ${activeLink === 'contact' ? 'active-link' : ''}`}>
            <i className="ri-send-plane-line"></i>
          </a>
        </li>
      </ul>
    </nav>
  )
}