import { useState } from 'react'
import Reveal from './Reveal'

export default function Contact() {
  const [message, setMessage] = useState('')
  const [messageColor, setMessageColor] = useState('')

  const sendEmail = async e => {
    e.preventDefault()

    try {
      const emailjs = (await import('@emailjs/browser')).default
      await emailjs.sendForm(
        'service_xrxe1zu',
        'template_6fmag4b',
        '#contact-form',
        'pkXRGXYYMgUNYmOjk'
      )

      setMessage('Message sent ✅')
      setMessageColor('#1a7f37')
      e.target.reset()

      setTimeout(() => {
        setMessage('')
      }, 5000)
    } catch (error) {
      setMessage('Message failed to send. Please try again.')
      setMessageColor('#c1121f')
      console.error('EmailJS error:', error)
    }
  }

  return (
    <section className="section" id="contact">
      <div className="container">
        {/* big Garnier-style CTAs */}
        <Reveal>
          <div className="cta" style={{ marginBottom: 'clamp(48px, 8vw, 90px)' }}>
            <a href="#contact-form" className="cta__button">
              <span>I want a website</span>
              <span className="arrow">↗</span>
            </a>
            <a
              href="/assets/pdf/Vimalsrinivasan_Resume.pdf"
              download
              target="_blank"
              rel="noreferrer"
              className="cta__button"
            >
              <span>Download my CV</span>
              <span className="arrow">↗</span>
            </a>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="contact-card">
            <h2 className="contact-card__title">Let&apos;s talk.</h2>
            <p className="contact-card__sub">
              Have a project in mind? Send a message ⎯ I&apos;ll get back to you.
            </p>
            <form className="contact__form" id="contact-form" onSubmit={sendEmail}>
              <div className="contact__group">
                <input
                  type="text"
                  name="user_name"
                  placeholder="Name"
                  required
                  className="contact__input"
                />
                <input
                  type="email"
                  name="user_email"
                  placeholder="Email"
                  required
                  className="contact__input"
                />
              </div>
              <textarea
                name="user_message"
                placeholder="Message"
                className="contact__input contact__area"
                required
              ></textarea>
              <button type="submit" className="contact__submit">
                Send message ↗
              </button>
              <p
                className="contact__message"
                style={message ? { color: messageColor } : undefined}
                role="status"
              >
                {message}
              </p>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
