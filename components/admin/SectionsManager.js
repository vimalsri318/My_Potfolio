import { useState, useEffect } from 'react'
import { Toggle } from './ui'

// Section-level visibility. Toggles write to Supabase and the live site
// reflects them within the ISR window (~15s) — no git push needed.
const HINTS = {
  coming_soon: 'When ON, the homepage shows only the hero + “cooking” panel. Turn OFF to reveal the sections below.',
  about: 'The About section on the homepage.',
  projects: 'The Projects section + its nav link.',
  services: 'The Services section.',
  experience: 'The Experience section.',
  contact: 'The Contact section + its nav link.',
}

export default function SectionsManager() {
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/visibility')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to load sections')
      setSections(data.sections || [])
    } catch (e) { setError(String(e.message || e)) }
    setLoading(false)
  }

  async function toggle(sec) {
    const next = !sec.enabled
    setBusy(sec.key)
    setError('')
    setSections((s) => s.map((x) => (x.key === sec.key ? { ...x, enabled: next } : x)))
    try {
      const res = await fetch('/api/admin/visibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: 'section', key: sec.key, enabled: next }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Save failed')
    } catch (e) {
      setError(String(e.message || e))
      setSections((s) => s.map((x) => (x.key === sec.key ? { ...x, enabled: !next } : x)))
    }
    setBusy('')
  }

  if (loading) return <p className="adm-muted">Loading sections…</p>

  const master = sections.find((s) => s.key === 'coming_soon')
  const rest = sections.filter((s) => s.key !== 'coming_soon')

  return (
    <div>
      <div className="adm-section-head">
        <div>
          <h2 className="adm-h2">Sections</h2>
          <p className="adm-muted">Show or hide homepage sections · changes go live in ~15s</p>
        </div>
      </div>
      {error && <div className="adm-error adm-error--bar">{error}</div>}

      <div className="adm-toggle-rows">
        {master && (
          <div className="adm-toggle-row adm-toggle-row--master">
            <div>
              <div className="adm-toggle-row__title">{master.label}</div>
              <div className="adm-toggle-row__hint">{HINTS[master.key]}</div>
            </div>
            <Toggle checked={master.enabled} disabled={busy === master.key} onChange={() => toggle(master)} labels={['On', 'Off']} />
          </div>
        )}
        {rest.map((sec) => (
          <div className="adm-toggle-row" key={sec.key}>
            <div>
              <div className="adm-toggle-row__title">{sec.label}</div>
              <div className="adm-toggle-row__hint">{HINTS[sec.key] || ''}</div>
            </div>
            <Toggle
              checked={sec.enabled}
              disabled={busy === sec.key || (master && master.enabled)}
              onChange={() => toggle(sec)}
              labels={['Visible', 'Hidden']}
            />
          </div>
        ))}
      </div>
      {master && master.enabled && (
        <p className="adm-muted" style={{ marginTop: 16 }}>
          Section toggles apply once “Coming-soon mode” is off.
        </p>
      )}
    </div>
  )
}
