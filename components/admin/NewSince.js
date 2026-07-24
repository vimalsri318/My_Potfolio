import { useState, useEffect } from 'react'
import { getLastSeen, setLastSeen } from './seen'

// "Since your last visit" banner at the top of the admin. On open it compares
// now against the last-acknowledged time and shows what's arrived — new
// messages, feedback, likes and views — so nothing goes unnoticed. "Mark as
// seen" resets the baseline. `onGo` (optional) jumps to a tab.
export default function NewSince({ onGo }) {
  const [data, setData] = useState(null)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const since = getLastSeen()
    // First ever visit: set the baseline to now; there's no "before" to diff.
    if (!since) { setLastSeen(new Date().toISOString()); return }
    fetch(`/api/admin/summary?since=${encodeURIComponent(since)}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
  }, [])

  if (hidden || !data || !data.configured) return null
  const n = data.new || {}
  const total = (n.feedback || 0) + (n.messages || 0) + (n.likes || 0) + (n.views || 0)
  if (!total) return null

  function markSeen() {
    setLastSeen(new Date().toISOString())
    setHidden(true)
  }

  const chip = (count, singular, plural, tab) =>
    count ? (
      <button
        type="button"
        className={`adm-new__chip ${tab ? 'is-link' : ''}`}
        onClick={tab && onGo ? () => onGo(tab) : undefined}
      >
        <b>{count}</b> {count === 1 ? singular : plural}
      </button>
    ) : null

  return (
    <div className="adm-new" role="status">
      <div className="adm-new__left">
        <span className="adm-new__dot" />
        <span className="adm-new__title">Since your last visit</span>
        <span className="adm-new__chips">
          {chip(n.messages, 'message', 'messages', 'messages')}
          {chip(n.feedback, 'feedback', 'feedback', 'dashboard')}
          {chip(n.likes, 'like', 'likes', 'dashboard')}
          {chip(n.views, 'view', 'views', 'dashboard')}
        </span>
      </div>
      <button type="button" className="adm-new__seen" onClick={markSeen}>Mark as seen</button>
    </div>
  )
}
