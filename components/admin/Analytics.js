import { useMemo, useState } from 'react'
import { aggregate, windowRows, filterOptions } from '../../lib/analytics'

// Read-only dashboard for the dynamic data in Supabase: who visited, from
// where, on what, what they clicked and how far they read. Rows arrive raw from
// getServerSideProps and are aggregated here, so the filter bar re-slices
// instantly. Degrades gracefully when Supabase isn't configured yet.

// Categorical hues (validated for the light paper surface — see the dataviz
// skill). Each breakdown panel gets one hue; bars always carry text labels, so
// the sub-3:1 hues satisfy the relief rule.
const C = {
  blue: '#2a78d6', orange: '#eb6834', aqua: '#1baf7a', yellow: '#eda100',
  magenta: '#e87ba4', green: '#008300', violet: '#4a3aa7', red: '#e34948',
}
// Fixed categorical order for donut slices (validated adjacency, dataviz skill).
const PALETTE = [C.blue, C.orange, C.aqua, C.yellow, C.magenta, C.green, C.violet, C.red]

const WINDOWS = [
  { days: 7, label: '7 days' },
  { days: 30, label: '30 days' },
  { days: 90, label: '90 days' },
]
const PAGE_TYPES = [
  { value: '', label: 'All pages' },
  { value: 'home', label: 'Home' },
  { value: 'projects', label: 'Projects' },
  { value: 'research', label: 'Research' },
  { value: 'other', label: 'Other' },
]

export default function Analytics({ rows = [], events = [], likes = [], feedback = [], windowDays = 90, configured }) {
  const [filters, setFilters] = useState({ windowDays: 30, device: '', country: '', source: '', pageType: '' })
  const set = (k, v) => setFilters((f) => ({ ...f, [k]: v }))
  const reset = () => setFilters({ windowDays: filters.windowDays, device: '', country: '', source: '', pageType: '' })

  // Dropdown options come from rows within the window only, so applying one
  // filter never empties the others.
  const options = useMemo(() => filterOptions(windowRows(rows, filters.windowDays)), [rows, filters.windowDays])
  const data = useMemo(() => aggregate({ rows, events, likes, filters }), [rows, events, likes, filters])

  const { totals, pages, series, countries, cities, devices, browsers, sources, clicks } = data
  const {
    uniqueVisitors = 0, views = 0, likes: likeCount = 0, sessions = 0, pagesPerSession = 0,
    medianSeconds = 0, avgScroll = null, newVisitors = 0, returningVisitors = 0,
  } = totals

  const hasTrend = series.some((d) => d.views > 0 || d.uniques > 0)
  const hasEnrichment = countries.length > 0 || devices.length > 0 || clicks.length > 0
  const dimsActive = filters.device || filters.country || filters.source || filters.pageType

  return (
    <div>
      <div className="adm-section-head">
        <div>
          <h2 className="adm-h2">Analytics &amp; feedback</h2>
          <p className="adm-muted">
            Live visitor data from Supabase · likes &amp; feedback all-time
          </p>
        </div>
      </div>

      {!configured && (
        <div className="adm-notice">
          Supabase isn&apos;t configured yet. Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and keys to
          <code> .env</code> to see visitors, likes and feedback here. Content management works without it.
        </div>
      )}

      {/* ── Filter bar ─────────────────────────────────────────────── */}
      <div className="adm-filters">
        <div className="adm-seg" role="group" aria-label="Time window">
          {WINDOWS.map((w) => (
            <button
              key={w.days}
              type="button"
              className={`adm-seg__btn ${filters.windowDays === w.days ? 'is-active' : ''}`}
              onClick={() => set('windowDays', w.days)}
            >
              {w.label}
            </button>
          ))}
        </div>
        <Select label="Page" value={filters.pageType} onChange={(v) => set('pageType', v)} options={PAGE_TYPES} />
        <Select
          label="Device" value={filters.device} onChange={(v) => set('device', v)}
          options={[{ value: '', label: 'All devices' }, ...options.devices.map((d) => ({ value: d, label: cap(d) }))]}
        />
        <Select
          label="Country" value={filters.country} onChange={(v) => set('country', v)}
          options={[{ value: '', label: 'All countries' }, ...options.countries]}
        />
        <Select
          label="Source" value={filters.source} onChange={(v) => set('source', v)}
          options={[{ value: '', label: 'All sources' }, ...options.sources.map((s) => ({ value: s, label: s }))]}
        />
        {dimsActive && (
          <button type="button" className="adm-filters__reset" onClick={reset}>Clear filters</button>
        )}
      </div>

      <div className="adm-stats">
        <Stat label="Unique visitors" value={uniqueVisitors} accent={C.blue} />
        <Stat label="Total views" value={views} accent={C.aqua} />
        <Stat label="Sessions" value={sessions} accent={C.violet} />
        <Stat label="Pages / session" value={pagesPerSession || '—'} accent={C.orange} />
      </div>
      <div className="adm-stats">
        <Stat label="Median time on page" value={medianSeconds ? formatSeconds(medianSeconds) : '—'} accent={C.magenta} />
        <Stat label="Avg scroll depth" value={avgScroll == null ? '—' : `${avgScroll}%`} accent={C.yellow} />
        <Stat label="Likes" value={likeCount} accent={C.red} />
        <Stat label="Feedback" value={feedback.length} accent={C.green} />
      </div>

      <section className="adm-panel" style={{ marginBottom: 20 }}>
        <h3 className="adm-h3">Visitors — last {filters.windowDays} days</h3>
        {hasTrend ? (
          <>
            <TrendChart series={series} />
            <div className="adm-chart-legend">
              <span><i style={{ background: C.blue, opacity: 0.28 }} /> Views</span>
              <span><i style={{ background: C.blue }} /> Unique visitors</span>
            </div>
          </>
        ) : (
          <p className="adm-muted">No activity in this window yet.</p>
        )}
      </section>

      {(newVisitors > 0 || returningVisitors > 0) && (
        <section className="adm-panel" style={{ marginBottom: 20 }}>
          <h3 className="adm-h3">New vs returning visitors</h3>
          <SplitBar
            parts={[
              { label: 'New', value: newVisitors, color: C.orange },
              { label: 'Returning', value: returningVisitors, color: C.blue },
            ]}
          />
        </section>
      )}

      {configured && !hasEnrichment && !dimsActive && (
        <div className="adm-notice">
          No location, device or click data in this window yet — these panels fill in as visitors arrive.
        </div>
      )}

      <div className="adm-grid2 adm-grid2--wide">
        <Breakdown title="Countries" rows={countries} color={C.blue} empty="No location data yet." unit="visitors" />
        <Breakdown title="Cities" rows={cities} color={C.aqua} empty="No city data yet — depends on your hosting plan." unit="visitors" />
      </div>
      <div className="adm-grid2 adm-grid2--wide">
        <Donut title="Devices" rows={devices} empty="No device data yet." unit="visitors" />
        <Donut title="Browsers" rows={browsers} empty="No browser data yet." unit="visitors" />
      </div>
      <div className="adm-grid2 adm-grid2--wide">
        <Donut title="Traffic sources" rows={sources} empty="No referrer data yet." unit="visitors" />
        <section className="adm-panel">
          <h3 className="adm-h3"><i className="adm-dot-c" style={{ background: C.yellow }} /> Most clicked</h3>
          {clicks.length === 0 ? (
            <p className="adm-muted">No clicks recorded yet.</p>
          ) : (
            <ul className="adm-bars">
              {clicks.map((c) => (
                <li key={c.key} className="adm-bar">
                  <div className="adm-bar__head">
                    <span className="adm-bar__label"><span className="adm-tag">{c.name}</span> {c.label}</span>
                    <span className="adm-bar__nums">{c.count} clicks · {c.uniques} people</span>
                  </div>
                  <div className="adm-bar__track">
                    <div className="adm-bar__fill" style={{ width: `${(c.count / Math.max(1, clicks[0].count)) * 100}%`, background: C.yellow }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="adm-panel" style={{ marginBottom: 20 }}>
        <h3 className="adm-h3"><i className="adm-dot-c" style={{ background: C.green }} /> By page</h3>
        {pages.length === 0 ? (
          <p className="adm-muted">No visits logged in this window.</p>
        ) : (
          <ul className="adm-bars">
            {pages.map((p) => {
              const max = Math.max(1, ...pages.map((x) => x.uniques))
              return (
                <li key={p.path} className="adm-bar">
                  <div className="adm-bar__head">
                    <span className="adm-bar__label">{p.label}</span>
                    <span className="adm-bar__nums">
                      {p.uniques} unique · {p.views} views · ♥ {p.likes}
                      {p.medianSeconds ? ` · ${formatSeconds(p.medianSeconds)}` : ''}
                      {p.avgScroll == null ? '' : ` · ${p.avgScroll}% read`}
                    </span>
                  </div>
                  <div className="adm-bar__track">
                    <div className="adm-bar__fill" style={{ width: `${(p.uniques / max) * 100}%`, background: C.green }} />
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <section className="adm-panel">
        <h3 className="adm-h3">Visitor feedback</h3>
        {feedback.length === 0 ? (
          <p className="adm-muted">No feedback yet.</p>
        ) : (
          <div className="adm-feedback">
            {feedback.map((f) => (
              <div key={f.id} className="adm-feedback__item">
                <div className="adm-feedback__meta">{new Date(f.created_at).toLocaleString()} · {f.path}</div>
                <p className="adm-feedback__msg">{f.message}</p>
                <div className="adm-feedback__author">— {f.name || 'Anonymous'}</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s)

function Select({ label, value, onChange, options }) {
  return (
    <label className="adm-select">
      <span className="adm-select__label">{label}</span>
      <select className="adm-select__input" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  )
}

// One reusable ranked list, tinted with the panel's hue.
function Breakdown({ title, rows, color, empty, unit = 'visitors' }) {
  const max = Math.max(1, ...rows.map((r) => r.uniques))
  return (
    <section className="adm-panel">
      <h3 className="adm-h3"><i className="adm-dot-c" style={{ background: color }} /> {title}</h3>
      {rows.length === 0 ? (
        <p className="adm-muted">{empty}</p>
      ) : (
        <ul className="adm-bars">
          {rows.map((r) => (
            <li key={r.key} className="adm-bar" title={`${r.label}: ${r.uniques} ${unit} · ${r.views} views`}>
              <div className="adm-bar__head">
                <span className="adm-bar__label">{r.label}</span>
                <span className="adm-bar__nums">{r.uniques} {unit} · {r.views} views</span>
              </div>
              <div className="adm-bar__track">
                <div className="adm-bar__fill" style={{ width: `${(r.uniques / max) * 100}%`, background: color }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function SplitBar({ parts }) {
  const total = Math.max(1, parts.reduce((a, p) => a + p.value, 0))
  return (
    <>
      <div className="adm-split">
        {parts.map((p) => (
          <div key={p.label} className="adm-split__seg" style={{ width: `${(p.value / total) * 100}%`, background: p.color }} />
        ))}
      </div>
      <div className="adm-chart-legend">
        {parts.map((p) => (
          <span key={p.label}>
            <i style={{ background: p.color }} />
            {p.label} — {p.value} ({Math.round((p.value / total) * 100)}%)
          </span>
        ))}
      </div>
    </>
  )
}

function formatSeconds(s) {
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  const rem = s % 60
  return rem ? `${m}m ${rem}s` : `${m}m`
}

// Views as a filled area, unique visitors as a line on top — one shared scale
// (views ≥ uniques). Hovering reveals a crosshair + tooltip so exact daily
// values are readable, which flat bars never showed.
function TrendChart({ series }) {
  const [hi, setHi] = useState(null)
  const W = 720, H = 210, padL = 30, padR = 14, padT = 16, padB = 26
  const iw = W - padL - padR, ih = H - padT - padB
  const n = series.length
  const max = Math.max(1, ...series.map((d) => d.views))
  const x = (i) => padL + (iw / (n - 1 || 1)) * i
  const y = (v) => padT + ih - (v / max) * ih
  const yBase = padT + ih
  const labelEvery = Math.max(1, Math.ceil(n / 10))

  const areaPts = series.map((d, i) => `${x(i).toFixed(1)},${y(d.views).toFixed(1)}`)
  const area = `M ${x(0)},${yBase} L ${areaPts.join(' L ')} L ${x(n - 1)},${yBase} Z`
  const viewsLine = `M ${areaPts.join(' L ')}`
  const uniqLine = 'M ' + series.map((d, i) => `${x(i).toFixed(1)},${y(d.uniques).toFixed(1)}`).join(' L ')

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const frac = (e.clientX - r.left) / r.width
    const vx = frac * W
    const i = Math.max(0, Math.min(n - 1, Math.round(((vx - padL) / (iw || 1)) * (n - 1))))
    setHi(i)
  }

  const hd = hi != null ? series[hi] : null

  return (
    <div className="adm-trend" onMouseMove={onMove} onMouseLeave={() => setHi(null)}>
      <svg className="adm-chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" role="img" aria-label={`Visitors over the last ${n} days`}>
        <defs>
          <linearGradient id="admTrendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a78d6" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#2a78d6" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <line x1={padL} y1={yBase} x2={W - padR} y2={yBase} stroke="#c3c2b7" />
        <text className="adm-chart__axis" x={padL - 6} y={padT + 4} textAnchor="end">{max}</text>
        <path d={area} fill="url(#admTrendFill)" />
        <path d={viewsLine} fill="none" stroke="#2a78d6" strokeOpacity="0.5" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
        <path d={uniqLine} fill="none" stroke="#2a78d6" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {hd && (
          <g>
            <line x1={x(hi)} y1={padT} x2={x(hi)} y2={yBase} stroke="#2a78d6" strokeOpacity="0.4" strokeDasharray="3 3" />
            <circle cx={x(hi)} cy={y(hd.views)} r="3.2" fill="#fff" stroke="#2a78d6" strokeWidth="1.6" strokeOpacity="0.6" />
            <circle cx={x(hi)} cy={y(hd.uniques)} r="4" fill="#2a78d6" stroke="#fff" strokeWidth="1.6" />
          </g>
        )}
        {series.map((d, i) => ((i % labelEvery === 0 || i === n - 1) ? (
          <text key={`t${i}`} className="adm-chart__axis" x={x(i)} y={H - 6} textAnchor="middle">{d.date.slice(5)}</text>
        ) : null))}
      </svg>
      {hd && (
        <div className="adm-trend__tip" style={{ left: `${(x(hi) / W) * 100}%` }}>
          <div className="adm-trend__tip-date">{hd.date}</div>
          <div><b>{hd.uniques}</b> unique · <b>{hd.views}</b> views</div>
        </div>
      )}
    </div>
  )
}

// Share-of-total as a ring. Slices in fixed categorical order, folded past five
// into "Other", with a legend carrying the exact values (never color alone).
function Donut({ title, rows, empty, unit = 'visitors' }) {
  const useViews = rows.every((r) => !r.uniques)
  let data = rows.map((r) => ({ label: r.label, value: useViews ? r.views : r.uniques })).filter((d) => d.value > 0)
  if (data.length > 5) {
    const rest = data.slice(5).reduce((s, d) => s + d.value, 0)
    data = [...data.slice(0, 5), { label: 'Other', value: rest }]
  }
  const total = data.reduce((s, d) => s + d.value, 0)

  const R = 54, SW = 20, CX = 66, CY = 66, CIRC = 2 * Math.PI * R
  const gap = data.length > 1 ? 5 : 0
  let acc = 0
  const arcs = data.map((d, i) => {
    const frac = d.value / total
    const len = Math.max(0.5, frac * CIRC - gap)
    const el = (
      <circle
        key={d.label} cx={CX} cy={CY} r={R} fill="none" stroke={PALETTE[i % PALETTE.length]} strokeWidth={SW}
        strokeDasharray={`${len} ${CIRC - len}`} strokeDashoffset={-acc * CIRC}
        transform={`rotate(-90 ${CX} ${CY})`}
      />
    )
    acc += frac
    return el
  })

  return (
    <section className="adm-panel">
      <h3 className="adm-h3"><i className="adm-dot-c" style={{ background: PALETTE[0] }} /> {title}</h3>
      {data.length === 0 ? (
        <p className="adm-muted">{empty}</p>
      ) : (
        <div className="adm-donut">
          <svg className="adm-donut__svg" viewBox="0 0 132 132" role="img" aria-label={title}>
            {arcs}
            <text className="adm-donut__center-v" x={CX} y={CY - 2} textAnchor="middle">{total}</text>
            <text className="adm-donut__center-l" x={CX} y={CY + 14} textAnchor="middle">{unit}</text>
          </svg>
          <ul className="adm-donut__legend">
            {data.map((d, i) => (
              <li className="adm-donut__row" key={d.label}>
                <span className="adm-donut__sw" style={{ background: PALETTE[i % PALETTE.length] }} />
                <span className="adm-donut__label">{d.label}</span>
                <span className="adm-donut__val">{d.value} · {Math.round((d.value / total) * 100)}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

function Stat({ label, value, accent }) {
  return (
    <div className="adm-stat">
      <div className="adm-stat__value">{value}</div>
      <div className="adm-stat__label">{accent && <i className="adm-dot-c" style={{ background: accent }} />}{label}</div>
    </div>
  )
}
