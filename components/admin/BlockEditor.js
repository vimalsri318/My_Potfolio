import { Field, TextInput, TextArea, StringList, ImageUpload, Button } from './ui'

// Edits the `body` array of a research entry — the article itself, block
// by block. Mirrors exactly the block types ResearchDetail renders.

const BLOCK_TYPES = [
  { type: 'paragraph', label: '¶ Paragraph' },
  { type: 'heading', label: 'H Heading' },
  { type: 'list', label: '• List' },
  { type: 'quote', label: '" Quote' },
  { type: 'code', label: '</> Code' },
  { type: 'image', label: '🖼 Image' },
]

function emptyBlock(type) {
  switch (type) {
    case 'list':
      return { type, items: [''] }
    case 'image':
      return { type, src: '', caption: '' }
    case 'code':
      return { type, language: '', text: '' }
    default:
      return { type, text: '' }
  }
}

function BlockBody({ block, onChange }) {
  const patch = (p) => onChange({ ...block, ...p })
  switch (block.type) {
    case 'heading':
      return <TextInput value={block.text} onChange={(v) => patch({ text: v })} placeholder="Heading text" />
    case 'paragraph':
      return <TextArea value={block.text} onChange={(v) => patch({ text: v })} rows={4} placeholder="Paragraph…" />
    case 'quote':
      return <TextArea value={block.text} onChange={(v) => patch({ text: v })} rows={2} placeholder="Quote…" />
    case 'list':
      return <StringList value={block.items} onChange={(v) => patch({ items: v })} placeholder="List item" addLabel="+ Add item" />
    case 'code':
      return (
        <>
          <TextInput value={block.language} onChange={(v) => patch({ language: v })} placeholder="language (e.g. python)" />
          <TextArea value={block.text} onChange={(v) => patch({ text: v })} rows={8} mono placeholder="code…" />
        </>
      )
    case 'image':
      return (
        <>
          <ImageUpload value={block.src} onChange={(v) => patch({ src: v })} folder="img/research" />
          <TextInput value={block.caption} onChange={(v) => patch({ caption: v })} placeholder="caption (optional)" />
        </>
      )
    default:
      return null
  }
}

export default function BlockEditor({ value = [], onChange }) {
  const blocks = Array.isArray(value) ? value : []
  const setBlock = (i, b) => onChange(blocks.map((x, idx) => (idx === i ? b : x)))
  const remove = (i) => onChange(blocks.filter((_, idx) => idx !== i))
  const add = (type) => onChange([...blocks, emptyBlock(type)])
  const move = (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= blocks.length) return
    const next = [...blocks]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  return (
    <div className="adm-blocks">
      {blocks.map((block, i) => (
        <div className="adm-block" key={i}>
          <div className="adm-block__bar">
            <span className="adm-block__type">{block.type}</span>
            <div className="adm-list__ctrls">
              <button type="button" className="adm-icon" onClick={() => move(i, -1)} title="Move up">↑</button>
              <button type="button" className="adm-icon" onClick={() => move(i, 1)} title="Move down">↓</button>
              <button type="button" className="adm-icon adm-icon--danger" onClick={() => remove(i)} title="Remove block">✕</button>
            </div>
          </div>
          <div className="adm-block__body">
            <BlockBody block={block} onChange={(b) => setBlock(i, b)} />
          </div>
        </div>
      ))}

      <div className="adm-block__add">
        <span className="adm-field__label">Add block</span>
        <div className="adm-block__add-row">
          {BLOCK_TYPES.map((b) => (
            <Button key={b.type} onClick={() => add(b.type)}>{b.label}</Button>
          ))}
        </div>
      </div>
    </div>
  )
}
