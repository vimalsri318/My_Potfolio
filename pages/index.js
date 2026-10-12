import Head from 'next/head'
import Navigation from '../components/Navigation'
import Home from '../components/Home'
import Ticker from '../components/Ticker'
import About from '../components/About'
import Projects from '../components/Projects'
import Services from '../components/Services'
import Experience from '../components/Experience'
import Contact from '../components/Contact'
import Testimonials from '../components/Testimonials'
import Footer from '../components/Footer'
import ComingSoon from '../components/ComingSoon'
import { useTrackView } from '../hooks/useTrackView'
import { getProjects, getTestimonials } from '../lib/contentStore'
import { getVisibility } from '../lib/visibility'
import fs from 'fs'
import path from 'path'
import { pickScreens, thumbPaths } from '../lib/mock.mjs'
import snapshot from '../data/projects.json'

// The home page only renders cards and offer links, so send those fields.
// Full records (case-study scenes, blocks, long copy) stay on the detail pages.
const CARD_FIELDS = [
  'slug', 'title', 'tagline', 'category', 'kind', 'year', 'status', 'accent',
  'film', 'link', 'platforms', 'stack', 'tech', 'metrics',
]
const onDisk = (src) => src && fs.existsSync(path.join(process.cwd(), 'public', src))

// The one desktop screen (and phone screen, if any) shown in the device
// mock-up: the small thumbnail when it exists, else the original image.
// Published rows can carry fewer screen details than the committed snapshot
// (no phone shots, no kinds), so the snapshot's choice wins when there is one;
// it is also what the thumbnails were generated from.
function mockFor(p) {
  const live = pickScreens(p)
  const snap = snapshot.find((x) => x.slug === p.slug)
  const base = snap ? pickScreens(snap) : {}
  const pick = { desktop: base.desktop || live.desktop, phone: base.phone || live.phone }
  const t = thumbPaths(pick)
  return {
    desktop: onDisk(t.desktop) ? t.desktop : pick.desktop,
    phone: onDisk(t.phone) ? t.phone : pick.phone,
  }
}

const toCard = (p) => ({
  ...Object.fromEntries(CARD_FIELDS.filter((k) => p[k] !== undefined).map((k) => [k, p[k]])),
  mock: mockFor(p),
})

export async function getStaticProps() {
  const { sections, hiddenProjects } = await getVisibility()
  const projects = (await getProjects())
    .filter((p) => !hiddenProjects.includes(p.slug))
    .map(toCard)
  const testimonials = await getTestimonials()
  return {
    props: {
      projects,
      comingSoon: sections.coming_soon,
      sections,
      testimonials,
    },
    revalidate: 15, // ISR: pick up admin visibility toggles within ~15s
  }
}

export default function Portfolio({ projects, comingSoon, sections = {}, testimonials = [] }) {
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
      </Head>

      <Navigation sections={sections} />
      <main className="main">
        <Home showActions={!comingSoon} />
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
              {sections.services && <Services projects={projects} />}
              {sections.experience && <Experience />}
              {sections.testimonials && <Testimonials items={testimonials} />}
              {sections.contact && <Contact />}
            </>
          )}
          <Footer />
        </div>
      </main>
    </>
  )
}
