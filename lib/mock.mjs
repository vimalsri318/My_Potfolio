// Which screenshot stands in for a project on the landing page: one desktop
// screen and, when the project has one, one phone screen. Shared by the
// thumbnail script and getStaticProps so the two always agree.
const isLocal = (s) => typeof s === 'string' && s.startsWith('/assets/')
const kindOf = (s) => s.kind || (s.wide ? 'wide' : (/-m\.(jpg|png|webp)$/.test(s.src || '') ? 'phone' : 'desktop'))

export function pickScreens(project) {
  const screens = Array.isArray(project.screens) ? project.screens : []
  const desk = screens.find((s) => kindOf(s) === 'desktop' && isLocal(s.src))
  const phone = screens.find((s) => kindOf(s) === 'phone' && isLocal(s.src))
  const cover = [project.cover, project.image].find(isLocal)
  return {
    desktop: desk ? desk.src : cover || null,
    phone: phone ? phone.src : isLocal(project.mobileImage) ? project.mobileImage : null,
  }
}

// Thumbnails sit in the project's own image folder (which is not always named
// after the slug), derived from whichever source image was picked.
const folderOf = (src) => (src.includes('/case/') ? src.slice(0, src.indexOf('/case/')) : src.replace(/\/[^/]+$/, ''))

// Only images inside a per-project folder get thumbnails; loose legacy files
// in /assets/img are used as they are.
const inProject = (src) => src && src.startsWith('/assets/img/projects/')

export const thumbPaths = (pick) => ({
  desktop: inProject(pick.desktop) ? `${folderOf(pick.desktop)}/thumb.webp` : null,
  phone: inProject(pick.phone) ? `${folderOf(pick.phone)}/thumb-m.webp` : null,
})
