# Backend Plan — Analytics, Feedback & Content Admin

_Portfolio backend architecture. Written 2026-07-23._

---

## TL;DR

- **You are NOT using Supabase yet.** Right now the site is 100% static: Next.js 14 on
  Netlify, all content in `data/*.js`, EmailJS for the contact form. No database, no server.
- **You do NOT need to deploy a backend server.** Supabase _is_ your backend (hosted
  Postgres + auth + auto-generated API). Your frontend talks to it directly.
- **Your "run the admin only on my laptop" idea is right** — and you don't need ngrok.
  Plain `localhost` is enough, and it's the most secure option because the admin UI never
  exists on the public internet.

---

## The architecture

```
                    ┌────────────────────────────────────┐
                    │            SUPABASE (cloud)          │
                    │   Postgres DB + Auth + Auto REST API │
                    │                                      │
                    │   Tables:                            │
                    │     • page_views   (analytics)       │
                    │     • feedback     (visitor notes)   │
                    │     • projects     (optional, later) │
                    │     • research     (optional, later) │
                    └───────▲──────────────────▲───────────┘
        INSERT-only         │                  │   full read/write
   (anon public key + RLS)  │                  │  (service_role key, .env.local)
                    ┌───────┴────────┐  ┌──────┴──────────────────┐
                    │ PUBLIC SITE    │  │ ADMIN (localhost only)   │
                    │ Netlify deploy │  │ `npm run dev`            │
                    │ read-only      │  │ never deployed           │
                    │ + logs views   │  │ you read analytics,      │
                    │ + accepts      │  │ read/reply feedback,     │
                    │   feedback     │  │ edit content             │
                    └────────────────┘  └──────────────────────────┘
```

**Why this needs zero backend server:** Supabase hosts the database and exposes a secure
API automatically. Netlify hosts your static frontend. Neither is a server you deploy,
patch, or keep running. The "admin" is just your existing `npm run dev` with a few extra
pages that only you ever open.

### The two keys (this is the security model)

Supabase gives every project two API keys:

| Key | Where it lives | What it can do |
|-----|----------------|----------------|
| **anon (public)** | In the deployed public site (safe to expose) | Only what RLS policies allow — here: INSERT a page view or feedback row, nothing else |
| **service_role (secret)** | Only in `.env.local` on your laptop, **never committed, never deployed** | Full read/write, bypasses RLS |

**RLS = Row Level Security.** Postgres rules that say, e.g., "anon may INSERT into
`feedback` but may never SELECT, UPDATE or DELETE." So even though the public key ships in
the browser, a visitor can leave feedback but can never read anyone else's feedback or your
analytics. Your reading/editing all happens on localhost with the secret key.

---

## Two admin options — pick B (matches your instinct)

**Option A — Deployed admin, protected by login.** Admin lives at `/admin` on the live
site, gated by Supabase Auth so only your email logs in. Convenient (edit from anywhere)
but the admin surface is on the public internet.

**Option B — Localhost-only admin (RECOMMENDED).** Admin pages exist only when you run
`npm run dev` on your machine. You never deploy them. The public build doesn't even include
them. There is no admin login to attack because there is no public admin. Start it when you
want to manage things, `Ctrl-C` when done — exactly what you described.

> ngrok is only needed if you want to reach the localhost admin from your **phone or another
> device**. From your own laptop, `http://localhost:3000/admin` is enough. Skip ngrok for now.

---

## What goes where

| Need | Lives in | Written by | Read by |
|------|----------|-----------|---------|
| Page / flow-post views | Supabase `page_views` | Public visitors (insert-only) | You (localhost admin) |
| Feedback / thoughts | Supabase `feedback` | Public visitors (insert-only) | You (localhost admin) |
| Projects & research content | **Phase 1:** stay in `data/*.js`  ·  **Phase 2:** Supabase | You | Everyone |

Analytics and feedback are dynamic (strangers write to them) → they _must_ be in Supabase.
Content is only edited by you → keep it in `data/` files at first (simplest, free,
version-controlled, keeps the site fully static and fast). Migrate content to Supabase later
only if editing files by hand becomes annoying.

---

## Step-by-step

### Phase 1 — Supabase for analytics + feedback (the actual "backend")

1. **Create a Supabase project** at supabase.com (free tier is plenty for a portfolio).
   Note the Project URL, the `anon` key, and the `service_role` key.

2. **Create the tables + RLS policies.** In the Supabase SQL editor:

   ```sql
   -- Analytics: one row per page/flow-post view
   create table page_views (
     id         bigint generated always as identity primary key,
     path       text not null,          -- e.g. '/research/why-ai-repaints-your-image'
     slug       text,                   -- e.g. 'why-ai-repaints-your-image'
     referrer   text,
     created_at timestamptz default now()
   );

   -- Visitor feedback / thoughts
   create table feedback (
     id         bigint generated always as identity primary key,
     path       text,                   -- which page it was left on
     name       text,                   -- optional
     message    text not null,
     created_at timestamptz default now()
   );

   alter table page_views enable row level security;
   alter table feedback   enable row level security;

   -- Anon may ONLY insert. No select/update/delete for the public.
   create policy "anon insert views"    on page_views for insert to anon with check (true);
   create policy "anon insert feedback" on feedback   for insert to anon with check (true);
   -- (service_role bypasses RLS, so your localhost admin can read everything.)
   ```

3. **Add the client library + env vars.**

   ```bash
   npm install @supabase/supabase-js
   ```

   `.env.local` (already gitignored — confirm `.env*` is in `.gitignore`):

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...          # public, safe in browser
   SUPABASE_SERVICE_ROLE_KEY=eyJ...              # secret — laptop only, never deploy
   ```

   In Netlify, set only the first two (URL + anon) as build env vars. **Never** put the
   service_role key in Netlify.

4. **Log a view.** A tiny public client + a hook fired on each research/project page:

   ```js
   // lib/supabasePublic.js
   import { createClient } from '@supabase/supabase-js'
   export const supabasePublic = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL,
     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
   )
   ```

   ```js
   // hooks/useTrackView.js
   import { useEffect } from 'react'
   import { supabasePublic } from '../lib/supabasePublic'
   export function useTrackView(slug) {
     useEffect(() => {
       supabasePublic.from('page_views').insert({
         path: window.location.pathname,
         slug: slug ?? null,
         referrer: document.referrer || null,
       })
     }, [slug])
   }
   ```

   Call `useTrackView(entry.slug)` inside `ResearchDetail` / `ProjectDetail`.

5. **Feedback form.** A small component that inserts into `feedback` via `supabasePublic`.
   Drop it at the bottom of research posts.

6. **Admin (localhost only).** Add `pages/admin/index.js`. It uses the **service_role**
   client (server-side only) to read `page_views` (counts grouped by slug) and `feedback`.
   Guard it so it refuses to render in production:

   ```js
   // pages/admin/index.js
   export async function getServerSideProps() {
     if (process.env.NODE_ENV === 'production') return { notFound: true }
     const { createClient } = require('@supabase/supabase-js')
     const admin = createClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL,
       process.env.SUPABASE_SERVICE_ROLE_KEY      // secret, server-side only
     )
     const { data: feedback } = await admin
       .from('feedback').select('*').order('created_at', { ascending: false })
     const { data: views } = await admin.from('page_views').select('slug')
     // tally views per slug in JS, pass both to the page
     return { props: { feedback: feedback ?? [], views: views ?? [] } }
   }
   ```

   Because it's `notFound` in production and the service_role key isn't in Netlify anyway,
   this page is effectively invisible and non-functional on the live site — it only works on
   your laptop.

### Phase 2 (optional, later) — move content into Supabase

Only if hand-editing `data/*.js` gets tedious.

1. Add `projects` and `research` tables (RLS: anon may SELECT, writes only via service_role).
2. Public pages read them with `getStaticProps` + `revalidate` (ISR) so new content appears
   without a manual redeploy — or trigger a Netlify build hook from the admin after saving.
3. Build simple CRUD forms in `pages/admin` (localhost) to add/edit entries.

Until then, your current "edit the data file and `git push`" flow already _is_ a
version-controlled local admin for content — keep using it.

---

## Cost & effort

- **Supabase free tier:** 500 MB DB, 50k monthly active users — far beyond a portfolio's needs. $0.
- **Netlify:** unchanged, still free static hosting.
- **Effort:** Phase 1 is roughly a day — most of it is the admin dashboard UI, not the backend
  (the backend is just three SQL statements and two API keys).

---

## Open questions for you

1. **Analytics depth:** simple counts (views per post, total feedback) — or do you also want
   time-series charts, unique visitors, top referrers? Simple counts are trivial; charts are
   a bit more work.
2. **Content:** start with content staying in `data/*.js` (recommended), or go straight to
   managing projects/research from Supabase too?
3. **Admin reach:** laptop-only (`localhost`, no ngrok) confirmed, or do you want phone access
   later (then we add ngrok or Option A)?
