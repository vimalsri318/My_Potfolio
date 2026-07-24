const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  await client.connect();
  try {
    const ids = [
      '5f0ea8bc-2a87-4663-bf14-e37ff11b056f',
      '926460cd-a5dc-4a0f-a5e7-c8efe4c06ef1',
      '4741dcc7-f31b-4784-8d75-fde16d8e18a3',
      '9ef2372d-8c4f-4b09-93e2-0d167a40b39b',
      'c836064d-c55c-4604-9df0-2a38241a8c1d'
    ];
    
    // Also delete any other rows generated locally (country is null)
    // Actually, just to be safe, I'll delete the specific IDs + any localhost hits.
    const res1 = await client.query(`DELETE FROM page_views WHERE visitor_id = ANY($1) OR country IS NULL;`, [ids]);
    console.log(`Deleted ${res1.rowCount} rows from page_views`);

    const res2 = await client.query(`DELETE FROM events WHERE visitor_id = ANY($1) OR country IS NULL;`, [ids]);
    console.log(`Deleted ${res2.rowCount} rows from events`);

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}
run();
