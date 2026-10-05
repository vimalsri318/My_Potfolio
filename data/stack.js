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
  awslambda: { name: 'AWS Lambda', group: 'backend', icon: null, color: '#FF9900', mono: 'λ' },
  gemini: { name: 'Google Gemini', group: 'ai', icon: 'googlegemini' },
  groq: { name: 'Groq', group: 'ai', icon: null, color: '#F55036', mono: 'G' },
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
  azure: { name: 'Azure Static Web Apps', group: 'infra', icon: null, color: '#0078D4', mono: 'Az' },
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
