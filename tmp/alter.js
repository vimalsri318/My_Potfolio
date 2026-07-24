const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  const { data, error } = await supabase.rpc('exec_sql', {
    query: 'ALTER TABLE page_views ADD COLUMN IF NOT EXISTS revisit_count INTEGER DEFAULT 0;'
  });
  console.log('rpc exec_sql:', error);
  
  // If rpc doesn't exist, we might not be able to alter table via API.
}
run();
