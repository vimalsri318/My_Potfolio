import Head from 'next/head'
import { useEffect } from 'react'
import Navigation from '../components/Navigation'
import Home from '../components/Home'
import Projects from '../components/Projects'
import Services from '../components/Services'
import Experience from '../components/Experience'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import ScrollUp from '../components/ScrollUp'

export default function Portfolio() {
  useEffect(() => {
    // Initialize ScrollReveal
    if (typeof window !== 'undefined') {
      const ScrollReveal = require('scrollreveal').default
      const sr = ScrollReveal({
        origin: 'top',
        distance: '60px',
        duration: 2500,
        delay: 400,
        reset: true
      })

      sr.reveal('.perfil, .contact__form')
      sr.reveal('.info', { origin: 'left', delay: 800 })
      sr.reveal('.skills', { origin: 'left', delay: 900 })
      sr.reveal('.about', { origin: 'right', delay: 1200 })
      sr.reveal('.projects__card, .services__card, .experience__card', { interval: 100 })
    }
  }, [])

  return (
    <>
      <Head>
        <title>Vimal Portfolio</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="shortcut icon" href="/assets/img/favicon.png" type="image/x-icon" />
      </Head>

      <Navigation />
      <main className="main">
        <Home />
        <Projects />
        <Services />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <ScrollUp />
    </>
  )
}