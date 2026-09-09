// Content data layer. Projects and research live in Supabase now (moved out of
// the old data/*.json files) so the admin can publish to production without a
// redeploy. Each row carries a `draft` (the local working copy) and a
// `published` snapshot (what the live site serves).
//
//   • Local dev  -> reads `draft`     : you see work-in-progress immediately.
//   • Production -> reads `published`  : visitors only see published content.
//   • Publishing (pages/api/admin/publish.js) copies draft -> published.
//
// Reads happen server-side only (getStaticProps / getStaticPaths / API routes)
// with the service_role key — which is already configured in .env and on Vercel
// (the analytics ingest at pages/api/track.js relies on it). If Supabase is
// unreachable we fall back to the committed data/*.json snapshot so the public
// site never hard-fails.
import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const FILES = {
  projects: path.join(DATA_DIR, 'projects.json'),
  research: path.join(DATA_DIR, 'research.json'),
}

// Production serves published content; everywhere else shows the live draft.
const STAGE = process.env.NODE_ENV === 'production' ? 'published' : 'draft'

function serverClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  const { createClient } = require('@supabase/supabase-js')
  return createClient(url, key, { auth: { persistSession: false } })
}

function readFileCollection(collection) {
  try {
    return JSON.parse(fs.readFileSync(FILES[collection], 'utf8'))
  } catch {
    return []
  }
}

// Read a collection at the given stage. Returns item objects with `id` and
// `slug` merged in. Falls back to data/*.json on any failure so the public
// pages keep rendering even if Supabase is down or not migrated yet.
async function readStage(collection, stage = STAGE) {
  const db = serverClient()
  if (!db) return readFileCollection(collection)
  try {
    const { data, error } = await db
      .from(collection)
      .select(`id, slug, sort, ${stage}`)
      .order('sort', { ascending: true })
    if (error) throw error
    return (data || [])
      .filter((row) => row[stage]) // published is null until first publish
      .map((row) => ({ ...row[stage], id: row.id, slug: row.slug }))
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`contentStore: ${collection} read failed, falling back to data/${collection}.json —`, e.message)
    }
    return readFileCollection(collection)
  }
}

// ── Read helpers for the public pages (server-side, async) ───────────
export async function getProjects() {
  return readStage('projects')
}

export async function getProjectBySlug(slug) {
  return (await getProjects()).find((p) => p.slug === slug) || null
}

export async function getNextProject(slug) {
  const items = await getProjects()
  const i = items.findIndex((p) => p.slug === slug)
  if (i === -1 || items.length < 2) return null
  return items[(i + 1) % items.length]
}

export async function getResearchSorted() {
  const items = await readStage('research')
  return items.sort((a, b) => new Date(b.date) - new Date(a.date))
}

export async function getResearchBySlug(slug) {
  return (await getResearchSorted()).find((r) => r.slug === slug) || null
}

export async function getNextResearch(slug) {
  const ordered = await getResearchSorted()
  const i = ordered.findIndex((r) => r.slug === slug)
  if (i === -1 || ordered.length < 2) return null
  return ordered[(i + 1) % ordered.length]
}

export async function getTestimonials() {
  const db = serverClient()
  if (!db) return []
  try {
    const { data, error } = await db
      .from('testimonials')
      .select('*')
      .eq('status', 'approved')
      .order('is_featured', { ascending: false })
      .order('sort', { ascending: true })
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('contentStore: testimonials read failed —', e.message)
    }
    return []
  }
}

// ── Admin CRUD — always operates on the `draft` copy ─────────────────
// Publishing (draft -> published) is a separate, explicit step. These require
// the service_role key and only ever run from local admin API routes.
function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase service role key not configured in .env')
  const { createClient } = require('@supabase/supabase-js')
  return createClient(url, key, { auth: { persistSession: false } })
}

// Strip our own row/meta keys before storing an item in the draft jsonb.
function stripMeta(item) {
  const { id, sort, _status, created_at, updated_at, ...rest } = item || {}
  return rest
}

// draft published? -> 'draft' (never published) | 'live' (equal) | 'modified'
function statusOf(row) {
  if (row.published == null) return 'draft'
  return JSON.stringify(row.published) === JSON.stringify(row.draft) ? 'live' : 'modified'
}

// Full admin listing: draft content flattened, with `_status` for the badge.
export async function adminList(collection) {
  const db = adminClient()
  const { data, error } = await db
    .from(collection)
    .select('id, slug, sort, draft, published')
    .order('sort', { ascending: true })
  if (error) throw error
  return (data || []).map((row) => ({ ...row.draft, id: row.id, slug: row.slug, sort: row.sort, _status: statusOf(row) }))
}

export async function adminCreate(collection, item) {
  const db = adminClient()
  const slug = String(item?.slug || '').trim()
  if (!slug) throw new Error('slug is required')
  const { data: top } = await db.from(collection).select('sort').order('sort', { ascending: false }).limit(1)
  const nextSort = ((top && top[0] && top[0].sort) || 0) + 1
  const { data, error } = await db
    .from(collection)
    .insert({ slug, draft: stripMeta(item), sort: nextSort })
    .select('id, slug, draft, published')
    .single()
  if (error) throw new Error(error.message)
  return { ...data.draft, id: data.id, slug: data.slug, _status: statusOf(data) }
}

export async function adminUpdate(collection, id, patch) {
  const db = adminClient()
  const { data: existing } = await db.from(collection).select('id, slug, draft').eq('id', id).maybeSingle()
  if (!existing) return null
  const draft = { ...existing.draft, ...stripMeta(patch) }
  const slug = patch?.slug ? String(patch.slug).trim() : existing.slug
  const { data, error } = await db
    .from(collection)
    .update({ slug, draft, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('id, slug, draft, published')
    .single()
  if (error) throw new Error(error.message)
  return { ...data.draft, id: data.id, slug: data.slug, _status: statusOf(data) }
}

export async function adminDelete(collection, id) {
  const db = adminClient()
  const { data: existing } = await db.from(collection).select('id, slug').eq('id', id).maybeSingle()
  if (!existing) return false
  const { error } = await db.from(collection).delete().eq('id', id)
  if (error) throw new Error(error.message)
  // Clean up any visibility flag pointing at this slug.
  const type = collection === 'projects' ? 'project' : 'research'
  await db.from('content_flags').delete().eq('type', type).eq('slug', existing.slug)
  return true
}
