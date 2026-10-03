import { useEffect, useState } from 'react'
import Reveal from './Reveal'
import { supabasePublic } from '../lib/supabasePublic'
import services, { steps } from '../data/services'
import { INTEREST_EVENT } from '../lib/interest'

const OPTIONS = [...services.map((s) => s.title), 'Something else']
const WHATSAPP = 'https://wa.me/918270942966?text=Hi%20Vimal%2C%20I%27d%20like%20to%20talk%20about%20a%20project'

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [message, setMessage] = useState('')
  const [messageColor, setMessageColor] = useState('')
  // What the visitor wants built. Pre-selected by "Request this" / "Build me
  // one like this" buttons (event) or a ?interest= link from another page.
  const [interest, setInterest] = useState('')
  const [extra, setExtra] = useState('') // a "Something like <Project>" option

  useEffect(() => {
    const pick = (value) => {
      if (!value) return
      if (!OPTIONS.includes(value)) setExtra(value)
      setInterest(value)
      setIsSuccess(false)
    }
    pick(new URLSearchParams(window.location.search).get('interest'))
    const onInterest = (e) => pick(e.detail)
    window.addEventListener(INTEREST_EVENT, onInterest)
    return () => window.removeEventListener(INTEREST_EVENT, onInterest)
  }, [])

  const options = extra ? [extra, ...OPTIONS] : OPTIONS

  const sendEmail = async e => {
    e.preventDefault()
    setIsSubmitting(true)

    // Grab the values before the form resets — used for the Supabase copy.
    const form = e.target
    const body = form.user_message?.value?.trim() || ''
    const payload = {
      name: form.user_name?.value?.trim() || null,
      email: form.user_email?.value?.trim() || null,
      message: interest && body ? `Interested in: ${interest}\n\n${body}` : body,
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
      await emailjs.send(
        'service_xrxe1zu',
        'template_6fmag4b',
        { user_name: payload.name, user_email: payload.email, user_message: payload.message },
        'pkXRGXYYMgUNYmOjk'
      )
      emailed = true
    } catch (error) {
      console.error('EmailJS error:', error)
    }

    if (stored || emailed) {
      setIsSuccess(true)
      setIsSubmitting(false)
      setInterest('')
      form.reset()
    } else {
      setMessage('Message failed to send. Please try again.')
      setMessageColor('#c1121f')
      setIsSubmitting(false)
    }
  }

  return (
    <section className="section" id="contact">
      <div className="container contact">
        <Reveal className="contact__aside">
          <p className="contact__eyebrow">How it works</p>
          <ol className="contact__steps">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <a
            href="/assets/pdf/Vimalsrinivasan_Resume.pdf"
            download
            target="_blank"
            rel="noreferrer"
            className="contact__cv"
          >
            Download my CV <span aria-hidden="true">↗</span>
          </a>
        </Reveal>

        <Reveal delay={100}>
          <div className="contact-card">
            {isSuccess ? (
              <div className="contact-card__success">
                <svg className="contact-card__success-icon" viewBox="0 0 52 52">
                  <circle className="contact-card__success-circle" cx="26" cy="26" r="25" fill="none"/>
                  <path className="contact-card__success-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
                <h3 className="contact-card__success-title">Thank you!</h3>
                <p className="contact-card__success-sub">
                  Your message has been received. I&apos;ll be in touch soon.
                </p>
                <button className="contact-card__success-reset" onClick={() => setIsSuccess(false)}>
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2 className="contact-card__title">Start a project.</h2>
                <p className="contact-card__sub">
                  Tell me what you want to build ⎯ I&apos;ll get back to you with a plan.
                </p>
                <form className="contact__form" id="contact-form" onSubmit={sendEmail}>
                  <fieldset className="contact__interest">
                    <legend className="contact__legend">What do you need?</legend>
                    <div className="contact__chips">
                      {options.map((o) => (
                        <button
                          key={o}
                          type="button"
                          className="contact__chip"
                          aria-pressed={interest === o}
                          onClick={() => setInterest(interest === o ? '' : o)}
                        >
                          {o}
                        </button>
                      ))}
                    </div>
                  </fieldset>
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
                    placeholder="What are you building, and by when?"
                    className="contact__input contact__area"
                    required
                  ></textarea>
                  <div className="contact__actions">
                    <button type="submit" className="contact__submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Sending…' : 'Send project brief ↗'}
                    </button>
                    <a href={WHATSAPP} target="_blank" rel="noreferrer" className="contact__alt">
                      or message me on WhatsApp
                    </a>
                  </div>
                  <p
                    className="contact__message"
                    style={message ? { color: messageColor } : undefined}
                    role="status"
                  >
                    {message}
                  </p>
                </form>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
