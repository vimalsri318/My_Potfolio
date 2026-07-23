# Context Window — interactive explainer

Source for the interactive walkthrough embedded on the research page
`/research/why-ai-repaints-your-image`.

It's a standalone Vite + React app. It is NOT built by the portfolio's
Next.js build — it ships as pre-built static files in
`public/research/context-window/`.

## To change the explainer and re-publish it

From this folder (`interactive/context-window/`):

```bash
npm install          # first time only
npm run build -- --base=./
```

Then copy the fresh build into the portfolio's public folder (run from the
repo root):

```bash
rm -rf public/research/context-window/*
cp -R interactive/context-window/dist/. public/research/context-window/
```

Commit both the source change and the updated `public/research/context-window/`
files. `--base=./` is important — it keeps asset paths relative so the app
works inside the embed.
