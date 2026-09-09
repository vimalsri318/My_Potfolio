import { useState, useEffect } from 'react'
import { Field, TextInput, TextArea, ImageUpload, Button } from './ui'

const EMPTY_TESTIMONIAL = {
  name: '',
  role: '',
  company: '',
  avatar_url: '',
  content: '',
  rating: 5,
  project_name: '',
  linkedin_url: '',
  status: 'approved',
  is_featured: false,
}

export default function TestimonialsManager() {
  const [data, setData] = useState({ items: [], counts: { total: 0, pending: 0, approved: 0, rejected: 0 } })
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // 'all' | 'pending' | 'approved' | 'rejected'
  const [editing, setEditing] = useState(null) // null | 'new' | id
  const [draft, setDraft] = useState(EMPTY_TESTIMONIAL)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/testimonials')
      const resData = await res.json()
      if (!res.ok) throw new Error(resData.error || 'Failed to load testimonials')
      setData(resData)
    } catch (e) {
      setError(String(e.message || e))
    }
    setLoading(false)
  }

  function startNew() {
    setDraft(EMPTY_TESTIMONIAL)
    setEditing('new')
    setError('')
  }

  function startEdit(item) {
    setDraft({ ...EMPTY_TESTIMONIAL, ...item })
    setEditing(item.id)
    setError('')
  }

  const set = (key, val) => setDraft((prev) => ({ ...prev, [key]: val }))

  async function save() {
    if (!draft.name?.trim() || !draft.content?.trim()) {
      setError('Client name and testimonial content are required.')
      return
    }

    setSaving(true)
    setError('')
    try {
      const isNew = editing === 'new'
      const res = await fetch('/api/admin/testimonials', {
        method: isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isNew ? draft : { id: editing, ...draft }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Failed to save testimonial')

      setEditing(null)
      await load()
    } catch (e) {
      setError(String(e.message || e))
    }
    setSaving(false)
  }

  async function updateStatus(id, newStatus) {
    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to update status')
      await load()
    } catch (e) {
      setError(String(e.message || e))
    }
  }

  async function toggleFeatured(item) {
    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, is_featured: !item.is_featured }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to update featured flag')
      await load()
    } catch (e) {
      setError(String(e.message || e))
    }
  }

  async function remove(item) {
    if (!confirm(`Delete testimonial from "${item.name}"?`)) return
    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to delete')
      await load()
    } catch (e) {
      setError(String(e.message || e))
    }
  }

  function copyClientLink() {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const link = `${origin}/testimonial`
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    })
  }

  if (loading && !data.items.length) {
    return <p className="adm-muted">Loading testimonials…</p>
  }

  const { items, counts } = data
  const filtered = items.filter((it) => (filter === 'all' ? true : it.status === filter))

  // Editor View
  if (editing !== null) {
    return (
      <div className="adm-editor">
        <div className="adm-editor__top">
          <button type="button" className="adm-back" onClick={() => setEditing(null)}>
            ← Back to testimonials
          </button>
          <div className="adm-editor__actions">
            <Button variant="primary" onClick={save} disabled={saving}>
              {saving ? 'Saving…' : 'Save testimonial'}
            </Button>
          </div>
        </div>

        <h2 className="adm-h2" style={{ marginBottom: 20 }}>
          {editing === 'new' ? 'New Testimonial' : `Edit: ${draft.name}`}
        </h2>

        {error && <div className="adm-error adm-error--bar">{error}</div>}

        <div className="adm-form-grid">
          <Field label="Client Name *" hint="Full name of the person giving the testimonial">
            <TextInput value={draft.name} onChange={(v) => set('name', v)} placeholder="e.g. Jane Doe" />
          </Field>

          <Field label="Role / Title" hint="e.g. Founder & CEO, Lead AI Researcher">
            <TextInput value={draft.role} onChange={(v) => set('role', v)} placeholder="e.g. CEO & Founder" />
          </Field>

          <Field label="Company / Organization" hint="e.g. OpenAI, NeuralFlow Labs">
            <TextInput value={draft.company} onChange={(v) => set('company', v)} placeholder="e.g. Acme Corp" />
          </Field>

          <Field label="Project Worked On" hint="Optional reference project">
            <TextInput value={draft.project_name} onChange={(v) => set('project_name', v)} placeholder="e.g. Enterprise RAG Chatbot" />
          </Field>

          <Field label="Star Rating (1 - 5)">
            <select
              className="adm-input"
              value={draft.rating}
              onChange={(e) => set('rating', parseInt(e.target.value, 10))}
            >
              <option value={5}>⭐⭐⭐⭐⭐ (5 / 5 - Exceptional)</option>
              <option value={4}>⭐⭐⭐⭐ (4 / 5 - Great)</option>
              <option value={3}>⭐⭐⭐ (3 / 5 - Good)</option>
              <option value={2}>⭐⭐ (2 / 5 - Fair)</option>
              <option value={1}>⭐ (1 / 5 - Poor)</option>
            </select>
          </Field>

          <Field label="Status & Moderation">
            <select
              className="adm-input"
              value={draft.status}
              onChange={(e) => set('status', e.target.value)}
            >
              <option value="approved">Approved (Visible on portfolio)</option>
              <option value="pending">Pending Review (Hidden)</option>
              <option value="rejected">Rejected (Hidden)</option>
            </select>
          </Field>

          <Field label="LinkedIn or Profile Link" hint="Optional social link for verification">
            <TextInput value={draft.linkedin_url} onChange={(v) => set('linkedin_url', v)} placeholder="https://linkedin.com/in/..." />
          </Field>

          <Field label="Pin as Featured Testimonial">
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginTop: 8 }}>
              <input
                type="checkbox"
                checked={!!draft.is_featured}
                onChange={(e) => set('is_featured', e.target.checked)}
              />
              <span style={{ fontSize: '0.9rem' }}>Feature this testimonial prominently on top</span>
            </label>
          </Field>

          <Field label="Client Photo / Avatar" hint="Upload headshot or paste image URL" wide>
            <ImageUpload value={draft.avatar_url} onChange={(v) => set('avatar_url', v)} folder="testimonials" />
          </Field>

          <Field label="Testimonial / Feedback Content *" hint="The quote or recommendation message" wide>
            <TextArea
              value={draft.content}
              onChange={(v) => set('content', v)}
              rows={5}
              placeholder="What was it like working together? What results or AI impact did you deliver?"
            />
          </Field>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="adm-section-head">
        <div>
          <h2 className="adm-h2">Testimonials</h2>
          <p className="adm-muted">
            {counts.total} total · {counts.pending} pending review · {counts.approved} live on portfolio
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Button variant="ghost" onClick={copyClientLink}>
            {copied ? '✓ Link Copied!' : '📋 Copy Client Submission Link'}
          </Button>
          <Button variant="primary" onClick={startNew}>
            + Add Testimonial
          </Button>
        </div>
      </div>

      {error && <div className="adm-error adm-error--bar">{error}</div>}

      {/* Quick link banner */}
      <div className="adm-tip-banner" style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 8,
        padding: '12px 16px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}>
        <div>
          <span style={{ fontWeight: 600, color: 'var(--ink)' }}>Client Link: </span>
          <code style={{ color: 'var(--accent, #f59e0b)', fontSize: '0.85rem' }}>/testimonial</code>
          <p className="adm-muted" style={{ margin: '4px 0 0', fontSize: '0.8rem' }}>
            Send this clean link to your clients to collect testimonials. Submissions arrive here for your review.
          </p>
        </div>
        <Button variant="ghost" onClick={copyClientLink} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
          {copied ? '✓ Copied' : 'Copy link'}
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="adm-filter-bar" style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 12 }}>
        {[
          { id: 'all', label: `All (${counts.total})` },
          { id: 'pending', label: `Pending (${counts.pending})`, badge: counts.pending > 0 },
          { id: 'approved', label: `Approved (${counts.approved})` },
          { id: 'rejected', label: `Rejected (${counts.rejected})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`adm-btn ${filter === tab.id ? 'adm-btn--primary' : 'adm-btn--ghost'}`}
            style={{ fontSize: '0.8rem', position: 'relative' }}
            onClick={() => setFilter(tab.id)}
          >
            {tab.label}
            {tab.badge && (
              <span style={{
                position: 'absolute',
                top: -4,
                right: -4,
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#f59e0b',
              }} />
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="adm-muted">
          No {filter === 'all' ? '' : filter} testimonials found.
          {filter === 'pending' ? ' When a client submits via /testimonial, it will appear here for your review.' : ''}
        </p>
      ) : (
        <div className="adm-testimonials-list" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filtered.map((item) => {
            const isPending = item.status === 'pending'
            const isApproved = item.status === 'approved'

            return (
              <div
                key={item.id}
                className="adm-card"
                style={{
                  padding: 18,
                  borderRadius: 8,
                  border: isPending ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(255,255,255,0.08)',
                  background: isPending ? 'rgba(245, 158, 11, 0.04)' : 'rgba(255,255,255,0.02)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {item.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.avatar_url}
                        alt={item.name}
                        style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #333, #555)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '1rem',
                        }}
                      >
                        {item.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--ink)' }}>{item.name}</span>
                        {item.is_featured && (
                          <span style={{ background: '#f59e0b22', color: '#f59e0b', fontSize: '0.7rem', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                            ★ FEATURED
                          </span>
                        )}
                      </div>
                      <div className="adm-muted" style={{ fontSize: '0.85rem' }}>
                        {[item.role, item.company].filter(Boolean).join(' · ') || 'Client'}
                        {item.project_name && ` · (${item.project_name})`}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: 4,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        background:
                          item.status === 'approved'
                            ? 'rgba(34, 197, 94, 0.15)'
                            : item.status === 'pending'
                            ? 'rgba(245, 158, 11, 0.15)'
                            : 'rgba(239, 68, 68, 0.15)',
                        color:
                          item.status === 'approved'
                            ? '#22c55e'
                            : item.status === 'pending'
                            ? '#f59e0b'
                            : '#ef4444',
                      }}
                    >
                      {item.status}
                    </span>
                    <span className="adm-muted" style={{ fontSize: '0.75rem' }}>
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Rating Stars */}
                <div style={{ color: '#f59e0b', fontSize: '0.9rem', marginBottom: 8 }}>
                  {'★'.repeat(item.rating) + '☆'.repeat(Math.max(0, 5 - item.rating))}
                </div>

                {/* Testimonial Quote */}
                <p style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, margin: '8px 0 16px' }}>
                  &ldquo;{item.content}&rdquo;
                </p>

                {/* Controls Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {isPending && (
                      <Button variant="primary" onClick={() => updateStatus(item.id, 'approved')} style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
                        ✓ Approve & Publish
                      </Button>
                    )}
                    {isPending && (
                      <Button variant="ghost" onClick={() => updateStatus(item.id, 'rejected')} style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
                        ✕ Reject
                      </Button>
                    )}
                    {isApproved && (
                      <Button
                        variant="ghost"
                        onClick={() => updateStatus(item.id, 'pending')}
                        style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                        title="Hide from public portfolio"
                      >
                        Hide from site
                      </Button>
                    )}
                    <button
                      type="button"
                      className="adm-btn adm-btn--ghost"
                      onClick={() => toggleFeatured(item)}
                      style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                      title="Toggle featured status"
                    >
                      {item.is_featured ? '★ Unfeature' : '☆ Pin as Featured'}
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <Button variant="ghost" onClick={() => startEdit(item)} style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
                      Edit
                    </Button>
                    <Button variant="ghost" onClick={() => remove(item)} style={{ padding: '4px 10px', fontSize: '0.8rem', color: '#ef4444' }}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
