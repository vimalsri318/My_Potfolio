// Fixed chrome: top pill bar + bottom-right copyright badge (Garnier style)
export default function Navigation() {
  return (
    <>
      <header className="topbar">
        <p className="topbar__tagline">
          Web &amp; AR/VR developer, building immersive digital experiences.
        </p>
        <nav className="topbar__links">
          <a href="#projects" className="topbar__link">
            Projects
          </a>
          <a href="#contact" className="topbar__link">
            Contact
          </a>
          <a
            href="https://github.com/vimalsri318"
            target="_blank"
            rel="noreferrer"
            className="topbar__link"
          >
            GitHub ↗
          </a>
        </nav>
      </header>
      <span className="badge-copy">©2025</span>
    </>
  )
}
