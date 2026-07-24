import Head from 'next/head'
import Link from 'next/link'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import Reveal from '../../components/Reveal'
import courses from '../../data/courses'
import { useTrackView } from '../../hooks/useTrackView'

// Courses & digital products. Content lives in data/courses.js —
// flip `available` to true there when a course launches.
export default function CoursesPage() {
  useTrackView('courses')

  return (
    <>
      <Head>
        <title>Courses — Vimal Srinivasan</title>
        <meta
          name="description"
          content="Courses and digital products by Vimal Srinivasan — learn AI development, RAG chatbots and full-stack engineering."
        />
        <link rel="shortcut icon" href="/assets/img/favicon.png" type="image/x-icon" />
      </Head>

      <Navigation />

      <main className="main project-detail">
        <div className="container">
          <Link href="/" className="project-detail__back mono">
            ← Back home
          </Link>

          <header className="project-detail__header">
            <p className="mono project-detail__meta-line">Learn with me</p>
            <h1 className="display project-detail__title">Courses.</h1>
            <p className="project-detail__summary">
              Courses and digital products I&apos;m building so you can grab what I&apos;ve
              learned and use it in your own work. First releases are on the way.
            </p>
          </header>

          <div className="cards">
            {courses.map((course, i) => (
              <Reveal key={course.id} delay={i * 90}>
                <article className="card">
                  <span className="card__kicker">
                    {course.kicker} <span className="arrow">↗</span>
                  </span>
                  <p className="card__description">{course.description}</p>
                  <div className="card__tags">
                    {course.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="card__title">{course.title}</h3>
                  {course.available && course.link ? (
                    <a href={course.link} className="project-detail__live">
                      Enroll now ↗
                    </a>
                  ) : (
                    <span className="mono course-card__soon">Coming soon</span>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
