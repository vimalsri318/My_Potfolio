require('dotenv').config({ path: '.env' })
const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or Service Role Key in .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

function requireDataFile(filePath, varName) {
  const content = fs.readFileSync(filePath, 'utf-8')
  // Remove exports so we can evaluate the file cleanly
  const code = content
    .replace(/export default /g, 'const defaultExport = ')
    .replace(/export const /g, 'const ')
    .replace(/export function /g, 'function ')
  
  return new Function(code + `\nreturn ${varName};`)()
}

async function migrate() {
  console.log('Starting data migration to Supabase...')
  
  // Migrate Projects
  try {
    const projects = requireDataFile(path.join(__dirname, '../data/projects.js'), 'projects')
    console.log(`Found ${projects.length} projects. Inserting...`)
    
    // Remove the hardcoded 'id' so Supabase auto-increments correctly
    const projectsData = projects.map(({ id, ...rest }) => rest)
    
    const { error: pErr } = await supabase.from('projects').insert(projectsData)
    if (pErr) throw pErr
    console.log('✅ Projects migrated successfully!')
  } catch (err) {
    console.error('❌ Error migrating projects:', err.message || err)
  }

  // Migrate Research
  try {
    const research = requireDataFile(path.join(__dirname, '../data/research.js'), 'research')
    console.log(`Found ${research.length} research entries. Inserting...`)
    
    const researchData = research.map(({ id, readingTime, ...rest }) => ({ readingtime: readingTime, ...rest }))
    
    const { error: rErr } = await supabase.from('research').insert(researchData)
    if (rErr) throw rErr
    console.log('✅ Research migrated successfully!')
  } catch (err) {
    console.error('❌ Error migrating research:', err.message || err)
  }

  console.log('Migration script complete.')
}

migrate()
