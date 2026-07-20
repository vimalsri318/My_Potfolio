Here is my Portfolio -> https://vimalsrinivasan.netlify.app/

## How this site grows

All content lives in the `data/` directory — components and pages just render it.
To add or change content, edit the data files; no component changes needed.

| What | Edit | Shows up at |
| --- | --- | --- |
| Projects | `data/projects.js` | Home projects list + `/projects/<slug>` detail page |
| Services | `data/services.js` | Home services section |
| Courses / products | `data/courses.js` | `/courses` |

### Adding a project

Add an entry to `data/projects.js` with a unique `slug`. It automatically appears
in the Projects section and gets its own statically-generated case-study page at
`/projects/<slug>` (rendered by the reusable `components/ProjectDetail.js`).
Add extra screenshots to the `gallery` array to show a gallery on the detail page.

### Launching a course

In `data/courses.js`, set `available: true` and fill in `link` — the card on
`/courses` switches from "Coming soon" to "Enroll now".

### Adding a whole new section (e.g. blog, products)

Follow the same pattern: create `data/<section>.js`, a page under `pages/<section>/`,
and reuse the existing components/styles (`.card`, `.project-detail__*`, `Reveal`).
