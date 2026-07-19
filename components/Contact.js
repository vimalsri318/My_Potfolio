import { useState } from 'react'

export default function Contact() {
  const [message, setMessage] = useState('')
  const [messageColor, setMessageColor] = useState('')

  const sendEmail = async (e) => {
    e.preventDefault()

    try {
      const emailjs = (await import('@emailjs/browser')).default
      await emailjs.sendForm('service_xrxe1zu', 'template_6fmag4b', '#contact-form', 'pkXRGXYYMgUNYmOjk')

      setMessage('Message sent successfully ✅')
      setMessageColor('green')
      e.target.reset()

      setTimeout(() => {
        setMessage('')
      }, 5000)
    } catch (error) {
      setMessage('Failed to send message. Please try again.')
      setMessageColor('red')
      console.error('EmailJS error:', error)
    }
  }

  return (
    <section className="contact section" id="contact">
      <h2 className="section__title">CONTACT ME</h2>
      <div className="contact__container container grid">
        <form className="contact__form grid" id="contact-form" onSubmit={sendEmail}>
          <div className="contact__group grid">
            <input type="text" name="user_name" placeholder="Name" required className="contact__input" />
            <input type="email" name="user_email" placeholder="Email" required className="contact__input" />
          </div>
          <textarea name="user_message" placeholder="Message" className="contact__input contact__area" required></textarea>
          <button type="submit" className="button contact__button">Send Message</button>
          <p className="contact__message" style={{color: messageColor}}>{message}</p>
        </form>
      </div>
    </section>
  )
}