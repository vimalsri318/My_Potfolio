# Portfolio video

Remotion source for the motion graphics on the site. It has its own
dependencies (React 19 + Remotion) and is not part of the Next.js build — the
same isolation as `interactive/`.

| Output | Composition | Lands in |
| --- | --- | --- |
| Showreel (16:9) | `Showreel` | `public/assets/video/showreel.mp4` + `-poster.jpg` |
| Showreel (9:16, for Reels/Shorts/LinkedIn) | `ShowreelVertical` | `public/assets/video/showreel-vertical.mp4` |
| Per-project motion clip (5 s loop) | `Clip-<slug>` | `public/assets/video/projects/<slug>.mp4` |
| Catalogue cover (1600×1000) | still of `Clip-<slug>` at frame 140 | `public/assets/img/projects/<slug>/cover.jpg` |

Each project has one animated **stage** (`src/stages/*.tsx`, 1280×800). The
clip is the stage, the cover is its last settled frame, and the showreel cuts
between all stages — so a project only has to be designed once.

## Run

```bash
cd video
npm install
npm run studio          # preview and tweak in Remotion Studio
node render.mjs all     # covers + clips + both showreels → ../public
node render.mjs covers --only=influnet,slate   # just some covers
```

## Add a project

1. Add the case study to the site (admin, or `data/projects.json` +
   `node scripts/stage_projects.js <slug>`), with `cover` and `video` pointing at
   the paths above.
2. Add a stage in `src/stages/` — `shots.tsx` frames a real screenshot
   (`public/shots/`), `platforms.tsx` / `apps.tsx` hold designed mock UIs.
3. Register it in `src/projects.ts` and add the slug to `slugs.json`.
4. `node render.mjs all`.

Screenshots in `public/shots/` were captured from the live sites (or, for TCC,
its local sample-data build) — never from screens with real customer data.

