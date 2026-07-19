import Head from 'next/head'
import Navigation from '../components/Navigation'
import Home from '../components/Home'
import About from '../components/About'
import Projects from '../components/Projects'
import Skills from '../components/Skills'
import Services from '../components/Services'
import Experience from '../components/Experience'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import ScrollUp from '../components/ScrollUp'

export default function Portfolio() {
  return (
    <>
      <Head>
        <title>Vimal Srinivasan — Web & AR/VR Developer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Vimal Srinivasan — Web & AR/VR developer based in Coimbatore. Immersive, user-friendly digital experiences."
        />
        <link rel="shortcut icon" href="/assets/img/favicon.png" type="image/x-icon" />
      </Head>

      <Navigation />
      <main className="main">
        <Home />
        <About />
        <Projects />
        <Skills />
        <Services />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <ScrollUp />
    </>
  )
}
