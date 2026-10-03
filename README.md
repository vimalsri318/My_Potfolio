Here is my Portfolio -> https://vimalsrinivasan.netlify.app/

## How this site grows

All content lives in the `data/` directory — components and pages just render it.
To add or change content, edit the data files; no component changes needed.

| What | Edit | Shows up at |
| --- | --- | --- |
| Projects | `/admin` or `data/projects.json` | Work catalogue + `/projects/<slug>` detail page |
| Services | `data/services.js` | Services offers + contact form options |
| Courses / products | `data/courses.js` | `/courses` |

### Adding a project

Projects live in Supabase (drafts locally, published copy in production) with
`data/projects.json` as the committed fallback. Add one in `/admin`, or add an
entry to `data/projects.json` and stage it as a draft:

```bash
node scripts/stage_projects.js <slug>      # draft only — nothing goes live
```

Then review it locally and press **Publish** in `/admin`. Every project gets a
case-study page at `/projects/<slug>` (rendered by `components/ProjectDetail.js`)
and a card in the Work catalogue. Catalogue fields:

| Field | What it does |
| --- | --- |
| `kind` | Filter group: `ai`, `saas`, `commerce`, `apps` (labels in `data/catalogue.js`) |
| `status` | Badge on the card — `Live`, `Client build`, `Open source`, … |
| `tagline` | One line under the title |
| `accent` | Hex colour for the status dot and glows |
| `cover` | 16:10 card image (falls back to `image`) |
| `video` | 5-second motion clip, played on hover and as the case-study hero |

Covers, clips and the showreel are rendered from `video/` — see
[video/README.md](video/README.md).

### Services and the contact form

`data/services.js` holds the offers in the Services section: deliverables, the
projects that prove each one (`proof` slugs), and an optional `startingAt`
price. "Request this" and "Build me one like this" pre-select the matching
option in the contact form, and the choice is prepended to the message as
`Interested in: …`.

### Launching a course

In `data/courses.js`, set `available: true` and fill in `link` — the card on
`/courses` switches from "Coming soon" to "Enroll now".

### Adding a whole new section (e.g. blog, products)

Follow the same pattern: create `data/<section>.js`, a page under `pages/<section>/`,
and reuse the existing components/styles (`.card`, `.project-detail__*`, `Reveal`).
