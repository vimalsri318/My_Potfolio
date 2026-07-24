require('dotenv').config({ path: '.env' })
const fs = require('fs')
const path = require('path')
const { Client } = require('pg')

// Applies the SQL files in supabase/migrations in filename order.
//
//   node scripts/applyMigrations.js              # apply all
//   node scripts/applyMigrations.js 20260724     # only files matching a prefix
//   node scripts/applyMigrations.js --dry-run    # print what would run
//
// Every migration in this repo is written to be idempotent, so re-running the
// whole set is safe — that's the reason there's no ledger table here.

const DIR = path.join(__dirname, '..', 'supabase', 'migrations')

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is missing in .env')
    process.exit(1)
  }

  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const filter = args.find((a) => !a.startsWith('--'))

  const files = fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith('.sql'))
    .filter((f) => !filter || f.startsWith(filter))
    .sort()

  if (!files.length) {
    console.log('No matching migrations.')
    return
  }

  console.log(`${dryRun ? 'Would apply' : 'Applying'} ${files.length} migration(s):`)
  files.forEach((f) => console.log('  ·', f))
  if (dryRun) return

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  })

  await client.connect()
  try {
    for (const file of files) {
      const sql = fs.readFileSync(path.join(DIR, file), 'utf-8')
      // One transaction per file, so a bad migration rolls back cleanly
      // instead of leaving the schema half-changed.
      await client.query('begin')
      try {
        await client.query(sql)
        await client.query('commit')
        console.log('✓', file)
      } catch (e) {
        await client.query('rollback')
        console.error('✗', file, '\n ', e.message)
        throw e
      }
    }
    console.log('\nDone.')
  } finally {
    await client.end()
  }
}

main().catch(() => process.exit(1))
