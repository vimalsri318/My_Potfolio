// Stage projects from data/projects.json into Supabase as DRAFTS.
//
// Unlike scripts/sync_project.js (which writes draft AND published, i.e. goes
// live immediately), this only ever touches the `draft` column. New rows get
// published = null, so production keeps serving what it serves today. Review
// locally (`npm run dev` reads drafts), then press "Publish to production" in
// /admin when you're happy.
//
//   node scripts/stage_projects.js influnet buziness-os …   # stage these slugs
//   node scripts/stage_projects.js --sections services      # also turn a section on (draft)
//
// Existing rows: only fields the draft doesn't have yet are added — the draft
// (which may hold newer admin edits than this JSON snapshot) always wins.
// Pass --overwrite to push every JSON field over the draft instead.
// New rows: inserted with the given sort (SORT below) or after the last row.
const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: path.join(__dirname, '../.env') })

// .env has a key written as "SUPABASE_SERVICE_ROLE_KEY =" — tolerate the space.
const env = Object.fromEntries(Object.entries(process.env).map(([k, v]) => [k.trim(), v]))

// Catalogue order for newly inserted rows. Existing rows keep their sort —
// `sort` is shared by draft and live, so changing it would reorder production.
const SORT = {
  influnet: -6,
  'buziness-os': -5,
  'mithra-whole-foods': -4,
  'tecstellar-command-center': -3,
  'casa-harmony': -2,
  wassupos: -1,
  'email-finder': 10,
  reframe: 11,
  'black-hole': 12,
  'streak-doctor': 13,
  slate: 14,
  ardor: 15,
}

async function main() {
  const args = process.argv.slice(2)
  const overwrite = args.includes('--overwrite')
  const sectionsAt = args.indexOf('--sections')
  const sectionKeys = sectionsAt >= 0 ? args.slice(sectionsAt + 1) : []
  const slugs = (sectionsAt >= 0 ? args.slice(0, sectionsAt) : args).filter((a) => a && !a.startsWith('--'))

  const url = env.NEXT_PUBLIC_SUPABASE_URL
  const key = env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env')
  const db = createClient(url, key, { auth: { persistSession: false } })

  const items = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/projects.json'), 'utf8'))
  for (const slug of slugs) {
    const item = items.find((p) => p.slug === slug)
    if (!item) {
      console.warn(`✗ ${slug}: not in data/projects.json — skipped`)
      continue
    }
    const { id, sort, ...content } = item
    const { data: existing, error: readErr } = await db.from('projects').select('id, draft').eq('slug', slug).maybeSingle()
    if (readErr) throw readErr

    if (existing) {
      const draft = overwrite ? { ...existing.draft, ...content } : { ...content, ...existing.draft }
      const { error } = await db
        .from('projects')
        .update({ draft, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
      if (error) throw error
      console.log(`✓ ${slug}: draft updated (row ${existing.id}) — live copy untouched`)
    } else {
      let nextSort = SORT[slug]
      if (nextSort === undefined) {
        const { data: top } = await db.from('projects').select('sort').order('sort', { ascending: false }).limit(1)
        nextSort = ((top && top[0] && top[0].sort) || 0) + 1
      }
      const { data, error } = await db
        .from('projects')
        .insert({ slug, draft: content, sort: nextSort })
        .select('id')
        .single()
      if (error) throw error
      console.log(`✓ ${slug}: draft created (row ${data.id}, sort ${nextSort}) — not published`)
    }
  }

  for (const key of sectionKeys) {
    const { error } = await db.from('site_sections').update({ enabled_draft: true }).eq('key', key)
    if (error) throw error
    console.log(`✓ section "${key}": enabled in draft — publish from /admin to go live`)
  }
}

main().catch((e) => {
  console.error(e.message || e)
  process.exit(1)
})
