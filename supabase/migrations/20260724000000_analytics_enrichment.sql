-- Richer first-party analytics. No third-party tool involved: everything here
-- is written by our own /api/track route using the service_role key, and read
-- only by the local admin dashboard.
--
-- What changes vs. the previous setup:
--   • page_views gains geo (from Vercel's edge headers), device/browser,
--     session, campaign and engagement columns.
--   • a new `events` table records clicks — outbound links, CTAs, downloads.
--
-- This file is purely additive, so it is safe to apply while the previously
-- deployed site is still running against the old code. Revoking anon's write
-- access to page_views is deliberately held back to the follow-up migration
-- (20260724010000), which must only run once this branch is deployed.
--
-- Safe to run repeatedly (idempotent).

-- ── page_views: new dimensions ───────────────────────────────────────
alter table public.page_views
  add column if not exists session_id    text,     -- one browsing session (30 min idle window)
  add column if not exists country       text,     -- ISO-2, e.g. 'IN'
  add column if not exists region        text,     -- e.g. 'TN'
  add column if not exists city          text,
  add column if not exists timezone      text,
  add column if not exists device        text,     -- mobile | tablet | desktop | bot
  add column if not exists os            text,
  add column if not exists browser       text,
  add column if not exists referrer_host text,     -- 'linkedin.com', not the full URL
  add column if not exists utm_source    text,
  add column if not exists utm_medium    text,
  add column if not exists utm_campaign  text,
  add column if not exists duration_ms   integer,  -- filled in by the unload beacon
  add column if not exists max_scroll    smallint; -- furthest scroll depth, 0-100

-- ── events: clicks and other interactions ────────────────────────────
create table if not exists public.events (
  id          bigint generated always as identity primary key,
  name        text not null,   -- 'outbound' | 'download' | 'cta' | 'internal' | 'scroll'
  path        text,            -- page the interaction happened on
  slug        text,
  label       text,            -- human label, e.g. 'GitHub' or 'My resume'
  href        text,            -- destination, for link clicks
  visitor_id  text,
  session_id  text,
  country     text,
  device      text,
  props       jsonb,           -- anything extra, free-form
  created_at  timestamptz not null default now()
);

alter table public.events enable row level security;
-- Deliberately NO policies: with RLS on and no policy, anon can neither read
-- nor write. Only the service_role key (server-side) touches this table.

-- ── Indexes for the dashboard's aggregations ─────────────────────────
create index if not exists page_views_created_idx on public.page_views (created_at desc);
create index if not exists page_views_session_idx on public.page_views (session_id);
create index if not exists page_views_country_idx on public.page_views (country);

create index if not exists events_created_idx     on public.events (created_at desc);
create index if not exists events_name_idx        on public.events (name);
create index if not exists events_visitor_idx     on public.events (visitor_id);
