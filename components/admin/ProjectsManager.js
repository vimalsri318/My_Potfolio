import { useState, useEffect } from 'react'
import { Field, TextInput, TextArea, StringList, ImageUpload, Button, Toggle } from './ui'
import { usePublishFlags } from './usePublishFlags'

const EMPTY = {
  slug: '', title: '', category: '', year: '', role: '', image: '',
  link: '', summary: '', tech: [], description: [''], highlights: [''], gallery: [],
}

export default function ProjectsManager() {
  const { isPublished, toggle: togglePublish, busy: pubBusy } = usePublishFlags('project')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // null | 'new' | id
  const [draft, setDraft] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/projects')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to load projects')
      setItems(data)
    } catch (e) { setError(String(e)) }
    setLoading(false)
  }

  function startNew() { setDraft(EMPTY); setEditing('new'); setError('') }
  function startEdit(p) { setDraft({ ...EMPTY, ...p }); setEditing(p.id); setError('') }
  const set = (k, v) => setDraft((d) => ({ ...d, [k]: v }))

  async function save() {
    if (!draft.slug || !draft.title) { setError('Slug and title are required.'); return }
    setSaving(true); setError('')
    try {
      const isNew = editing === 'new'
      const res = await fetch(isNew ? '/api/admin/projects' : `/api/admin/projects/${editing}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Save failed')
      setEditing(null)
      await load()
    } catch (e) { setError(String(e.message || e)) }
    setSaving(false)
  }

  async function remove(p) {
    if (!confirm(`Delete "${p.title}"? This rewrites projects.json.`)) return
    await fetch(`/api/admin/projects/${p.id}`, { method: 'DELETE' })
    load()
  }

  if (loading) return <p className="adm-muted">Loading projects…</p>

  if (editing !== null) {
    return (
      <div className="adm-editor">
        <div className="adm-editor__top">
          <Button onClick={() => setEditing(null)}>← Back</Button>
          <h2 className="adm-h2">{editing === 'new' ? 'New project' : `Editing: ${draft.title}`}</h2>
          <div className="adm-editor__actions">
            {draft.slug && <a className="adm-btn adm-btn--ghost" href={`/projects/${draft.slug}`} target="_blank" rel="noreferrer">Preview ↗</a>}
            <Button variant="primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save project'}</Button>
          </div>
        </div>
        {error && <div className="adm-error adm-error--bar">{error}</div>}

        <div className="adm-grid2">
          <Field label="Title"><TextInput value={draft.title} onChange={(v) => set('title', v)} placeholder="Project name" /></Field>
          <Field label="Slug" hint="URL: /projects/<slug> — don't change once shared"><TextInput value={draft.slug} onChange={(v) => set('slug', v)} placeholder="my-project" /></Field>
          <Field label="Category"><TextInput value={draft.category} onChange={(v) => set('category', v)} placeholder="Data analysis & Web app" /></Field>
          <Field label="Year"><TextInput value={draft.year} onChange={(v) => set('year', v)} placeholder="2024" /></Field>
          <Field label="Role"><TextInput value={draft.role} onChange={(v) => set('role', v)} placeholder="Full-stack Developer" /></Field>
          <Field label="Live link" hint="leave empty for 'Available on request'"><TextInput value={draft.link} onChange={(v) => set('link', v)} placeholder="https://…" /></Field>
        </div>

        <Field label="Summary" hint="one-line teaser shown in the card & header" wide>
          <TextArea value={draft.summary} onChange={(v) => set('summary', v)} rows={2} />
        </Field>

        <Field label="Hero image" wide>
          <ImageUpload value={draft.image} onChange={(v) => set('image', v)} folder="img" />
        </Field>

        <Field label="Tech" hint="each shown in the Tech meta row" wide>
          <StringList value={draft.tech} onChange={(v) => set('tech', v)} placeholder="React" addLabel="+ Add tech" />
        </Field>

        <Field label="Overview" hint="each line is one paragraph" wide>
          <StringList value={draft.description} onChange={(v) => set('description', v)} placeholder="A paragraph of the case study…" multiline addLabel="+ Add paragraph" />
        </Field>

        <Field label="Highlights" wide>
          <StringList value={draft.highlights} onChange={(v) => set('highlights', v)} placeholder="Interactive charts and drill-down views" addLabel="+ Add highlight" />
        </Field>

        <Field label="Gallery" hint="extra images shown below the write-up" wide>
          <GalleryEditor value={draft.gallery} onChange={(v) => set('gallery', v)} />
        </Field>
      </div>
    )
  }

  return (
    <div>
      <div className="adm-section-head">
        <div>
          <h2 className="adm-h2">Projects</h2>
          <p className="adm-muted">{items.length} projects · saved to data/projects.json</p>
        </div>
        <Button variant="primary" onClick={startNew}>+ New project</Button>
      </div>
      <div className="adm-cards">
        {items.map((p) => (
          <div className="adm-card" key={p.id}>
            <div className="adm-card__thumb">
              {p.image ? <img src={p.image} alt="" /> : <span className="adm-image__empty">no image</span>}
            </div>
            <div className="adm-card__body">
              <div className="adm-card__title">{p.title}</div>
              <div className="adm-card__meta">{p.category} · {p.year}</div>
            </div>
            <div className="adm-card__publish">
              <Toggle checked={isPublished(p.slug)} disabled={pubBusy === p.slug}
                onChange={() => togglePublish(p.slug)} labels={['Live', 'Hidden']} />
            </div>
            <div className="adm-card__actions">
              <Button onClick={() => startEdit(p)}>Edit</Button>
              <a className="adm-btn adm-btn--ghost" href={`/projects/${p.slug}`} target="_blank" rel="noreferrer">View ↗</a>
              <button type="button" className="adm-btn adm-btn--danger" onClick={() => remove(p)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function GalleryEditor({ value = [], onChange }) {
  const items = Array.isArray(value) ? value : []
  const add = (path) => onChange([...items, path])
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i))
  return (
    <div>
      <div className="adm-gallery">
        {items.map((src, i) => (
          <div className="adm-gallery__item" key={i}>
            <img src={src} alt="" />
            <button type="button" className="adm-icon adm-icon--danger adm-gallery__rm" onClick={() => remove(i)}>✕</button>
          </div>
        ))}
      </div>
      <ImageUpload value="" onChange={(path) => path && add(path)} folder="img" />
    </div>
  )
}
