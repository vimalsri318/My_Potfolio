export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container container grid">
        <div className="footer__content grid">
          <a href="#" className="footer__logo">VimalSrinivasan</a>
          <ul className="footer__links">
            <li>
              <a href="#home" className="footer__link" style={{color: '#555555'}}>Home</a>
            </li>
            <li>
              <a href="#projects" className="footer__link" style={{color: '#555555'}}>Projects</a>
            </li>
            <li>
              <a href="#services" className="footer__link" style={{color: '#555555'}}>Services</a>
            </li>
          </ul>
        </div>
        <div className="footer__social">
          <a href="https://wa.me/918270942966?text=Hai" target="_blank" className="footer__social-link">
            <i className="ri-whatsapp-line"></i>
          </a>
          <a href="https://www.instagram.com/vimal_sri_718/" target="_blank" className="footer__social-link">
            <i className="ri-instagram-line"></i>
          </a>
          <a href="https://www.linkedin.com/in/vimalsrinivasan-r/" target="_blank" className="footer__social-link">
            <i className="ri-linkedin-box-line"></i>
          </a>
        </div>
      </div>
      <span className="footer__copy">© 2025 All Rights Reserved By VimalSrinivasan R</span>
    </footer>
  )
}