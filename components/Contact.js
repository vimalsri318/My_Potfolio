import { useState } from 'react'
import Reveal from './Reveal'
import { supabasePublic } from '../lib/supabasePublic'

export default function Contact() {
  const [message, setMessage] = useState('')
  const [messageColor, setMessageColor] = useState('')

  const sendEmail = async e => {
    e.preventDefault()

    // Grab the values before the form resets — used for the Supabase copy.
    const form = e.target
    const payload = {
      name: form.user_name?.value?.trim() || null,
      email: form.user_email?.value?.trim() || null,
      message: form.user_message?.value?.trim() || '',
      path: typeof window !== 'undefined' ? window.location.pathname : null,
    }

    // 1. Durable capture first: store in Supabase so the message reaches the
    //    admin Messages tab even if email delivery fails. This is the source
    //    of truth for whether the message "got through".
    let stored = false
    if (payload.message) {
      try {
        const { error } = await supabasePublic.from('contact_messages').insert(payload)
        if (error) console.error('contact store error:', error.message)
        else stored = true
      } catch (err) {
        console.error('contact store error:', err)
      }
    }

    // 2. Best-effort email notification via EmailJS (runs before reset so the
    //    form fields are still populated). A failure here is logged, not fatal.
    let emailed = false
    try {
      const emailjs = (await import('@emailjs/browser')).default
      await emailjs.sendForm('service_xrxe1zu', 'template_6fmag4b', '#contact-form', 'pkXRGXYYMgUNYmOjk')
      emailed = true
    } catch (error) {
      console.error('EmailJS error:', error)
    }

    if (stored || emailed) {
      setMessage('Message sent ✅')
      setMessageColor('#1a7f37')
      form.reset()
      setTimeout(() => setMessage(''), 5000)
    } else {
      setMessage('Message failed to send. Please try again.')
      setMessageColor('#c1121f')
    }
  }

  return (
    <section className="section" id="contact">
      <div className="container">
        {/* big Garnier-style CTAs */}
        <Reveal>
          <div className="cta" style={{ marginBottom: 'clamp(48px, 8vw, 90px)' }}>
            <a href="#contact-form" className="cta__button">
              <span>I want an AI solution</span>
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
              Have an AI product, chatbot or website in mind? Send a message ⎯ I&apos;ll get back to you.
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
