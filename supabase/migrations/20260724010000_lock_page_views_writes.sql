-- ⚠ RUN THIS ONLY AFTER the branch with /api/track is deployed to Vercel.
--
-- Page views are now written server-side by /api/track using the service_role
-- key, so the browser has no reason to hold INSERT rights on page_views any
-- more. Dropping this policy means the public anon key — which ships in the
-- client bundle and is readable by anyone — can no longer be used to flood the
-- table with fake traffic.
--
-- Applying this while the OLD client code is still live would silently stop
-- page views being recorded, which is why it's split out of the migration that
-- adds the columns.
--
-- `likes` and `feedback` deliberately keep their anon INSERT policies: those
-- are still written straight from the browser, and the unique index on
-- (visitor_id, path) already caps what a single visitor can do to likes.

drop policy if exists "anon insert page_views" on public.page_views;
