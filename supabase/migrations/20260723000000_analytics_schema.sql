-- Analytics / engagement schema for the portfolio.
-- These are the ONLY things that live in Supabase — the dynamic data written
-- by public visitors. All content (projects, research) lives in the repo as
-- JSON. Safe to run repeatedly (idempotent).
--
-- Security model (Row Level Security):
--   • The public site uses the ANON key and may only INSERT here.
--   • page_views + feedback are NEVER readable by anon — only the local admin,
--     which uses the service_role key (bypasses RLS), can read them.
--   • likes ARE readable by anon, because the like button shows public counts.

-- ── Tables ───────────────────────────────────────────────────────────
create table if not exists public.page_views (
  id         bigint generated always as identity primary key,
  path       text not null,
  slug       text,
  referrer   text,
  created_at timestamptz not null default now()
);

create table if not exists public.feedback (
  id         bigint generated always as identity primary key,
  path       text,
  name       text,
  message    text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.likes (
  id         bigint generated always as identity primary key,
  path       text not null,
  created_at timestamptz not null default now()
);

-- ── Enable RLS ───────────────────────────────────────────────────────
alter table public.page_views enable row level security;
alter table public.feedback   enable row level security;
alter table public.likes      enable row level security;

-- ── Policies: anon may INSERT everywhere ─────────────────────────────
drop policy if exists "anon insert page_views" on public.page_views;
create policy "anon insert page_views"
  on public.page_views for insert to anon with check (true);

drop policy if exists "anon insert feedback" on public.feedback;
create policy "anon insert feedback"
  on public.feedback for insert to anon with check (true);

drop policy if exists "anon insert likes" on public.likes;
create policy "anon insert likes"
  on public.likes for insert to anon with check (true);

-- ── Policy: anon may READ likes only (public counts) ─────────────────
drop policy if exists "anon read likes" on public.likes;
create policy "anon read likes"
  on public.likes for select to anon using (true);

-- Note: no SELECT policy for anon on page_views or feedback, so with RLS on
-- those tables return zero rows to the public — they're admin-only reads.
