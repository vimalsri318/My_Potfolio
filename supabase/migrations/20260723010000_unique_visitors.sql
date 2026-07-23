-- Unique-visitor analytics + one-like-per-visitor.
-- Safe to run repeatedly (idempotent). Applied on 2026-07-23.

-- A stable per-browser token, set client-side, stored on each row.
alter table public.page_views add column if not exists visitor_id text;
alter table public.likes      add column if not exists visitor_id text;

-- One like per visitor per path. NULLs are treated as distinct, so any
-- legacy like rows without a visitor_id are unaffected; every new like
-- carries a visitor_id and is therefore de-duplicated by this index.
create unique index if not exists likes_visitor_path_uniq
  on public.likes (visitor_id, path);

-- Helpful for the admin's per-page aggregation.
create index if not exists page_views_visitor_idx on public.page_views (visitor_id);
create index if not exists page_views_path_idx    on public.page_views (path);

-- NOTE: the existing page_views rows (inflated by dev/testing and with no
-- visitor_id) are cleared as a one-time step outside this migration:
--   truncate table public.page_views;
