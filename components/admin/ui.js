import { useState } from 'react'

// ── Upload helper ────────────────────────────────────────────────────
export async function uploadFile(file, folder) {
  const fd = new FormData()
  fd.append('file', file)
  if (folder) fd.append('folder', folder)
  const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
  if (!res.ok) {
    const msg = await res.json().catch(() => ({}))
    throw new Error(msg.error || 'Upload failed')
  }
  return (await res.json()).path
}

// ── Toggle switch ────────────────────────────────────────────────────
export function Toggle({ checked, onChange, disabled, labels }) {
  return (
    <span className="adm-toggle-wrap">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={`adm-toggle ${checked ? 'is-on' : ''}`}
        onClick={() => onChange(!checked)}
      >
        <span className="adm-toggle__knob" />
      </button>
      {labels && <span className={`adm-toggle__label ${checked ? 'is-on' : ''}`}>{checked ? labels[0] : labels[1]}</span>}
    </span>
  )
}

// ── Field wrapper ────────────────────────────────────────────────────
export function Field({ label, hint, children, wide }) {
  return (
    <label className={`adm-field ${wide ? 'adm-field--wide' : ''}`}>
      {label && <span className="adm-field__label">{label}</span>}
      {children}
      {hint && <span className="adm-field__hint">{hint}</span>}
    </label>
  )
}

export function TextInput({ value, onChange, ...rest }) {
  return (
    <input
      className="adm-input"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      {...rest}
    />
  )
}

export function TextArea({ value, onChange, rows = 4, mono, ...rest }) {
  return (
    <textarea
      className={`adm-input ${mono ? 'adm-input--mono' : ''}`}
      rows={rows}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      {...rest}
    />
  )
}

export function Button({ children, variant = 'ghost', ...rest }) {
  return (
    <button type="button" className={`adm-btn adm-btn--${variant}`} {...rest}>
      {children}
    </button>
  )
}

// ── List of plain strings (paragraphs, highlights, tags, list items) ──
export function StringList({ value = [], onChange, placeholder, multiline, addLabel = '+ Add' }) {
  const items = Array.isArray(value) ? value : []
  const set = (i, v) => onChange(items.map((it, idx) => (idx === i ? v : it)))
  const add = () => onChange([...items, ''])
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i))
  const move = (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= items.length) return
    const next = [...items]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }
  return (
    <div className="adm-list">
      {items.map((it, i) => (
        <div className="adm-list__row" key={i}>
          {multiline ? (
            <TextArea value={it} onChange={(v) => set(i, v)} rows={2} placeholder={placeholder} />
          ) : (
            <TextInput value={it} onChange={(v) => set(i, v)} placeholder={placeholder} />
          )}
          <div className="adm-list__ctrls">
            <button type="button" className="adm-icon" onClick={() => move(i, -1)} title="Move up">↑</button>
            <button type="button" className="adm-icon" onClick={() => move(i, 1)} title="Move down">↓</button>
            <button type="button" className="adm-icon adm-icon--danger" onClick={() => remove(i)} title="Remove">✕</button>
          </div>
        </div>
      ))}
      <Button onClick={add}>{addLabel}</Button>
    </div>
  )
}

// ── List of { label, href } pairs (resources, downloads) ─────────────
export function PairList({ value = [], onChange, labelPlaceholder = 'Label', hrefPlaceholder = 'https://…' }) {
  const items = Array.isArray(value) ? value : []
  const set = (i, key, v) => onChange(items.map((it, idx) => (idx === i ? { ...it, [key]: v } : it)))
  const add = () => onChange([...items, { label: '', href: '' }])
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i))
  return (
    <div className="adm-list">
      {items.map((it, i) => (
        <div className="adm-list__row" key={i}>
          <TextInput value={it.label} onChange={(v) => set(i, 'label', v)} placeholder={labelPlaceholder} />
          <TextInput value={it.href} onChange={(v) => set(i, 'href', v)} placeholder={hrefPlaceholder} />
          <div className="adm-list__ctrls">
            <button type="button" className="adm-icon adm-icon--danger" onClick={() => remove(i)} title="Remove">✕</button>
          </div>
        </div>
      ))}
      <Button onClick={add}>+ Add link</Button>
    </div>
  )
}

// ── Image field: preview + upload + editable path ────────────────────
export function ImageUpload({ value, onChange, folder = 'img' }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  async function onPick(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    setErr('')
    try {
      const path = await uploadFile(file, folder)
      onChange(path)
    } catch (e2) {
      setErr(String(e2.message || e2))
    } finally {
      setBusy(false)
      e.target.value = ''
    }
  }

  return (
    <div className="adm-image">
      <div className="adm-image__preview">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" />
        ) : (
          <span className="adm-image__empty">no image</span>
        )}
      </div>
      <div className="adm-image__side">
        <TextInput value={value} onChange={onChange} placeholder="/assets/img/…" />
        <label className="adm-btn adm-btn--ghost adm-upload">
          {busy ? 'Uploading…' : 'Upload image'}
          <input type="file" accept="image/*" onChange={onPick} disabled={busy} hidden />
        </label>
        {err && <span className="adm-error">{err}</span>}
      </div>
    </div>
  )
}
