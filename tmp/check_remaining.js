const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  await client.connect();
  try {
    const res = await client.query(`
      SELECT 
        visitor_id, 
        COUNT(*) as row_count,
        SUM(1 + COALESCE(revisit_count, 0)) as total_views,
        array_agg(DISTINCT country) as countries,
        array_agg(DISTINCT device) as devices
      FROM page_views 
      GROUP BY visitor_id
    `);
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}
run();
