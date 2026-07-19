export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__inner">
          <a href="#home" className="footer__logo">
            Vimal Srinivasan
          </a>
          <ul className="footer__links">
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#projects">Projects</a>
            </li>
            <li>
              <a href="#services">Services</a>
            </li>
          </ul>
          <div className="footer__social">
            <a
              href="https://wa.me/918270942966?text=Hai"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
            >
              <i className="ri-whatsapp-line"></i>
            </a>
            <a
              href="https://www.instagram.com/vimal_sri_718/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <i className="ri-instagram-line"></i>
            </a>
            <a
              href="https://www.linkedin.com/in/vimalsrinivasan-r/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <i className="ri-linkedin-box-line"></i>
            </a>
          </div>
        </div>
        <span className="footer__copy">
          © 2025 All Rights Reserved By VimalSrinivasan R
        </span>
      </div>
    </footer>
  )
}
