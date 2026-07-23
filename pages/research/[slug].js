import ResearchDetail from '../../components/ResearchDetail'
import research, { getResearchBySlug, getNextResearch } from '../../data/research'

export default function ResearchEntryPage({ entry, nextEntry }) {
  return <ResearchDetail entry={entry} nextEntry={nextEntry} />
}

export function getStaticPaths() {
  return {
    paths: research.map((r) => ({ params: { slug: r.slug } })),
    fallback: false,
  }
}

export function getStaticProps({ params }) {
  const entry = getResearchBySlug(params.slug)
  if (!entry) return { notFound: true }

  return {
    props: {
      entry,
      nextEntry: getNextResearch(params.slug),
    },
  }
}
