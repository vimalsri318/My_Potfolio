const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  await client.connect();
  try {
    await client.query('ALTER TABLE page_views ADD COLUMN IF NOT EXISTS revisit_count INTEGER DEFAULT 0;');
    console.log('Added column successfully.');
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}
run();
