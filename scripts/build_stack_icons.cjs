// Copy the brand logos data/stack.js uses out of simple-icons (a dev
// dependency, CC0) into data/stack-icons.json, so the site ships only the
// handful of SVG paths it shows.
//
//   node scripts/build_stack_icons.cjs
const fs = require('fs')
const path = require('path')
const si = require('simple-icons')

// Marks simple-icons used to ship and has since dropped from its set
// (OpenAI, Microsoft Azure, C#). Kept here, lifted verbatim out of
// simple-icons 11.0.0 — same CC0 licence — so well-known brands don't
// degrade to a lettered badge. See scripts/stack-icons.legacy.json.
const legacy = require('./stack-icons.legacy.json')

;(async () => {
  const { STACK, PLATFORMS } = await import('../data/stack.js')
  const slugs = new Set([...Object.values(STACK), ...Object.values(PLATFORMS)].map((x) => x.icon).filter(Boolean))
  const out = {}
  const fromLegacy = []
  for (const slug of [...slugs].sort()) {
    const icon = si[`si${slug.charAt(0).toUpperCase()}${slug.slice(1)}`]
    if (!icon) {
      if (legacy[slug]) {
        out[slug] = legacy[slug]
        fromLegacy.push(slug)
        continue
      }
      console.warn(`✗ ${slug}: not in simple-icons and not in stack-icons.legacy.json`)
      continue
    }
    out[slug] = { title: icon.title, hex: `#${icon.hex}`, path: icon.path }
  }
  if (fromLegacy.length) console.log(`· ${fromLegacy.join(', ')} from stack-icons.legacy.json`)
  fs.writeFileSync(path.join(__dirname, '../data/stack-icons.json'), JSON.stringify(out) + '\n')
  console.log(`✓ ${Object.keys(out).length} icons → data/stack-icons.json`)
})()
