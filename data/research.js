// Single source of truth for the "Research & Learnings" section.
//
// Add a new entry here and it automatically:
//   • appears in the list at  /research
//   • gets its own shareable page at  /research/<slug>
//
// The `slug` IS the shareable name — e.g. slug: 'rag-chunking'
// becomes  https://yourdomain.app/research/rag-chunking
// Keep it short, lowercase and hyphenated. Never change a slug once
// you've shared the link (it would break the old link).
//
// ── The `body` array is the material itself ────────────────────────
// It's a list of blocks, rendered top-to-bottom. Supported blocks:
//   { type: 'heading',   text: '...' }
//   { type: 'paragraph', text: '...' }
//   { type: 'list',      items: ['...', '...'] }
//   { type: 'image',     src: '/assets/img/...', caption: '...' }   // caption optional
//   { type: 'code',      language: 'python', text: '...' }          // language optional
//   { type: 'quote',     text: '...' }
// Add as many blocks as you like, in any order.
//
// `resources` = external links (source article, the LinkedIn post, etc.)
// `downloads` = files to grab (put PDFs in /public/assets/pdf/)
// Both are optional — leave them as [] if you have none.

const research = [
  {
    id: 2,
    slug: 'why-ai-repaints-your-image',
    title: 'I asked AI to tweak one image. It repainted the whole thing.',
    topic: 'LLMs & Context Windows',
    date: '2026-07-23',
    readingTime: '4 min read',
    tags: ['#AI', '#LLM', '#CONTEXTWINDOW', '#PROMPTENGINEERING'],
    summary:
      'I asked an AI to tweak one image and got back a completely different picture. I went and figured out why — and it is more interesting than "the AI got confused".',
    cover: '/assets/img/research/context-window.svg',
    // The interactive walkthrough shown big at the top of the page.
    // `src` points at the built app served from /public.
    interactive: {
      src: '/research/context-window/index.html',
      title: 'Context window — interactive walkthrough',
    },
    resources: [
      // Paste the LinkedIn post URL here once it's live so readers can jump back:
      // { label: 'Read the original post on LinkedIn', href: 'https://www.linkedin.com/...' },
    ],
    downloads: [],
    body: [
      {
        type: 'paragraph',
        text: 'I asked an AI to tweak one image. It came back with a completely different picture. I went and figured out why — and it is more interesting than "the AI got confused".',
      },
      {
        type: 'paragraph',
        text: 'It turns out that platforms like ChatGPT, Claude and Perplexity do not have real memory. Every time you send a message, the entire conversation gets resent to the model — from scratch. It rereads everything, every single turn, before it replies. That is also why the token count keeps climbing the longer a chat runs.',
      },
      { type: 'heading', text: 'Lost in the middle' },
      {
        type: 'paragraph',
        text: 'Here is the part that actually surprised me. As a conversation grows, the model does not treat every part of it equally. There is a documented behaviour called "lost in the middle" — it pays the most attention to the very start and to whatever is most recent, and quietly deprioritises everything in between.',
      },
      {
        type: 'paragraph',
        text: 'Nothing gets deleted. It is all still there. The model just stops weighing it as strongly. So an instruction from message 4 can be functionally forgotten by message 20 — even though it is technically still sitting in the chat.',
      },
      {
        type: 'quote',
        text: 'Nothing gets deleted. The model just stops weighing it as strongly.',
      },
      { type: 'heading', text: 'Why images get hit even harder' },
      {
        type: 'paragraph',
        text: 'Asking for a "small tweak" is not like Photoshop. There is no file being edited. The model rereads the whole chat, writes a brand-new prompt based on it, and hands that to a completely separate image model — which paints a new image from scratch. Every image is a fresh repaint. Guessed. Every single time.',
      },
      {
        type: 'paragraph',
        text: 'I found this out the hard way making a 3-slide LinkedIn carousel: slide 1 came out perfect, slide 2 had content from slide 1 leaking in, and slide 3 drifted to a completely different theme. Same conversation. Same intent. Three very different results.',
      },
      { type: 'heading', text: 'The takeaway' },
      {
        type: 'paragraph',
        text: 'The interactive walkthrough at the top of this page lets you watch all of this unfold step by step — from the growing transcript, through the "lost in the middle" effect, to the 3-slide case study. Play with it, then come back here.',
      },
      {
        type: 'paragraph',
        text: 'The fix is not a better model — it is understanding how the context window actually works, and restating your key instructions instead of relying on the model to "remember" them.',
      },
    ],
  },
  {
    id: 1,
    slug: 'rag-chunking-strategies',
    title: 'Chunking strategies for production RAG',
    topic: 'Retrieval-Augmented Generation',
    date: '2026-07-18', // ISO date — controls ordering (newest first) and display
    readingTime: '6 min read',
    tags: ['#RAG', '#LLMS', '#VECTORDB'],
    summary:
      'How chunk size, overlap and semantic splitting quietly decide whether your RAG chatbot answers well — and the settings I actually ship.',
    cover: '', // optional hero image, e.g. '/assets/img/rag-chunking.png'
    resources: [
      // { label: 'Original LinkedIn post', href: 'https://www.linkedin.com/...' },
      // { label: 'Source paper', href: 'https://...' },
    ],
    downloads: [
      // { label: 'My notes (PDF)', href: '/assets/pdf/rag-chunking-notes.pdf' },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Everyone tunes the model and the prompt. Far fewer people tune the chunking — and yet it often decides more about answer quality than the model choice does.',
      },
      { type: 'heading', text: 'Why chunk size matters' },
      {
        type: 'paragraph',
        text: 'A chunk is the unit your retriever can return. Too large and you drown the model in irrelevant context; too small and you cut ideas in half so no single chunk is actually useful.',
      },
      {
        type: 'list',
        items: [
          'Start around 500–800 tokens per chunk for prose.',
          'Add 10–15% overlap so ideas that straddle a boundary survive.',
          'Split on structure (headings, paragraphs) before splitting on length.',
        ],
      },
      {
        type: 'quote',
        text: 'Retrieval quality is a data problem before it is a model problem.',
      },
      { type: 'heading', text: 'The settings I ship' },
      {
        type: 'code',
        language: 'python',
        text: `from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=700,
    chunk_overlap=100,
    separators=["\\n\\n", "\\n", ". ", " "],
)
chunks = splitter.split_documents(docs)`,
      },
      {
        type: 'paragraph',
        text: 'This is a starting point, not a law. Measure retrieval hit-rate on your own questions and adjust — the right numbers depend on your documents.',
      },
    ],
  },
]

export default research

// Newest first, for the list page.
export function getAllResearch() {
  return [...research].sort((a, b) => new Date(b.date) - new Date(a.date))
}

export function getResearchBySlug(slug) {
  return research.find((r) => r.slug === slug) || null
}

// "Next read" navigation, following the sorted (newest-first) order.
export function getNextResearch(slug) {
  const ordered = getAllResearch()
  const index = ordered.findIndex((r) => r.slug === slug)
  if (index === -1 || ordered.length < 2) return null
  return ordered[(index + 1) % ordered.length]
}
