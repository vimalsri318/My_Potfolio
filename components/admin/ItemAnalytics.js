import { useState, useEffect } from 'react'
import { Button } from './ui'

// Full-section analytics for a single project or research post — opened from the
// "Analytics" button on its card, replacing the list (with a Back button) rather
// than floating over it. Fetches /api/admin/analytics/item and shows views,
// uniques, likes, engagement, top sources and its own feedback.
const C = { blue: '#2a78d6', aqua: '#1baf7a', red: '#e34948', green: '#008300', orange: '#eb6834' }

export default function ItemAnalytics({ type, slug, title, onBack }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let live = true
    setData(null); setError('')
    fetch(`/api/admin/analytics/item?type=${encodeURIComponent(type)}&slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json().then((j) => ({ ok: r.ok, j })))
      .then(({ ok, j }) => { if (!live) return; if (!ok) setError(j.error || 'Failed to load'); else setData(j) })
      .catch((e) => live && setError(String(e.message || e)))
    return () => { live = false }
  }, [type, slug])

  const t = data?.totals || {}
  const base = type === 'research' ? 'research' : 'projects'

  return (
    <div>
      <div className="adm-editor__top">
        <Button onClick={onBack}>← Back</Button>
        <div>
          <div className="adm-item__eyebrow">{type} analytics</div>
          <h2 className="adm-h2">{title || slug}</h2>
        </div>
        <div className="adm-editor__actions">
          <a className="adm-btn adm-btn--ghost" href={`/${base}/${slug}`} target="_blank" rel="noreferrer">Open live ↗</a>
        </div>
      </div>
      {data?.path && <p className="adm-muted" style={{ marginTop: -12, marginBottom: 24 }}>{data.path}</p>}

      {error && <div className="adm-error adm-error--bar">{error}</div>}
      {!data && !error && <p className="adm-muted">Loading…</p>}

      {data && (
        <>
          <div className="adm-stats">
            <MiniStat label="Views" value={t.views} accent={C.aqua} />
            <MiniStat label="Unique visitors" value={t.uniques} accent={C.blue} />
            <MiniStat label="Likes" value={t.likes} accent={C.red} />
            <MiniStat label="Feedback" value={t.feedback} accent={C.green} />
          </div>
          <div className="adm-stats">
            <MiniStat label="Median time on page" value={t.medianSeconds ? `${t.medianSeconds}s` : '—'} accent={C.orange} />
            <MiniStat label="Avg scroll depth" value={t.avgScroll == null ? '—' : `${t.avgScroll}%`} accent={C.orange} />
          </div>

          <section className="adm-panel" style={{ marginBottom: 20 }}>
            <h3 className="adm-h3"><i className="adm-dot-c" style={{ background: C.aqua }} /> Views — last 14 days</h3>
            <Spark series={data.series} />
          </section>

          <div className="adm-grid2 adm-grid2--wide">
            <MiniList title="Top sources" rows={data.sources} color={C.orange} />
            <MiniList title="Top countries" rows={data.countries} color={C.blue} />
          </div>

          <section className="adm-panel" style={{ marginTop: 20 }}>
            <h3 className="adm-h3">Feedback ({data.feedback.length})</h3>
            {data.feedback.length === 0 ? (
              <p className="adm-muted">No feedback on this {type} yet.</p>
            ) : (
              <div className="adm-feedback">
                {data.feedback.map((f) => (
                  <div key={f.id} className="adm-feedback__item">
                    <div className="adm-feedback__meta">{new Date(f.created_at).toLocaleString()}</div>
                    <p className="adm-feedback__msg">{f.message}</p>
                    <div className="adm-feedback__author">— {f.name || 'Anonymous'}</div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}

function MiniStat({ label, value, accent }) {
  return (
    <div className="adm-stat">
      <div className="adm-stat__value">{value ?? 0}</div>
      <div className="adm-stat__label"><i className="adm-dot-c" style={{ background: accent }} />{label}</div>
    </div>
  )
}

function MiniList({ title, rows, color }) {
  const max = Math.max(1, ...rows.map((r) => r.value))
  return (
    <section className="adm-panel">
      <h3 className="adm-h3"><i className="adm-dot-c" style={{ background: color }} /> {title}</h3>
      {rows.length === 0 ? (
        <p className="adm-muted">No data yet.</p>
      ) : (
        <ul className="adm-bars">
          {rows.map((r) => (
            <li key={r.label} className="adm-bar">
              <div className="adm-bar__head">
                <span className="adm-bar__label">{r.label}</span>
                <span className="adm-bar__nums">{r.value}</span>
              </div>
              <div className="adm-bar__track">
                <div className="adm-bar__fill" style={{ width: `${(r.value / max) * 100}%`, background: color }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function Spark({ series = [] }) {
  const W = 720, H = 120, pad = 8
  const n = series.length
  const max = Math.max(1, ...series.map((d) => d.views))
  const bw = Math.max(3, ((W - pad * 2) / n) * 0.62)
  const x = (i) => pad + ((W - pad * 2) / n) * (i + 0.5)
  const hasAny = series.some((d) => d.views > 0)
  if (!hasAny) return <p className="adm-muted">No views in the last 14 days.</p>
  return (
    <svg className="adm-chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" role="img" aria-label="Views over the last 14 days">
      <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="#c3c2b7" />
      {series.map((d, i) => {
        const h = (d.views / max) * (H - pad * 2)
        return <rect key={i} x={x(i) - bw / 2} y={H - pad - h} width={bw} height={h} rx="2" fill={C.aqua} />
      })}
      {series.map((d, i) => ((i % 3 === 0 || i === n - 1) ? (
        <text key={`t${i}`} className="adm-chart__axis" x={x(i)} y={H - 1} textAnchor="middle">{d.date.slice(5)}</text>
      ) : null))}
    </svg>
  )
}
