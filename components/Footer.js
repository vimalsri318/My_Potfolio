import { useEffect, useState } from 'react'

export default function Footer() {
  // local time in Coimbatore (IST) — client-only to avoid hydration mismatch
  const [time, setTime] = useState('--:--')

  useEffect(() => {
    const update = () => {
      setTime(
        new Intl.DateTimeFormat('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Kolkata',
        }).format(new Date())
      )
    }
    update()
    const id = setInterval(update, 30000)
    return () => clearInterval(id)
  }, [])

  return (
    <footer className="footer">
      <div className="container">
        <p className="footer__love">
          Made with love and ☕ in Coimbatore, India.
        </p>
        <p className="footer__time">Local time ⎯ {time}</p>

        <div className="footer__links">
          <a
            href="https://github.com/vimalsri318"
            target="_blank"
            rel="noreferrer"
            className="footer__link"
          >
            <span>GitHub</span>
            <span>↗</span>
          </a>
          <a
            href="https://www.linkedin.com/in/vimalsrinivasan-r/"
            target="_blank"
            rel="noreferrer"
            className="footer__link"
          >
            <span>LinkedIn</span>
            <span>↗</span>
          </a>
          <a
            href="https://www.instagram.com/vimal_sri_718/"
            target="_blank"
            rel="noreferrer"
            className="footer__link"
          >
            <span>Instagram</span>
            <span>↗</span>
          </a>
          <a
            href="https://www.behance.net/vimalsrinivasan"
            target="_blank"
            rel="noreferrer"
            className="footer__link"
          >
            <span>Behance</span>
            <span>↗</span>
          </a>
          <a
            href="https://wa.me/918270942966?text=Hai"
            target="_blank"
            rel="noreferrer"
            className="footer__link"
          >
            <span>WhatsApp</span>
            <span>↗</span>
          </a>
        </div>

        <p className="footer__copy">© 2025 Vimal Srinivasan. All rights reserved.</p>
      </div>
    </footer>
  )
}
