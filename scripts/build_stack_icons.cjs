// Copy the brand logos data/stack.js uses out of simple-icons (a dev
// dependency, CC0) into data/stack-icons.json, so the site ships only the
// handful of SVG paths it shows.
//
//   node scripts/build_stack_icons.cjs
const fs = require('fs')
const path = require('path')
const si = require('simple-icons')

;(async () => {
  const { STACK, PLATFORMS } = await import('../data/stack.js')
  const slugs = new Set([...Object.values(STACK), ...Object.values(PLATFORMS)].map((x) => x.icon).filter(Boolean))
  const out = {}
  for (const slug of [...slugs].sort()) {
    const icon = si[`si${slug.charAt(0).toUpperCase()}${slug.slice(1)}`]
    if (!icon) {
      console.warn(`✗ ${slug}: not in simple-icons`)
      continue
    }
    out[slug] = { title: icon.title, hex: `#${icon.hex}`, path: icon.path }
  }
  fs.writeFileSync(path.join(__dirname, '../data/stack-icons.json'), JSON.stringify(out) + '\n')
  console.log(`✓ ${Object.keys(out).length} icons → data/stack-icons.json`)
})()
