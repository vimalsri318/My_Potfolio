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
import ComingSoon from '../components/ComingSoon'
import { useTrackView } from '../hooks/useTrackView'
import { getProjects } from '../lib/contentStore'
import { getVisibility } from '../lib/visibility'

export async function getStaticProps() {
  const { sections, hiddenProjects } = await getVisibility()
  const projects = getProjects().filter((p) => !hiddenProjects.includes(p.slug))
  return {
    props: {
      projects,
      comingSoon: sections.coming_soon,
      sections,
    },
    revalidate: 15, // ISR: pick up admin visibility toggles within ~15s
  }
}

export default function Portfolio({ projects, comingSoon, sections = {} }) {
  useTrackView('home')
  
  return (
    <>
      <Head>
        <title>Vimal Srinivasan — AI Developer & Architect</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Vimal Srinivasan — AI developer & architect based in Coimbatore. AI/ML products, production RAG chatbots and end-to-end full-stack systems."
        />
        <link rel="shortcut icon" href="/assets/img/favicon.png" type="image/x-icon" />
      </Head>

      <Navigation sections={sections} />
      <main className="main">
        <Home />
        {/* rides over the pinned hero */}
        <div className="page-body">
          {comingSoon ? (
            // Site is still being built — hero + "cooking" panel only.
            // Research stays live and reachable from the panel's CTA.
            <ComingSoon />
          ) : (
            <>
              <Ticker
                speed={0.6}
                items={[
                  'PRODUCTION READY 🔥',
                  'AI ⎯ ML ⎯ FULL-STACK',
                  'PRODUCTION READY 🔥',
                  'AI ⎯ ML ⎯ FULL-STACK',
                ]}
              />
              {sections.about && <About />}
              {sections.projects && <Projects projects={projects} />}
              <Ticker
                speed={0.4}
                items={[
                  'PYTHON ⎯ LLMS ⎯ RAG ⎯ LANGCHAIN ⎯ MACHINE LEARNING ⎯ REACT ⎯ NEXTJS ⎯ NODE ⎯ FASTAPI ⎯ MONGODB ⎯ FIREBASE ⎯ GIT ⎯',
                ]}
              />
              {sections.services && <Services />}
              {sections.experience && <Experience />}
              {sections.contact && <Contact />}
            </>
          )}
          <Footer />
        </div>
      </main>
    </>
  )
}
