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
      setMessageColor('#30d158')
      e.target.reset()

      setTimeout(() => {
        setMessage('')
      }, 5000)
    } catch (error) {
      setMessage('Message failed to send. Please try again.')
      setMessageColor('#ff453a')
      console.error('EmailJS error:', error)
    }
  }

  return (
    <section className="section section--dark" id="contact">
      <div className="container">
        <div className="contact__wrap">
          <Reveal>
            <span className="eyebrow">Contact</span>
            <h2 className="headline">Let&apos;s build something.</h2>
            <p className="subhead" style={{ marginTop: 14 }}>
              Have a project in mind? Send a message and I&apos;ll get back to you.
            </p>
          </Reveal>

          <Reveal delay={120}>
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
              <div>
                <button type="submit" className="btn btn--primary">
                  Send message
                </button>
              </div>
              {/* style only applied when a message exists — avoids SSR/client mismatch */}
              <p
                className="contact__message"
                style={message ? { color: messageColor } : undefined}
                role="status"
              >
                {message}
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
