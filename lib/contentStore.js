// Reads and writes the content JSON files that the public site renders.
// This is the "database" for projects and research — plain files in the
// repo, edited locally, published with `git push`. Server-side only.
import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')

const FILES = {
  projects: path.join(DATA_DIR, 'projects.json'),
  research: path.join(DATA_DIR, 'research.json'),
}

function fileFor(collection) {
  const file = FILES[collection]
  if (!file) throw new Error(`Unknown collection: ${collection}`)
  return file
}

export function readCollection(collection) {
  const file = fileFor(collection)
  const raw = fs.readFileSync(file, 'utf8')
  return JSON.parse(raw)
}

export function writeCollection(collection, items) {
  const file = fileFor(collection)
  fs.writeFileSync(file, JSON.stringify(items, null, 2) + '\n')
  return items
}

function nextId(items) {
  return items.reduce((max, it) => Math.max(max, Number(it.id) || 0), 0) + 1
}

export function createItem(collection, item) {
  const items = readCollection(collection)
  const created = { ...item, id: nextId(items) }
  items.push(created)
  writeCollection(collection, items)
  return created
}

export function updateItem(collection, id, patch) {
  const items = readCollection(collection)
  const idx = items.findIndex((it) => String(it.id) === String(id))
  if (idx === -1) return null
  const updated = { ...items[idx], ...patch, id: items[idx].id }
  items[idx] = updated
  writeCollection(collection, items)
  return updated
}

export function deleteItem(collection, id) {
  const items = readCollection(collection)
  const next = items.filter((it) => String(it.id) !== String(id))
  if (next.length === items.length) return false
  writeCollection(collection, next)
  return true
}

// ── Read helpers for the public pages ────────────────────────────────
// These read the JSON fresh on every call, so `npm run dev` reflects
// admin edits immediately. In a production build they run once at build
// time (getStaticProps), reading the committed JSON — same result.
export function getProjects() {
  return readCollection('projects')
}

export function getProjectBySlug(slug) {
  return getProjects().find((p) => p.slug === slug) || null
}

export function getNextProject(slug) {
  const items = getProjects()
  const i = items.findIndex((p) => p.slug === slug)
  if (i === -1 || items.length < 2) return null
  return items[(i + 1) % items.length]
}

export function getResearchSorted() {
  return [...readCollection('research')].sort((a, b) => new Date(b.date) - new Date(a.date))
}

export function getResearchBySlug(slug) {
  return getResearchSorted().find((r) => r.slug === slug) || null
}

export function getNextResearch(slug) {
  const ordered = getResearchSorted()
  const i = ordered.findIndex((r) => r.slug === slug)
  if (i === -1 || ordered.length < 2) return null
  return ordered[(i + 1) % ordered.length]
}
