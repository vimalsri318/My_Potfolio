import { useState, useEffect } from 'react'
import { getLastSeen } from './seen'

// The "Let's talk" tab — contact-form submissions stored in Supabase. Messages
// that arrived since the admin last checked get a "New" badge.
export default function MessagesManager() {
  const [items, setItems] = useState(null)
  const [error, setError] = useState('')
  const [seen] = useState(() => getLastSeen())

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const res = await fetch('/api/admin/messages')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to load messages')
      setItems(data)
    } catch (e) {
      setError(String(e.message || e))
      setItems([])
    }
  }

  if (items === null && !error) return <p className="adm-muted">Loading messages…</p>

  const isNew = (m) => seen && m.created_at > seen
  const newCount = items ? items.filter(isNew).length : 0

  return (
    <div>
      <div className="adm-section-head">
        <div>
          <h2 className="adm-h2">Let&apos;s talk</h2>
          <p className="adm-muted">
            {items.length} message{items.length === 1 ? '' : 's'} from the contact form
            {newCount > 0 && ` · ${newCount} new`}
          </p>
        </div>
      </div>
      {error && <div className="adm-error adm-error--bar">{error}</div>}

      {items.length === 0 ? (
        <p className="adm-muted">No messages yet. When someone sends a note from the “Let’s talk” form, it shows up here.</p>
      ) : (
        <div className="adm-msgs">
          {items.map((m) => (
            <div className={`adm-msg ${isNew(m) ? 'is-new' : ''}`} key={m.id}>
              <div className="adm-msg__top">
                <div className="adm-msg__who">
                  <span className="adm-msg__name">{m.name || 'Anonymous'}</span>
                  {m.email && <a className="adm-msg__email" href={`mailto:${m.email}`}>{m.email}</a>}
                </div>
                <div className="adm-msg__meta">
                  {isNew(m) && <span className="adm-status is-draft">New</span>}
                  <span>{new Date(m.created_at).toLocaleString()}</span>
                </div>
              </div>
              <p className="adm-msg__body">{m.message}</p>
              {m.email && (
                <a className="adm-btn adm-btn--ghost adm-msg__reply" href={`mailto:${m.email}?subject=${encodeURIComponent('Re: your message')}`}>
                  Reply ↗
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
