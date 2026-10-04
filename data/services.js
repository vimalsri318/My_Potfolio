// What clients can hire me for. Each offer links to the projects that prove
// it (`proof` = project slugs; hidden or missing slugs are skipped).
//
// `startingAt` is optional — set it (e.g. '₹40,000' or '$800') to show a
// "From …" price on the card; leave it null to show "Custom quote".

const services = [
  {
    id: 'ai-assistants',
    kicker: 'Chatbots that know your business',
    title: 'AI assistants & chatbots',
    description:
      'Assistants grounded in your own content that answer customers, qualify leads and hand off to a human — on your site or WhatsApp.',
    deliverables: [
      'Chat widget or WhatsApp bot',
      'Answers from your docs, FAQs and catalogue',
      'Leads synced to Sheets or your CRM',
    ],
    proof: ['amretri-healthcare', 'wassupos'],
    startingAt: null,
  },
  {
    id: 'ai-agents',
    kicker: 'Work that runs while you sleep',
    title: 'AI agents & automation',
    description:
      'Agents that research leads, join meetings and write the minutes, call customers, or move data between the tools you already use.',
    deliverables: [
      'Sourcing, meeting and calling agents',
      'Workflow automation across your tools',
      'Readable traces of what the agent did',
    ],
    proof: ['buziness-os', 'email-finder', 'slate'],
    startingAt: null,
  },
  {
    id: 'saas',
    kicker: 'From idea to paying users',
    title: 'SaaS platforms & dashboards',
    description:
      'Multi-user products with logins, roles, payments and admin consoles — built to be secure from the database up.',
    deliverables: [
      'Auth, roles and multi-tenant data',
      'Admin console and analytics',
      'Payments and subscriptions',
    ],
    proof: ['influnet', 'casa-harmony', 'tecstellar-command-center'],
    startingAt: null,
  },
  {
    id: 'commerce',
    kicker: 'Stores that feel premium',
    title: 'E-commerce stores',
    description:
      'Headless stores with fast browsing, a real cart and checkout, online payments and a CMS your team can run without a developer.',
    deliverables: [
      'Catalogue, cart and checkout',
      'Payments, orders and accounts',
      'Homepage CMS for offers and banners',
    ],
    proof: ['mithra-whole-foods'],
    startingAt: null,
  },
  {
    id: 'websites',
    kicker: 'Look like the company you are',
    title: 'Business websites',
    description:
      'Multi-page company sites that load fast, rank, and capture leads — with in-place editing so you can change copy and images yourself.',
    deliverables: [
      'Design and build, mobile-first',
      'Lead capture to email, Sheets or WhatsApp',
      'Edit text and images on the page',
    ],
    proof: ['jaisathya', 'amretri-healthcare'],
    startingAt: null,
  },
  {
    id: 'apps',
    kicker: 'In their pocket, on their desk',
    title: 'Mobile & desktop apps',
    description:
      'Android, iOS and desktop apps from one codebase where it makes sense — with offline-friendly logic and notifications that land.',
    deliverables: [
      'React Native / Expo apps',
      'macOS and cross-platform desktop tools',
      'Play Store and App Store release',
    ],
    proof: ['influnet', 'black-hole', 'ardor'],
    startingAt: null,
  },
]

// Shown in the contact card under "What happens next".
export const steps = [
  'Tell me what you want to build — a few lines is enough.',
  'I reply with questions, a plan and a quote.',
  'We build it with working demos along the way.',
]

export default services
