import { useState, useEffect } from 'react'
import { Field, TextInput, TextArea, StringList, PairList, ImageUpload, Button } from './ui'
import BlockEditor from './BlockEditor'

const EMPTY = {
  slug: '', title: '', topic: '', date: '', readingTime: '', tags: [],
  summary: '', cover: '', interactive: null, resources: [], downloads: [], body: [],
}

export default function ResearchManager() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [draft, setDraft] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/research')
      const data = await res.json()
      setItems([...data].sort((a, b) => new Date(b.date) - new Date(a.date)))
    } catch (e) { setError(String(e)) }
    setLoading(false)
  }

  function startNew() { setDraft(EMPTY); setEditing('new'); setError('') }
  function startEdit(r) { setDraft({ ...EMPTY, ...r }); setEditing(r.id); setError('') }
  const set = (k, v) => setDraft((d) => ({ ...d, [k]: v }))

  async function save() {
    if (!draft.slug || !draft.title) { setError('Slug and title are required.'); return }
    setSaving(true); setError('')
    // Drop an empty interactive object so the site doesn't render an empty frame.
    const payload = { ...draft }
    if (!payload.interactive || !payload.interactive.src) payload.interactive = undefined
    try {
      const isNew = editing === 'new'
      const res = await fetch(isNew ? '/api/admin/research' : `/api/admin/research/${editing}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Save failed')
      setEditing(null)
      await load()
    } catch (e) { setError(String(e.message || e)) }
    setSaving(false)
  }

  async function remove(r) {
    if (!confirm(`Delete "${r.title}"? This rewrites research.json.`)) return
    await fetch(`/api/admin/research/${r.id}`, { method: 'DELETE' })
    load()
  }

  if (loading) return <p className="adm-muted">Loading research…</p>

  if (editing !== null) {
    const iv = draft.interactive || {}
    return (
      <div className="adm-editor">
        <div className="adm-editor__top">
          <Button onClick={() => setEditing(null)}>← Back</Button>
          <h2 className="adm-h2">{editing === 'new' ? 'New research post' : `Editing: ${draft.title}`}</h2>
          <div className="adm-editor__actions">
            {draft.slug && <a className="adm-btn adm-btn--ghost" href={`/research/${draft.slug}`} target="_blank" rel="noreferrer">Preview ↗</a>}
            <Button variant="primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save post'}</Button>
          </div>
        </div>
        {error && <div className="adm-error adm-error--bar">{error}</div>}

        <div className="adm-grid2">
          <Field label="Title"><TextInput value={draft.title} onChange={(v) => set('title', v)} /></Field>
          <Field label="Slug" hint="URL: /research/<slug>"><TextInput value={draft.slug} onChange={(v) => set('slug', v)} placeholder="why-ai-repaints-your-image" /></Field>
          <Field label="Topic"><TextInput value={draft.topic} onChange={(v) => set('topic', v)} placeholder="LLMs & Context Windows" /></Field>
          <Field label="Date" hint="ISO — controls newest-first order"><TextInput type="date" value={draft.date} onChange={(v) => set('date', v)} /></Field>
          <Field label="Reading time"><TextInput value={draft.readingTime} onChange={(v) => set('readingTime', v)} placeholder="4 min read" /></Field>
        </div>

        <Field label="Summary" hint="teaser shown in the list" wide>
          <TextArea value={draft.summary} onChange={(v) => set('summary', v)} rows={2} />
        </Field>

        <Field label="Tags" wide>
          <StringList value={draft.tags} onChange={(v) => set('tags', v)} placeholder="#AI" addLabel="+ Add tag" />
        </Field>

        <Field label="Cover image" hint="optional hero image" wide>
          <ImageUpload value={draft.cover} onChange={(v) => set('cover', v)} folder="img/research" />
        </Field>

        <Field label="Interactive walkthrough" hint="optional — an HTML app shown big at the top of the post" wide>
          <InteractiveUploader
            slug={draft.slug}
            value={iv}
            onChange={(next) => set('interactive', next)}
          />
        </Field>

        <div className="adm-divider"><span>Article body</span></div>
        <BlockEditor value={draft.body} onChange={(v) => set('body', v)} />

        <div className="adm-divider"><span>Links</span></div>
        <Field label="Resources" hint="external links (source article, LinkedIn post…)" wide>
          <PairList value={draft.resources} onChange={(v) => set('resources', v)} labelPlaceholder="Read the original post" />
        </Field>
        <Field label="Downloads" hint="files to grab — put PDFs in /public/assets/pdf/" wide>
          <PairList value={draft.downloads} onChange={(v) => set('downloads', v)} labelPlaceholder="My notes (PDF)" hrefPlaceholder="/assets/pdf/…" />
        </Field>
      </div>
    )
  }

  return (
    <div>
      <div className="adm-section-head">
        <div>
          <h2 className="adm-h2">Research</h2>
          <p className="adm-muted">{items.length} posts · saved to data/research.json</p>
        </div>
        <Button variant="primary" onClick={startNew}>+ New post</Button>
      </div>
      <div className="adm-rows">
        {items.map((r) => (
          <div className="adm-row" key={r.id}>
            <div className="adm-row__main">
              <div className="adm-card__title">{r.title}</div>
              <div className="adm-card__meta">
                {r.topic ? `${r.topic} · ` : ''}{r.date}
                {r.interactive?.src && <span className="adm-badge">interactive</span>}
              </div>
            </div>
            <div className="adm-card__actions">
              <Button onClick={() => startEdit(r)}>Edit</Button>
              <a className="adm-btn adm-btn--ghost" href={`/research/${r.slug}`} target="_blank" rel="noreferrer">View ↗</a>
              <button type="button" className="adm-btn adm-btn--danger" onClick={() => remove(r)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function InteractiveUploader({ slug, value = {}, onChange }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  async function onPick(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!slug) { setErr('Set the slug first — the app is stored at /public/research/<slug>/.'); e.target.value = ''; return }
    setBusy(true); setErr('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('slug', slug)
      const res = await fetch('/api/admin/upload-interactive', { method: 'POST', body: fd })
      if (!res.ok) throw new Error((await res.json()).error || 'Upload failed')
      const { src } = await res.json()
      onChange({ src, title: value.title || '' })
    } catch (e2) { setErr(String(e2.message || e2)) }
    finally { setBusy(false); e.target.value = '' }
  }

  return (
    <div className="adm-interactive">
      <div className="adm-grid2">
        <Field label="App path (src)" hint="set by the uploader, or type it">
          <TextInput value={value.src} onChange={(v) => onChange({ ...value, src: v })} placeholder="/research/<slug>/index.html" />
        </Field>
        <Field label="Title">
          <TextInput value={value.title} onChange={(v) => onChange({ ...value, title: v })} placeholder="Context window — interactive walkthrough" />
        </Field>
      </div>
      <div className="adm-interactive__actions">
        <label className="adm-btn adm-btn--ghost adm-upload">
          {busy ? 'Uploading…' : 'Upload .zip or .html'}
          <input type="file" accept=".zip,.html,.htm" onChange={onPick} disabled={busy} hidden />
        </label>
        {value.src && (
          <>
            <a className="adm-btn adm-btn--ghost" href={value.src} target="_blank" rel="noreferrer">Open app ↗</a>
            <button type="button" className="adm-btn adm-btn--danger" onClick={() => onChange(null)}>Remove</button>
          </>
        )}
      </div>
      <p className="adm-field__hint">
        A .zip should contain the built app with index.html at its root (a single wrapping folder like <code>dist/</code> is fine).
        It lands in <code>/public/research/{slug || '<slug>'}/</code>.
      </p>
      {err && <span className="adm-error">{err}</span>}
    </div>
  )
}
