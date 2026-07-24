import ResearchDetail from '../../components/ResearchDetail'
import { getResearchSorted, getResearchBySlug, getNextResearch } from '../../lib/contentStore'
import { getVisibility } from '../../lib/visibility'

export default function ResearchEntryPage({ entry, nextEntry }) {
  return <ResearchDetail entry={entry} nextEntry={nextEntry} />
}

export function getStaticPaths() {
  return {
    paths: getResearchSorted().map((r) => ({ params: { slug: r.slug } })),
    fallback: 'blocking',
  }
}

export async function getStaticProps({ params }) {
  const entry = getResearchBySlug(params.slug)
  if (!entry) return { notFound: true }

  // Unpublished posts 404 (and drop out of "next read" rotation).
  const { hiddenResearch } = await getVisibility()
  if (hiddenResearch.includes(entry.slug)) return { notFound: true, revalidate: 15 }

  let nextEntry = getNextResearch(params.slug)
  if (nextEntry && hiddenResearch.includes(nextEntry.slug)) {
    const visible = getResearchSorted().filter((r) => !hiddenResearch.includes(r.slug) && r.slug !== entry.slug)
    nextEntry = visible[0] || null
  }

  return {
    props: { entry, nextEntry },
    revalidate: 15,
  }
}
