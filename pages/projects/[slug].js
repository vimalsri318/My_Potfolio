import ProjectDetail from '../../components/ProjectDetail'
import projects, { getProjectBySlug, getNextProject } from '../../data/projects'

export default function ProjectPage({ project, nextProject }) {
  return <ProjectDetail project={project} nextProject={nextProject} />
}

export function getStaticPaths() {
  return {
    paths: projects.map((p) => ({ params: { slug: p.slug } })),
    fallback: false,
  }
}

export function getStaticProps({ params }) {
  const project = getProjectBySlug(params.slug)
  if (!project) return { notFound: true }

  return {
    props: {
      project,
      nextProject: getNextProject(params.slug),
    },
  }
}
