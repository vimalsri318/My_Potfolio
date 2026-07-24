require('dotenv').config({ path: '.env' })
const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

// One-time seed: move data/projects.json + data/research.json into the new
// Supabase `projects` / `research` tables. Each item is written with
//   draft = published = <content>
// so production immediately matches what's live today — nothing disappears.
//
// Safe to re-run: it upserts on `slug`. Existing rows are refreshed from the
// JSON, so run this only for the initial seed (or a deliberate reset from JSON).
//
//   node scripts/migrateContentToSupabase.js
//   node scripts/migrateContentToSupabase.js --dry-run

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env')
  process.exit(1)
}
const db = createClient(url, key, { auth: { persistSession: false } })
const dryRun = process.argv.includes('--dry-run')

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', file), 'utf8'))
}

async function seed(collection, file) {
  const items = readJson(file)
  console.log(`\n${collection}: found ${items.length} item(s) in data/${file}`)
  let ok = 0
  for (let i = 0; i < items.length; i++) {
    const { id, sort, ...content } = items[i]
    const slug = String(content.slug || '').trim()
    if (!slug) {
      console.warn(`  ! skipping item ${i} — no slug`)
      continue
    }
    const row = { slug, draft: content, published: content, sort: sort ?? i }
    if (dryRun) {
      console.log(`  · would upsert ${slug} (sort ${row.sort})`)
      continue
    }
    const { error } = await db.from(collection).upsert(row, { onConflict: 'slug' })
    if (error) {
      console.error(`  ✗ ${slug} —`, error.message)
    } else {
      ok++
      console.log(`  ✓ ${slug}`)
    }
  }
  console.log(`${collection}: ${dryRun ? 'dry-run complete' : `${ok}/${items.length} upserted`}`)
}

async function main() {
  console.log(`${dryRun ? '[dry-run] ' : ''}Seeding content into Supabase…`)
  await seed('projects', 'projects.json')
  await seed('research', 'research.json')
  console.log('\nDone.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
