-- Move projects & research content into the backend.
--
-- Until now project/research content lived in git-versioned data/*.json files,
-- baked into the Vercel build — so any content change needed a redeploy. Moving
-- it here lets the local admin publish to production without a redeploy, the
-- same way section toggles already go live via Supabase + ISR.
--
-- Each row keeps two snapshots:
--   • draft     — the local working copy the dev site renders.
--   • published — what production serves (null until first publish).
-- Publishing (pages/api/admin/publish.js) copies draft -> published.
--
-- Reads are server-side only, with the service_role key (already used by
-- pages/api/track.js in production). Drafts are never exposed to anon. Idempotent.

create table if not exists public.projects (
  id         bigint generated always as identity primary key,
  slug       text unique not null,
  draft      jsonb not null,
  published  jsonb,
  sort       int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.research (
  id         bigint generated always as identity primary key,
  slug       text unique not null,
  draft      jsonb not null,
  published  jsonb,
  sort       int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── RLS ──────────────────────────────────────────────────────────────
-- No anon policies on the base tables: drafts must never be publicly readable.
-- The admin (service_role) and server-side page reads bypass RLS.
alter table public.projects enable row level security;
alter table public.research enable row level security;

-- Published-only views for any future public/client reads. Views run with the
-- definer's rights, so anon sees published rows without touching the base RLS.
create or replace view public.published_projects as
  select slug, published as data, sort from public.projects where published is not null;
create or replace view public.published_research as
  select slug, published as data, sort from public.research where published is not null;
grant select on public.published_projects to anon;
grant select on public.published_research to anon;

-- ── Draft columns for the visibility toggles ─────────────────────────
-- Section on/off and per-item publish flags get a draft copy too, so those
-- toggles stay local until Publish. Dev reads *_draft; prod reads the live cols.
alter table public.site_sections add column if not exists enabled_draft boolean;
update public.site_sections set enabled_draft = enabled where enabled_draft is null;

alter table public.content_flags add column if not exists published_draft boolean;
update public.content_flags set published_draft = published where published_draft is null;
