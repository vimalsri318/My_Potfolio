require('dotenv').config({ path: '.env' })
const { Client } = require('pg')

async function initDB() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is missing in .env')
    process.exit(1)
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  })

  try {
    await client.connect()
    console.log('Connected to Postgres...')

    const sql = `
      -- Analytics
      create table if not exists page_views (
        id         bigint generated always as identity primary key,
        path       text not null,
        slug       text,
        referrer   text,
        created_at timestamptz default now()
      );

      -- Feedback
      create table if not exists feedback (
        id         bigint generated always as identity primary key,
        path       text,
        name       text,
        message    text not null,
        created_at timestamptz default now()
      );

      -- Projects
      create table if not exists projects (
        id          bigint generated always as identity primary key,
        slug        text unique not null,
        title       text not null,
        category    text,
        year        text,
        role        text,
        image       text,
        gallery     jsonb default '[]'::jsonb,
        link        text,
        tech        jsonb default '[]'::jsonb,
        summary     text,
        description jsonb default '[]'::jsonb,
        highlights  jsonb default '[]'::jsonb,
        created_at  timestamptz default now()
      );

      -- Research
      create table if not exists research (
        id          bigint generated always as identity primary key,
        slug        text unique not null,
        title       text not null,
        topic       text,
        date        text,
        readingTime text,
        tags        jsonb default '[]'::jsonb,
        summary     text,
        cover       text,
        interactive jsonb,
        resources   jsonb default '[]'::jsonb,
        downloads   jsonb default '[]'::jsonb,
        body        jsonb default '[]'::jsonb,
        created_at  timestamptz default now()
      );

      -- Likes
      create table if not exists likes (
        id         bigint generated always as identity primary key,
        path       text not null,
        created_at timestamptz default now()
      );

      -- Enable RLS
      alter table page_views enable row level security;
      alter table feedback enable row level security;
      alter table projects enable row level security;
      alter table research enable row level security;
      alter table likes enable row level security;

      -- Drop existing policies if they exist (to allow re-running)
      drop policy if exists "anon insert views" on page_views;
      drop policy if exists "anon insert feedback" on feedback;
      drop policy if exists "anon select projects" on projects;
      drop policy if exists "anon select research" on research;
      drop policy if exists "anon select likes" on likes;
      drop policy if exists "anon insert likes" on likes;

      -- Create policies
      create policy "anon insert views" on page_views for insert to anon with check (true);
      create policy "anon insert feedback" on feedback for insert to anon with check (true);
      
      create policy "anon select projects" on projects for select to anon using (true);
      create policy "anon select research" on research for select to anon using (true);
      
      create policy "anon select likes" on likes for select to anon using (true);
      create policy "anon insert likes" on likes for insert to anon with check (true);
      
      -- Add realtime publication for likes if needed (optional)
      -- alter publication supabase_realtime add table likes;
    `

    console.log('Executing DDL...')
    await client.query(sql)
    console.log('Successfully created tables and policies!')

  } catch (err) {
    console.error('Error executing script:', err)
  } finally {
    await client.end()
  }
}

initDB()
