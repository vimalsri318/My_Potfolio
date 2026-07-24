-- Instant-live visibility toggles. Section on/off and per-item published
-- state live here so the admin can flip them without a git push; public
-- pages read them (anon SELECT) via ISR. Writes are service_role only
-- (the local admin). Idempotent.

create table if not exists public.site_sections (
  key     text primary key,
  label   text,
  enabled boolean not null default true,
  sort    int not null default 0
);

create table if not exists public.content_flags (
  id        bigint generated always as identity primary key,
  type      text not null,           -- 'project' | 'research'
  slug      text not null,
  published boolean not null default true,
  unique (type, slug)
);

alter table public.site_sections enable row level security;
alter table public.content_flags enable row level security;

-- The public site must READ visibility; nobody but the owner (service_role) writes it.
drop policy if exists "anon read sections" on public.site_sections;
create policy "anon read sections" on public.site_sections for select to anon using (true);

drop policy if exists "anon read flags" on public.content_flags;
create policy "anon read flags" on public.content_flags for select to anon using (true);

-- Seed the section switches (matches the current site: coming-soon on).
insert into public.site_sections (key, label, enabled, sort) values
  ('coming_soon', 'Coming-soon mode', true,  0),
  ('about',       'About',            true,  1),
  ('projects',    'Projects',         true,  2),
  ('services',    'Services',         true,  3),
  ('experience',  'Experience',       true,  4),
  ('contact',     'Contact',          true,  5)
on conflict (key) do nothing;
