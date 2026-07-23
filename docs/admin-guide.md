# Local Admin — Studio

Your content backend. It runs **only on your machine**, edits the JSON files in
`data/`, and you publish with `git push`. Nothing admin-related ships to the live
Netlify site.

---

## How it works (the one-paragraph version)

Projects and research live in `data/projects.json` and `data/research.json` — that's
the single source of truth the public site reads. The admin at `/admin` is a set of
localhost-only pages + API routes that read and write those files (and drop images into
`public/assets/` and interactive apps into `public/research/<slug>/`). In a production
build the admin **404s** and its API routes don't exist, so there's no admin surface on
the internet. Supabase is used only for the dynamic stuff — analytics, likes, feedback.

```
/admin  ──edits──▶  data/*.json + public/…   ──git push──▶  Netlify rebuilds  ──▶  live site
(local only)        (the real content)                       (reads the JSON at build)
```

---

## Running it

```bash
npm run dev
```

Open **http://localhost:3000/admin**. Three tabs:

- **Projects** — list → click *Edit* (or *New project*) → full editor.
- **Research** — same, plus the article **block editor** and the **interactive uploader**.
- **Analytics** — views, likes and feedback (only populated once Supabase is set up; the
  rest of the admin works without it).

When you're done, stop the server (`Ctrl-C`). The admin is gone until you run it again.

---

## Editing a project

Every field the project page renders is here: title, slug, category, year, role, live
link, summary, hero image, tech, overview paragraphs, highlights and gallery.

- **Hero / gallery images** — click *Upload image*; the file is copied into
  `public/assets/img/` and the path is filled in for you. You can also paste a path or a
  full URL.
- **Overview** is a list of paragraphs — each row is one `<p>`. Use ↑ ↓ to reorder.
- **Save project** writes `data/projects.json`. Hit **Preview ↗** to open the live page.

## Writing a research post

Same top fields (title, slug, topic, date, reading time, tags, summary, cover), then:

### The article body (block editor)
Add blocks in any order — **Paragraph, Heading, List, Quote, Code, Image**. Each block
can be moved up/down or removed. This maps exactly to what the post renders.

### The interactive walkthrough (optional)
This is the "sometimes there's an HTML app" case. Two ways to attach one:

1. **Upload a `.zip`** of a built app (e.g. the `dist/` of your Vite build). It's
   unpacked into `public/research/<slug>/` and `interactive.src` is set for you. The zip
   just needs `index.html` at its root (a single wrapping folder like `dist/` is fine).
2. **Upload a single `.html`** file — saved as `public/research/<slug>/index.html`.

> Set the **slug first** — the app is stored under that slug's folder.

Leave the interactive section empty for a text-only post; the page simply won't show a
walkthrough.

---

## Publishing

The admin only changes files on your laptop. To put changes live:

```bash
git add -A
git commit -m "content: update projects/research"
git push
```

Netlify rebuilds and reads the JSON at build time. (Because it's a static build, changes
appear after the push/redeploy — not instantly like the local preview.)

---

## Notes

- **Never runs in production.** `lib/adminGuard.js` 404s every admin API route when
  `NODE_ENV=production`, and `/admin` itself returns `notFound`. Confirmed in the build:
  content pages are static (SSG), admin + API are the only dynamic routes and are guarded.
- **Secrets.** `.env` (Supabase keys) is gitignored — it never deploys. Only
  `NEXT_PUBLIC_SUPABASE_URL` and the anon key belong in Netlify's env; never the
  service-role key.
- **Want the admin on your phone?** Run `npm run dev`, then expose it with ngrok. Not
  needed for laptop use.
