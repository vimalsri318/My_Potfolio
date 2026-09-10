const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const projectsFile = path.join(__dirname, '../data/projects.json');

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

async function syncProject(projectData, sortOrder) {
  console.log(`\nSyncing project: ${projectData.slug} (${projectData.title})...`);

  // 1. Update data/projects.json
  const fileContent = JSON.parse(fs.readFileSync(projectsFile, 'utf8'));
  const existingIdx = fileContent.findIndex(p => p.slug === projectData.slug);
  if (existingIdx >= 0) {
    fileContent[existingIdx] = { ...fileContent[existingIdx], ...projectData };
  } else {
    fileContent.push(projectData);
  }
  fs.writeFileSync(projectsFile, JSON.stringify(fileContent, null, 2), 'utf8');
  console.log(`✓ Updated data/projects.json`);

  // 2. Update Supabase
  const client = getSupabase();
  if (client) {
    try {
      const { data: existing } = await client
        .from('projects')
        .select('id, sort')
        .eq('slug', projectData.slug)
        .maybeSingle();

      const sort = sortOrder !== undefined ? sortOrder : (existing?.sort ?? 99);

      if (existing) {
        const { error: updateErr } = await client
          .from('projects')
          .update({
            draft: projectData,
            published: projectData,
            sort: sort
          })
          .eq('slug', projectData.slug);
        if (updateErr) console.error('Supabase update error:', updateErr.message);
        else console.log(`✓ Updated Supabase projects table (row id ${existing.id})`);
      } else {
        const { data: inserted, error: insertErr } = await client
          .from('projects')
          .insert({
            slug: projectData.slug,
            sort: sort,
            draft: projectData,
            published: projectData
          })
          .select()
          .single();
        if (insertErr) console.error('Supabase insert error:', insertErr.message);
        else console.log(`✓ Inserted into Supabase projects table (row id ${inserted.id})`);
      }

      // 3. Update content_flags
      const { data: existingFlag } = await client
        .from('content_flags')
        .select('id')
        .eq('type', 'project')
        .eq('slug', projectData.slug)
        .maybeSingle();

      if (existingFlag) {
        const { error: flagErr } = await client
          .from('content_flags')
          .update({ published: true, published_draft: true })
          .eq('id', existingFlag.id);
        if (flagErr) console.error('content_flags update error:', flagErr.message);
        else console.log(`✓ Updated content_flags (published: true)`);
      } else {
        const { error: flagErr } = await client
          .from('content_flags')
          .insert({
            type: 'project',
            slug: projectData.slug,
            published: true,
            published_draft: true
          });
        if (flagErr) console.error('content_flags insert error:', flagErr.message);
        else console.log(`✓ Inserted content_flags (published: true)`);
      }
    } catch (e) {
      console.error('Supabase sync failure:', e.message);
    }
  }
}

module.exports = { syncProject };
