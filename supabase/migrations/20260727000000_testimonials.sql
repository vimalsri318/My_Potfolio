-- Testimonials table for client recommendations & reviews.
--
-- Flow:
-- 1. Clients fill out a form at /testimonial (public).
--    Anon role inserts a row with status = 'pending'.
-- 2. Admin reviews incoming testimonials in /admin -> "Testimonials" tab.
--    Admin can approve (status = 'approved'), edit, feature, or delete.
-- 3. Public site reads only approved testimonials for display on the portfolio.

create table if not exists public.testimonials (
  id            bigint generated always as identity primary key,
  name          text not null,
  role          text,                      -- e.g. 'CEO & Founder', 'Lead AI Engineer'
  company       text,                      -- e.g. 'Acme Corp', 'NextGen AI'
  avatar_url    text,                      -- image URL or Cloudinary URL
  content       text not null,             -- recommendation / testimonial text
  rating        int not null default 5 check (rating >= 1 and rating <= 5),
  project_name  text,                      -- e.g. 'AI Chatbot', 'Portfolio Redesign'
  linkedin_url  text,                      -- optional verification link
  status        text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  is_featured   boolean not null default false,
  sort          int not null default 0,
  created_at    timestamptz not null default now()
);

alter table public.testimonials enable row level security;

-- Public can submit new testimonials with status forced to 'pending'.
drop policy if exists "anon insert testimonials" on public.testimonials;
create policy "anon insert testimonials"
  on public.testimonials for insert to anon
  with check (status = 'pending');

-- Public can only view approved testimonials.
drop policy if exists "anon select approved testimonials" on public.testimonials;
create policy "anon select approved testimonials"
  on public.testimonials for select to anon
  using (status = 'approved');

-- Register 'testimonials' in site_sections so it can be toggled on/off from the admin.
insert into public.site_sections (key, label, enabled, sort)
values ('testimonials', 'Testimonials', true, 6)
on conflict (key) do nothing;
