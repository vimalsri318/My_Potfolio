-- "Let's talk" contact-form submissions. Until now the contact form only
-- emailed via EmailJS, leaving no record for the admin. Store them here too so
-- they show up in the admin Messages tab (EmailJS delivery is kept as well).
--
-- Same security model as feedback: anon may INSERT (the public form), nobody
-- but the owner (service_role, local admin) may read. Idempotent.

create table if not exists public.contact_messages (
  id         bigint generated always as identity primary key,
  name       text,
  email      text,
  message    text not null,
  path       text,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

drop policy if exists "anon insert contact" on public.contact_messages;
create policy "anon insert contact"
  on public.contact_messages for insert to anon with check (true);

-- No SELECT policy for anon: with RLS on, the table returns zero rows to the
-- public. Only the local admin (service_role) can read the messages.
