import { useState, useEffect, useCallback } from 'react'

// Header control for the Draft -> Live workflow. Everything edited in the admin
// is staged locally (draft); this shows how many changes are pending and pushes
// them to production in one click. Polls the publish endpoint so the count stays
// fresh as you toggle things in the tabs below.
export default function PublishBar() {
  const [total, setTotal] = useState(null)
  const [pending, setPending] = useState(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/publish')
      if (!res.ok) return
      const data = await res.json()
      setTotal(data.total)
      setPending(data.pending)
    } catch {
      /* leave last known */
    }
  }, [])

  useEffect(() => {
    refresh()
    const t = setInterval(refresh, 5000)
    return () => clearInterval(t)
  }, [refresh])

  async function publish() {
    if (!total) return
    const bits = summarize(pending)
    if (!confirm(`Publish to production?\n\n${bits}\n\nThis makes the current draft live on your site.`)) return
    setBusy(true)
    setMsg('')
    try {
      const res = await fetch('/api/admin/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scope: 'all' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Publish failed')
      setMsg('Published ✓')
      await refresh()
      setTimeout(() => setMsg(''), 2500)
    } catch (e) {
      setMsg(String(e.message || e))
    }
    setBusy(false)
  }

  const clean = total === 0
  const label = busy ? 'Publishing…' : total ? `Publish ${total} change${total === 1 ? '' : 's'}` : 'All published'

  return (
    <div className="adm-publish" title={pending ? summarize(pending) : ''}>
      <span className={`adm-publish__dot ${clean ? 'is-clean' : 'is-pending'}`} />
      <span className="adm-publish__state">
        {total == null ? 'Draft' : clean ? 'Live — in sync' : `Draft — ${total} pending`}
      </span>
      <button
        type="button"
        className="adm-btn adm-btn--primary adm-publish__btn"
        onClick={publish}
        disabled={busy || !total}
      >
        {label}
      </button>
      {msg && <span className="adm-publish__msg">{msg}</span>}
    </div>
  )
}

function summarize(p) {
  if (!p) return ''
  const parts = []
  if (p.projects?.length) parts.push(`${p.projects.length} project${p.projects.length === 1 ? '' : 's'}`)
  if (p.research?.length) parts.push(`${p.research.length} research`)
  if (p.sections?.length) parts.push(`${p.sections.length} section${p.sections.length === 1 ? '' : 's'}`)
  if (p.flags?.length) parts.push(`${p.flags.length} visibility flag${p.flags.length === 1 ? '' : 's'}`)
  return parts.length ? parts.join(' · ') : 'Nothing pending'
}
