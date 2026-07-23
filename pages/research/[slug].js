import ResearchDetail from '../../components/ResearchDetail'
import { getResearchSorted, getResearchBySlug, getNextResearch } from '../../lib/contentStore'

export default function ResearchEntryPage({ entry, nextEntry }) {
  return <ResearchDetail entry={entry} nextEntry={nextEntry} />
}

export function getStaticPaths() {
  return {
    paths: getResearchSorted().map((r) => ({ params: { slug: r.slug } })),
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
