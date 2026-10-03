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
| Amretri AMRI product film (16:9, narrated, ~1:54) | `AmretriPromo` (`src/amretri/`) | master in `video/out/` (git-ignored, for social); web copy in `public/assets/video/films/amretri-healthcare.mp4` (project `film` field) |

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

## Amretri product film

`src/amretri/` is a standalone product demo for Amretri Healthcare's AMRI
chatbot and its Google Sheets backend. It uses the Amretri brand tokens, not
the portfolio's. The chat widget is a frame-driven rebuild of
`Amretri-Health-Revamp/src/components/site/ChatBot.tsx`, and the page images in
`public/amretri/` are captured from that site running locally.

Narration is local Kokoro TTS (the same venv as
`Instagram-post-creation/reels`). Every line is synthesised on its own and
measured, and the scenes hold their visuals until each line is due, so the
video always fits the voice. Lines live in `scripts/amretri_vo.py`.

```bash
python3 scripts/amretri_vo.py --samples          # one line in 6 voices → out/voice-samples/
python3 scripts/amretri_vo.py --voice af_heart   # full narration → public/amretri/vo + src/amretri/voiceover.json
npx remotion render src/index.ts AmretriPromo out/amretri-amri-product-demo-voice.mp4 --crf=18
# web copy for the case study (faststart so it streams)
ffmpeg -i out/amretri-amri-product-demo-voice.mp4 -c:v libx264 -preset slow -crf 25 -c:a aac -b:a 128k -movflags +faststart ../public/assets/video/films/amretri-healthcare.mp4
```

The closing scene shows the case-study page (`public/amretri/casestudy.jpg`,
captured from the local portfolio) and its live URL — re-capture it if that
page changes a lot.
