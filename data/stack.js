// What a project was built for (platforms, in plain words for clients) and
// what it was built with (the tech stack, shown as logos with names on hover).
//
// Projects reference these by key: `platforms: ['web', 'ios', …]` (or
// `{ key, label, note }` to reword one) and `stack: ['nextjs', 'supabase', …]`.
// `icon` is a Simple Icons slug; scripts/build_stack_icons.cjs copies the
// used ones into data/stack-icons.json. No icon → a lettered badge in `color`.

export const PLATFORMS = {
  web: { label: 'Web app', note: 'Runs in the browser, on desktop and phone', icon: null },
  ios: { label: 'iOS app', note: 'Native iPhone app', icon: 'apple' },
  android: { label: 'Android app', note: 'Native Android app', icon: 'android' },
  mac: { label: 'Mac app', note: 'Desktop app for macOS', icon: 'macos' },
  whatsapp: { label: 'In WhatsApp', note: 'Customers use it from WhatsApp', icon: 'whatsapp' },
  npm: { label: 'npm package', note: 'Install with npm', icon: 'npm' },
  cli: { label: 'Command line', note: 'A terminal tool', icon: null },
}

// group: where it sits in the case study's stack section.
export const GROUPS = [
  ['app', 'App'],
  ['backend', 'Backend & data'],
  ['ai', 'AI'],
  ['services', 'Services'],
  ['infra', 'Hosting, domain & DNS'],
  ['tooling', 'Tooling'],
]

export const STACK = {
  nextjs: { name: 'Next.js', group: 'app', icon: 'nextdotjs' },
  react: { name: 'React', group: 'app', icon: 'react' },
  reactnative: { name: 'React Native', group: 'app', icon: 'react' },
  expo: { name: 'Expo', group: 'app', icon: 'expo' },
  typescript: { name: 'TypeScript', group: 'app', icon: 'typescript' },
  tailwind: { name: 'Tailwind CSS', group: 'app', icon: 'tailwindcss' },
  tanstack: { name: 'TanStack Start', group: 'app', icon: 'tanstack' },
  vite: { name: 'Vite', group: 'app', icon: 'vite' },
  d3: { name: 'D3', group: 'app', icon: 'd3' },
  tauri: { name: 'Tauri', group: 'app', icon: 'tauri' },
  rust: { name: 'Rust', group: 'backend', icon: 'rust' },
  nodejs: { name: 'Node.js', group: 'backend', icon: 'nodedotjs' },
  python: { name: 'Python', group: 'backend', icon: 'python' },
  fastapi: { name: 'FastAPI', group: 'backend', icon: 'fastapi' },
  sqlalchemy: { name: 'SQLAlchemy', group: 'backend', icon: 'sqlalchemy' },
  medusa: { name: 'Medusa', group: 'backend', icon: 'medusa' },
  supabase: { name: 'Supabase', group: 'backend', icon: 'supabase' },
  neon: { name: 'Neon Postgres', group: 'backend', icon: 'neon' },
  postgres: { name: 'PostgreSQL', group: 'backend', icon: 'postgresql' },
  sqlite: { name: 'SQLite', group: 'backend', icon: 'sqlite' },
  firebase: { name: 'Firebase', group: 'backend', icon: 'firebase' },
  prisma: { name: 'Prisma', group: 'backend', icon: 'prisma' },
  drizzle: { name: 'Drizzle ORM', group: 'backend', icon: 'drizzle' },
  googlesheets: { name: 'Google Sheets', group: 'backend', icon: 'googlesheets' },
  appsscript: { name: 'Google Apps Script', group: 'backend', icon: 'googleappsscript' },
  awslambda: { name: 'AWS Lambda', group: 'backend', icon: 'awslambda' },
  gemini: { name: 'Google Gemini', group: 'ai', icon: 'googlegemini' },
  groq: { name: 'Groq', group: 'ai', icon: null, color: '#F55036', mono: 'G' },
  sarvam: { name: 'Sarvam AI', group: 'ai', icon: 'sarvam' },
  pipecat: { name: 'Pipecat', group: 'ai', icon: 'pipecat' },
  stripe: { name: 'Stripe', group: 'services', icon: 'stripe' },
  razorpay: { name: 'Razorpay', group: 'services', icon: 'razorpay' },
  streamchat: { name: 'Stream Chat', group: 'services', icon: null, color: '#005FFF', mono: 'S' },
  resend: { name: 'Resend', group: 'services', icon: 'resend' },
  whatsappapi: { name: 'WhatsApp Cloud API', group: 'services', icon: 'whatsapp' },
  cloudinary: { name: 'Cloudinary (media storage)', group: 'services', icon: 'cloudinary' },
  sentry: { name: 'Sentry', group: 'services', icon: 'sentry' },
  telecmi: { name: 'TeleCMI (calling)', group: 'services', icon: null, color: '#1F6FEB', mono: 'T' },
  meetingbaas: { name: 'Meeting BaaS', group: 'services', icon: null, color: '#5B5BD6', mono: 'M' },
  githubapi: { name: 'GitHub API', group: 'services', icon: 'github' },
  azure: { name: 'Azure Static Web Apps', group: 'infra', icon: 'microsoftazure' },
  vercel: { name: 'Vercel', group: 'infra', icon: 'vercel' },
  railway: { name: 'Railway', group: 'infra', icon: 'railway' },
  firebasehosting: { name: 'Firebase Hosting', group: 'infra', icon: 'firebase' },
  hostinger: { name: 'Hostinger (hosting & DNS)', group: 'infra', icon: 'hostinger' },
  cloudflare: { name: 'Cloudflare DNS', group: 'infra', icon: 'cloudflare' },
  godaddy: { name: 'GoDaddy (domain & DNS)', group: 'infra', icon: 'godaddy' },
  bigrock: { name: 'BigRock (domain & DNS)', group: 'infra', icon: null, color: '#E4572E', mono: 'B' },
  docker: { name: 'Docker', group: 'infra', icon: 'docker' },
  npm: { name: 'npm registry', group: 'infra', icon: 'npm' },
  turborepo: { name: 'Turborepo', group: 'tooling', icon: 'turborepo' },
  pnpm: { name: 'pnpm', group: 'tooling', icon: 'pnpm' },
  vitest: { name: 'Vitest', group: 'tooling', icon: 'vitest' },
  jest: { name: 'Jest', group: 'tooling', icon: 'jest' },
  eas: { name: 'EAS Build', group: 'tooling', icon: 'expo' },
  githubactions: { name: 'GitHub Actions', group: 'tooling', icon: 'githubactions' },
  // Entries below exist so the plain-text `tech` lists older projects carry
  // ("Three.js", "Unity 3D", "Pandas & NumPy", …) also resolve to a logo.
  javascript: { name: 'JavaScript', group: 'app', icon: 'javascript' },
  threejs: { name: 'Three.js', group: 'app', icon: 'threedotjs' },
  webgl: { name: 'WebGL', group: 'app', icon: 'webgl' },
  chartjs: { name: 'Chart.js', group: 'app', icon: 'chartdotjs' },
  express: { name: 'Express', group: 'backend', icon: 'express' },
  pandas: { name: 'pandas', group: 'backend', icon: 'pandas' },
  numpy: { name: 'NumPy', group: 'backend', icon: 'numpy' },
  puppeteer: { name: 'Puppeteer', group: 'tooling', icon: 'puppeteer' },
  figma: { name: 'Figma', group: 'tooling', icon: 'figma' },
  blender: { name: 'Blender', group: 'tooling', icon: 'blender' },
  unity: { name: 'Unity', group: 'app', icon: 'unity' },
  csharp: { name: 'C#', group: 'app', icon: 'csharp' },
  alembic: { name: 'Alembic (migrations)', group: 'backend', icon: null, color: '#6C7A89', mono: 'Al' },
  webxr: { name: 'WebXR', group: 'app', icon: null, color: '#4B5EFC', mono: 'XR' },
  gptoss: { name: 'gpt-oss (open-weight LLM)', group: 'ai', icon: 'openai' },
  openai: { name: 'OpenAI', group: 'ai', icon: 'openai' },
  // Platform marks, so a tech list that just says "iOS" or "Android"
  // still gets the real logo.
  ios: { name: 'iOS', group: 'app', icon: 'apple' },
  apple: { name: 'Apple', group: 'app', icon: 'apple' },
  android: { name: 'Android', group: 'app', icon: 'android' },
  swift: { name: 'Swift', group: 'app', icon: 'swift' },
  kotlin: { name: 'Kotlin', group: 'app', icon: 'kotlin' },
  flutter: { name: 'Flutter', group: 'app', icon: 'flutter' },
  webrtc: { name: 'WebRTC', group: 'services', icon: 'webrtc' },
  langchain: { name: 'LangChain', group: 'ai', icon: 'langchain' },
  huggingface: { name: 'Hugging Face', group: 'ai', icon: 'huggingface' },
  anthropic: { name: 'Anthropic Claude', group: 'ai', icon: 'anthropic' },
  ollama: { name: 'Ollama', group: 'ai', icon: 'ollama' },
  pytorch: { name: 'PyTorch', group: 'ai', icon: 'pytorch' },
  tensorflow: { name: 'TensorFlow', group: 'ai', icon: 'tensorflow' },
  sklearn: { name: 'scikit-learn', group: 'ai', icon: 'scikitlearn' },
  mongodb: { name: 'MongoDB', group: 'backend', icon: 'mongodb' },
  redis: { name: 'Redis', group: 'backend', icon: 'redis' },
  googlecloud: { name: 'Google Cloud', group: 'infra', icon: 'googlecloud' },
  netlify: { name: 'Netlify', group: 'infra', icon: 'netlify' },
  unreal: { name: 'Unreal Engine', group: 'app', icon: 'unrealengine' },
}

// ── Names → keys ─────────────────────────────────────────────────────
// Projects are the source of truth and not all of them carry a `stack`
// array of keys: the older ones (and every *published* row in Supabase
// until the new drafts are published) only have `tech`, a list of free
// text like "Next.js 16" or "Pandas & NumPy". Everything that renders a
// stack runs its list through `resolveStack` first, so logos show either
// way and nothing depends on a re-publish.

// Written-out names that don't normalise onto a key or a STACK name.
const ALIASES = {
  gemini: 'gemini',
  googlegemini: 'gemini',
  firebasefirestore: 'firebase',
  firestore: 'firebase',
  cloudfunctions: 'firebase',
  appsscript: 'appsscript',
  googleappsscript: 'appsscript',
  postgres: 'postgres',
  postgresql: 'postgres',
  neon: 'neon',
  neonpostgres: 'neon',
  tailwind: 'tailwind',
  tailwindcss: 'tailwind',
  nextjs: 'nextjs',
  next: 'nextjs',
  nodejs: 'nodejs',
  node: 'nodejs',
  reactnative: 'reactnative',
  tanstack: 'tanstack',
  tanstackstart: 'tanstack',
  easbuild: 'eas',
  expoapplicationservices: 'eas',
  whatsappcloudapi: 'whatsappapi',
  whatsappapi: 'whatsappapi',
  whatsappdeeplinks: 'whatsappapi',
  streamchat: 'streamchat',
  meetingbaas: 'meetingbaas',
  telecmi: 'telecmi',
  githubapi: 'githubapi',
  github: 'githubapi',
  githubactions: 'githubactions',
  awslambda: 'awslambda',
  lambda: 'awslambda',
  drizzle: 'drizzle',
  drizzleorm: 'drizzle',
  sqlalchemy: 'sqlalchemy',
  medusa: 'medusa',
  threejs: 'threejs',
  glsl: 'webgl',
  glslshaders: 'webgl',
  webgl: 'webgl',
  webxr: 'webxr',
  unity: 'unity',
  unity3d: 'unity',
  blender: 'blender',
  blender3d: 'blender',
  chartjs: 'chartjs',
  pandas: 'pandas',
  numpy: 'numpy',
  csharp: 'csharp',
  cs: 'csharp',
  gptoss: 'gptoss',
  sarvam: 'sarvam',
  sarvamai: 'sarvam',
  groqwhisper: 'groq',
  groq: 'groq',
  pipecat: 'pipecat',
  python: 'python',
  npmregistry: 'npm',
  npm: 'npm',
  cloudinary: 'cloudinary',
  hostinger: 'hostinger',
  godaddy: 'godaddy',
  bigrock: 'bigrock',
  azure: 'azure',
  azurestaticwebapps: 'azure',
  firebasehosting: 'firebasehosting',
  pnpmworkspaces: 'pnpm',
  pnpm: 'pnpm',
  turborepo: 'turborepo',
  microsoftazure: 'azure',
  azurestatic: 'azure',
  openai: 'openai',
  openaiapi: 'openai',
  gpt: 'openai',
  gpt4: 'openai',
  gpt4o: 'openai',
  chatgpt: 'openai',
  whisper: 'openai',
  dalle: 'openai',
  claude: 'anthropic',
  anthropic: 'anthropic',
  langchain: 'langchain',
  huggingface: 'huggingface',
  ollama: 'ollama',
  pytorch: 'pytorch',
  torch: 'pytorch',
  tensorflow: 'tensorflow',
  keras: 'tensorflow',
  sklearn: 'sklearn',
  scikitlearn: 'sklearn',
  mongodb: 'mongodb',
  mongo: 'mongodb',
  redis: 'redis',
  googlecloud: 'googlecloud',
  gcp: 'googlecloud',
  netlify: 'netlify',
  ios: 'ios',
  iphone: 'ios',
  apple: 'apple',
  android: 'android',
  swift: 'swift',
  swiftui: 'swift',
  kotlin: 'kotlin',
  flutter: 'flutter',
  dart: 'flutter',
  webrtc: 'webrtc',
  unrealengine: 'unreal',
  unreal: 'unreal',
}

// Keys and written names, normalised: 'Next.js' and 'nextjs' both land on
// the `nextjs` entry.
const squash = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '')
const NAME_INDEX = (() => {
  const index = {}
  for (const [key, def] of Object.entries(STACK)) {
    index[squash(key)] = key
    index[squash(def.name)] = index[squash(def.name)] || key
    // "Cloudinary (media storage)" → also match plain "cloudinary"
    const bare = def.name.replace(/\s*\([^)]*\)\s*/g, ' ').trim()
    if (bare) index[squash(bare)] = index[squash(bare)] || key
  }
  return index
})()

// Drop parentheticals and version noise: "Next.js 16" → "next js",
// "Expo SDK 56" → "expo", "TypeScript (strict)" → "typescript".
const VERSION_NOISE = /^(v?\d[\w.]*|sdk|latest|strict|beta|alpha|rc)$/
function clean(part) {
  return String(part)
    .replace(/\([^)]*\)/g, ' ')
    .toLowerCase()
    .split(/[\s_-]+/)
    .filter((w) => w && !VERSION_NOISE.test(w))
    .join(' ')
    .trim()
}

function lookup(part) {
  const words = clean(part).split(' ').filter(Boolean)
  // Longest prefix wins: "groq whisper" → groq, "node js cli" → nodejs.
  for (let n = words.length; n > 0; n -= 1) {
    const k = squash(words.slice(0, n).join(''))
    if (!k) continue
    if (ALIASES[k] && STACK[ALIASES[k]]) return ALIASES[k]
    if (STACK[k]) return k
    if (NAME_INDEX[k]) return NAME_INDEX[k]
  }
  return null
}

// Turn a project's `stack` (keys) and/or `tech` (free text) into logos.
// Returns { items: [[key, def]], extra: ['Creative Direction', …] } — the
// extras are the human skills/concepts that have no logo and stay as text.
export function resolveStack(...lists) {
  const items = []
  const extra = []
  const seen = new Set()
  const seenExtra = new Set()
  for (const list of lists) {
    if (!Array.isArray(list)) continue
    for (const raw of list) {
      if (!raw) continue
      const label = typeof raw === 'string' ? raw : raw.name || raw.key
      if (!label) continue
      // "Node.js & Express", "Expo / React Native", "pnpm + Turborepo"
      const parts = String(label).split(/\s*(?:&|\+|\/|,| and )\s*/i).filter(Boolean)
      const hits = parts.map(lookup)
      if (hits.some(Boolean)) {
        hits.forEach((key) => {
          if (key && !seen.has(key)) {
            seen.add(key)
            items.push([key, STACK[key]])
          }
        })
      } else if (!seenExtra.has(label)) {
        seenExtra.add(label)
        extra.push(label)
      }
    }
    if (items.length || extra.length) break // first list that resolves wins
  }
  return { items, extra }
}

export const platformOf = (p) => {
  const key = typeof p === 'string' ? p : p?.key
  const base = PLATFORMS[key]
  if (!base) return null
  return { key, ...base, ...(typeof p === 'object' ? p : {}) }
}

// A live link's label: the site's own domain (influnet.io), or the project's
// name when it lives on a host's subdomain (*.up.railway.app, *.vercel.app).
const HOST_SUBDOMAIN = /\.(up\.railway\.app|vercel\.app|netlify\.app|web\.app|onrender\.com)$/
export const linkLabel = (href, title) => {
  try {
    const u = new URL(href)
    if (u.hostname.endsWith('github.com')) return 'Source on GitHub'
    if (u.hostname.endsWith('npmjs.com')) return 'View on npm'
    if (title && HOST_SUBDOMAIN.test(u.hostname)) return `Visit ${title}`
    return `Visit ${u.hostname.replace(/^www\./, '')}`
  } catch {
    return 'Visit project'
  }
}
