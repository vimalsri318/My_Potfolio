import Head from 'next/head'
import Navigation from '../components/Navigation'
import Home from '../components/Home'
import Ticker from '../components/Ticker'
import About from '../components/About'
import Projects from '../components/Projects'
import Services from '../components/Services'
import Experience from '../components/Experience'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

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
        {/* rides over the pinned hero */}
        <div className="page-body">
          <Ticker
            speed={0.6}
            items={[
              'SUPER CREATIVE 🔥',
              'WEB ⎯ AR/VR ⎯ DESIGN',
              'SUPER CREATIVE 🔥',
              'WEB ⎯ AR/VR ⎯ DESIGN',
            ]}
          />
          <About />
          <Projects />
          <Ticker
            speed={0.4}
            items={[
              'HTML ⎯ CSS ⎯ JAVASCRIPT ⎯ REACT ⎯ TAILWIND ⎯ SASS ⎯ FIGMA ⎯ UNITY ⎯ GIT ⎯ PYTHON ⎯ MONGODB ⎯ FIREBASE ⎯',
            ]}
          />
          <Services />
          <Experience />
          <Contact />
          <Footer />
        </div>
      </main>
    </>
  )
}
