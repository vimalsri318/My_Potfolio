import ProjectDetail from '../../components/ProjectDetail'
import { getProjects, getProjectBySlug, getNextProject } from '../../lib/contentStore'
import { getVisibility } from '../../lib/visibility'

export default function ProjectPage({ project, nextProject }) {
  return <ProjectDetail project={project} nextProject={nextProject} />
}

export function getStaticPaths() {
  return {
    paths: getProjects().map((p) => ({ params: { slug: p.slug } })),
    fallback: 'blocking',
  }
}

export async function getStaticProps({ params }) {
  const project = getProjectBySlug(params.slug)
  if (!project) return { notFound: true }

  // Unpublished projects 404 (and drop out of "next project" rotation).
  const { hiddenProjects } = await getVisibility()
  if (hiddenProjects.includes(project.slug)) return { notFound: true, revalidate: 15 }

  let nextProject = getNextProject(params.slug)
  if (nextProject && hiddenProjects.includes(nextProject.slug)) {
    const visible = getProjects().filter((p) => !hiddenProjects.includes(p.slug) && p.slug !== project.slug)
    nextProject = visible[0] || null
  }

  return {
    props: { project, nextProject },
    revalidate: 15,
  }
}
