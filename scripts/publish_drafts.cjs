// Same as the admin's "Publish to production" (pages/api/admin/publish.js,
// scope 'all'), for use from the terminal: copies every changed draft into the
// live columns production reads. Prints what's pending first; --yes to publish.
//
//   node scripts/publish_drafts.cjs          # dry run: list pending changes
//   node scripts/publish_drafts.cjs --yes    # publish them
//   node scripts/publish_drafts.cjs --yes --content-only   # projects + research only;
//                                                          # leave section switches and flags as drafts
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env'), quiet: true })
const env = Object.fromEntries(Object.entries(process.env).map(([k, v]) => [k.trim(), v]))
const { createClient } = require('@supabase/supabase-js')
const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
const changed = (a, b) => JSON.stringify(a) !== JSON.stringify(b)

async function main() {
  const go = process.argv.includes('--yes')
  const now = new Date().toISOString()
  for (const table of ['projects', 'research']) {
    const { data } = await db.from(table).select('id, slug, draft, published')
    const rows = (data || []).filter((r) => r.published == null || changed(r.draft, r.published))
    console.log(`${table}: ${rows.length} pending${rows.length ? ' — ' + rows.map((r) => r.slug).join(', ') : ''}`)
    if (go) for (const r of rows) {
      const { error } = await db.from(table).update({ published: r.draft, updated_at: now }).eq('id', r.id)
      if (error) throw new Error(`${table}/${r.slug}: ${error.message}`)
    }
  }
  if (process.argv.includes('--content-only')) {
    console.log('sections + flags: left as drafts (--content-only)')
    console.log(go ? 'Published.' : 'Dry run — pass --yes to publish.')
    return
  }
  const { data: secs } = await db.from('site_sections').select('key, enabled, enabled_draft')
  const pendingSecs = (secs || []).filter((s) => s.enabled_draft != null && s.enabled_draft !== s.enabled)
  console.log(`sections: ${pendingSecs.map((s) => `${s.key} → ${s.enabled_draft ? 'on' : 'off'}`).join(', ') || 'none pending'}`)
  if (go) for (const s of pendingSecs) await db.from('site_sections').update({ enabled: s.enabled_draft }).eq('key', s.key)
  const { data: flags } = await db.from('content_flags').select('id, type, slug, published, published_draft')
  const pendingFlags = (flags || []).filter((f) => f.published_draft != null && f.published_draft !== f.published)
  console.log(`visibility flags: ${pendingFlags.map((f) => `${f.type}:${f.slug} → ${f.published_draft ? 'visible' : 'hidden'}`).join(', ') || 'none pending'}`)
  if (go) for (const f of pendingFlags) await db.from('content_flags').update({ published: f.published_draft }).eq('id', f.id)
  console.log(go ? 'Published.' : 'Dry run — pass --yes to publish.')
}
main().catch((e) => { console.error(e); process.exit(1) })
