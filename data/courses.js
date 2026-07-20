// Courses & digital products — the future "grab and learn" section.
// Set `available: true` and fill in `link` when a course goes live.
// The /courses page renders everything here automatically.

const courses = [
  {
    id: 1,
    slug: 'ai-development-fundamentals',
    title: 'AI Development Fundamentals',
    kicker: 'From zero to your first model',
    description:
      'Python, machine-learning basics and LLM APIs — everything needed to start building real AI products.',
    tags: ['#PYTHON', '#ML', '#LLMS'],
    available: false,
    link: '',
  },
  {
    id: 2,
    slug: 'production-rag-chatbots',
    title: 'Production RAG Chatbots',
    kicker: 'Chatbots that know your data',
    description:
      'Design, build and deploy retrieval-augmented chatbots — from vector search to a client-ready production system.',
    tags: ['#RAG', '#LANGCHAIN', '#VECTORDB'],
    available: false,
    link: '',
  },
]

export default courses
