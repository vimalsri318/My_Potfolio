// Single source of truth for all project content.
// Add a new project here and it automatically appears in the
// Projects section AND gets its own detail page at /projects/<slug>.

const projects = [
  {
    id: 1,
    slug: 'dmart-analysis',
    title: 'D-MART Analysis',
    category: 'Data analysis & Web app',
    year: '2024',
    role: 'Full-stack Developer & Data Analyst',
    image: '/assets/img/ANALYSIS.png',
    gallery: [],
    link: 'https://ltqapcfmatgt2.mocha.app/',
    tech: ['Python', 'React', 'Data Visualization'],
    summary:
      'An interactive data-analysis web app that turns raw D-MART retail data into clear, explorable insights.',
    description: [
      'D-MART Analysis takes large retail datasets and transforms them into an interactive dashboard where trends, sales patterns and category performance can be explored visually.',
      'The goal was to make data approachable — anyone, not just analysts, should be able to open the app and understand what the numbers are saying.',
    ],
    highlights: [
      'Interactive charts and drill-down views',
      'Clean, responsive dashboard UI',
      'Automated data processing pipeline',
    ],
  },
  {
    id: 2,
    slug: 'carspace',
    title: 'Carspace',
    category: 'E-commerce & Hybrid Web app',
    year: '2024',
    role: 'Full-stack Developer',
    image: '/assets/img/Carspace.png',
    gallery: [],
    link: 'https://secondhandcarapp.web.app/',
    tech: ['React', 'Firebase', 'PWA'],
    summary:
      'A hybrid e-commerce platform for buying and selling second-hand cars, built for speed and trust.',
    description: [
      'Carspace connects buyers and sellers of used cars through a clean, app-like web experience. Listings, search and filtering are designed to feel instant.',
      'Built as a hybrid web app so it works seamlessly across desktop and mobile without a separate native build.',
    ],
    highlights: [
      'Real-time listings backed by Firebase',
      'Advanced search and filtering',
      'Installable, app-like mobile experience',
    ],
  },
  {
    id: 3,
    slug: 'd7-sports',
    title: 'D7 Sports',
    category: 'VR & Motion Graphics',
    year: '2023',
    role: 'VR Developer & Motion Designer',
    image: '/assets/img/D7.png',
    gallery: [],
    link: 'https://drive.google.com/file/d/18_hxmycJTo6qIy9MebsEbzJyGbl6s_Tz/view?usp=sharing',
    tech: ['Unity', 'VR', 'Motion Graphics'],
    summary:
      'An immersive VR sports experience combined with high-energy motion graphics.',
    description: [
      'D7 Sports explores how virtual reality can change the way we experience sport — putting the viewer inside the action instead of in front of a screen.',
      'The project pairs immersive VR scenes with motion-graphic sequences designed to keep the energy of live sport intact.',
    ],
    highlights: [
      'Immersive VR environments built in Unity',
      'Custom motion-graphics sequences',
      'Optimised for smooth headset performance',
    ],
  },
  {
    id: 4,
    slug: 'interior-design-prototype',
    title: 'Interior Design Prototype',
    category: '3D Web & Interactive prototype',
    year: '2023',
    role: '3D Web Developer & Designer',
    image: '/assets/img/White and Brown Minimalist Interior Desktop Prototype.gif',
    gallery: [],
    link: '',
    tech: ['Three.js', '3D Web', 'Prototyping'],
    summary:
      'An interactive 3D prototype that lets users walk through and customise interior spaces in the browser.',
    description: [
      'This prototype brings interior design into the browser — users can explore a minimalist space in 3D and see how materials and layouts change the feel of a room.',
      'It was built to test how far interactive 3D can go on the web without plugins or downloads.',
    ],
    highlights: [
      'Real-time 3D rendering in the browser',
      'Interactive material and layout switching',
      'Minimalist, design-first presentation',
    ],
  },
  {
    id: 5,
    slug: 'ar-mart',
    title: 'AR Mart',
    category: 'Immersive Web & AR mockups',
    year: '2023',
    role: 'AR Developer & Designer',
    image: '/assets/img/AR_Mart.png',
    gallery: [],
    link: '',
    tech: ['AR.js', 'WebAR', 'UI Design'],
    summary:
      'Augmented-reality shopping mockups that bring products into the customer’s own space.',
    description: [
      'AR Mart imagines retail without shelves — products appear in the customer’s room through their phone camera, at real scale, before they buy.',
      'The mockups explore the full journey: discovery, AR preview, and purchase, all inside an immersive web experience.',
    ],
    highlights: [
      'Web-based AR — no app install needed',
      'True-to-scale product previews',
      'End-to-end shopping journey mockups',
    ],
  },
  {
    id: 6,
    slug: 'pricepulse',
    title: 'PricePulse',
    category: 'Web application & design',
    year: '2024',
    role: 'Full-stack Developer',
    image: '/assets/img/Comapre_website.png',
    gallery: [],
    link: '',
    tech: ['React', 'Node.js', 'Web Scraping'],
    summary:
      'A price-comparison web app that tracks products across stores so users always buy at the right moment.',
    description: [
      'PricePulse watches product prices across multiple stores and surfaces the best time and place to buy.',
      'The interface is intentionally simple: search a product, see its price history and current best deal at a glance.',
    ],
    highlights: [
      'Multi-store price comparison',
      'Price-history tracking',
      'Clean, decision-first UI',
    ],
  },
  {
    id: 7,
    slug: 'namwear-tshirt-design',
    title: 'Namwear T-shirt Design',
    category: 'Merchandising & Branding',
    year: '2024',
    role: 'Brand & Merchandise Designer',
    image: '/assets/img/namwear-design.png',
    gallery: [],
    link: 'https://www.figma.com/proto/TX6zJj6Lz5934ZjVsanK5M/vs?page-id=0%3A1&node-id=984-372&viewport=-20038%2C-5262%2C0.31&t=zYGrmhAeN2Xhj9fw-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=1004%3A291&show-proto-sidebar=1',
    tech: ['Figma', 'Branding', 'Merchandise'],
    summary:
      'Merchandise and branding design for Namwear — apparel that carries the brand’s identity.',
    description: [
      'A merchandising project for Namwear covering T-shirt designs and the brand language around them.',
      'The designs balance streetwear energy with a consistent brand identity, prototyped end-to-end in Figma.',
    ],
    highlights: [
      'Complete T-shirt design collection',
      'Consistent brand language across pieces',
      'Interactive Figma prototype presentation',
    ],
  },
]

export default projects

export function getProjectBySlug(slug) {
  return projects.find((p) => p.slug === slug) || null
}

export function getNextProject(slug) {
  const index = projects.findIndex((p) => p.slug === slug)
  if (index === -1) return null
  return projects[(index + 1) % projects.length]
}
