// Read-only dashboard for the dynamic data that lives in Supabase: who
// visited, where from, on what, what they clicked and how far they read.
// Degrades gracefully when Supabase isn't configured yet, and when the
// enrichment migration hasn't been run the newer panels simply sit empty.
export default function Analytics({
  pages = [],
  feedback = [],
  totals = {},
  series = [],
  countries = [],
  cities = [],
  devices = [],
  browsers = [],
  sources = [],
  clicks = [],
  windowDays = 90,
  configured,
}) {
  const {
    uniqueVisitors = 0, views = 0, likes = 0, sessions = 0, pagesPerSession = 0,
    medianSeconds = 0, avgScroll = null, newVisitors = 0, returningVisitors = 0,
  } = totals

  const maxUniques = Math.max(1, ...pages.map((p) => p.uniques))
  const hasTrend = series.some((d) => d.views > 0 || d.uniques > 0)
  const hasEnrichment = countries.length > 0 || devices.length > 0 || clicks.length > 0

  return (
    <div>
      <div className="adm-section-head">
        <div>
          <h2 className="adm-h2">Analytics &amp; feedback</h2>
          <p className="adm-muted">
            Live visitor data from Supabase · last {windowDays} days
            {' · '}likes and feedback all-time
          </p>
        </div>
      </div>

      {!configured && (
        <div className="adm-notice">
          Supabase isn&apos;t configured yet. Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and keys to
          <code> .env.local</code> to see visitors, likes and feedback here. Content management works without it.
        </div>
      )}

      {configured && !hasEnrichment && (
        <div className="adm-notice">
          No location, device or click data yet. Run the
          <code> 20260724000000_analytics_enrichment.sql </code>
          migration in Supabase, then visit the live site once — these panels fill in from there.
        </div>
      )}

      <div className="adm-stats">
        <Stat label="Unique visitors" value={uniqueVisitors} />
        <Stat label="Total views" value={views} />
        <Stat label="Sessions" value={sessions} />
        <Stat label="Pages / session" value={pagesPerSession || '—'} />
      </div>
      <div className="adm-stats">
        <Stat label="Median time on page" value={medianSeconds ? formatSeconds(medianSeconds) : '—'} />
        <Stat label="Avg scroll depth" value={avgScroll === null || avgScroll === undefined ? '—' : `${avgScroll}%`} />
        <Stat label="Likes" value={likes} />
        <Stat label="Feedback" value={feedback.length} />
      </div>

      <section className="adm-panel" style={{ marginBottom: 20 }}>
        <h3 className="adm-h3">Visitors — last 14 days</h3>
        {hasTrend ? (
          <>
            <TrendChart series={series} />
            <div className="adm-chart-legend">
              <span><i style={{ background: 'rgba(12,12,12,.16)' }} /> Views</span>
              <span><i style={{ background: 'var(--ink)' }} /> Unique visitors</span>
            </div>
          </>
        ) : (
          <p className="adm-muted">No activity in the last 14 days yet.</p>
        )}
      </section>

      {/* New vs returning — the single clearest signal of whether the site is
          building an audience or just collecting one-off drive-by traffic. */}
      {(newVisitors > 0 || returningVisitors > 0) && (
        <section className="adm-panel" style={{ marginBottom: 20 }}>
          <h3 className="adm-h3">New vs returning visitors</h3>
          <SplitBar
            parts={[
              { label: 'New', value: newVisitors },
              { label: 'Returning', value: returningVisitors },
            ]}
          />
        </section>
      )}

      <div className="adm-grid2 adm-grid2--wide">
        <Breakdown title="Countries" rows={countries} empty="No location data yet." unit="visitors" />
        <Breakdown title="Cities" rows={cities} empty="No city data yet — this depends on your Vercel plan." unit="visitors" />
      </div>

      <div className="adm-grid2 adm-grid2--wide">
        <Breakdown title="Devices" rows={devices} empty="No device data yet." unit="visitors" />
        <Breakdown title="Browsers" rows={browsers} empty="No browser data yet." unit="visitors" />
      </div>

      <div className="adm-grid2 adm-grid2--wide">
        <Breakdown title="Traffic sources" rows={sources} empty="No referrer data yet." unit="visitors" />

        <section className="adm-panel">
          <h3 className="adm-h3">Most clicked</h3>
          {clicks.length === 0 ? (
            <p className="adm-muted">No clicks recorded yet.</p>
          ) : (
            <ul className="adm-bars">
              {clicks.map((c) => (
                <li key={c.key} className="adm-bar">
                  <div className="adm-bar__head">
                    <span className="adm-bar__label">
                      <span className="adm-tag">{c.name}</span> {c.label}
                    </span>
                    <span className="adm-bar__nums">
                      {c.count} clicks · {c.uniques} people
                    </span>
                  </div>
                  <div className="adm-bar__track">
                    <div
                      className="adm-bar__fill"
                      style={{ width: `${(c.count / Math.max(1, clicks[0].count)) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="adm-panel" style={{ marginBottom: 20 }}>
        <h3 className="adm-h3">By page</h3>
        {pages.length === 0 ? (
          <p className="adm-muted">No visits logged yet.</p>
        ) : (
          <ul className="adm-bars">
            {pages.map((p) => (
              <li key={p.path} className="adm-bar">
                <div className="adm-bar__head">
                  <span className="adm-bar__label">{p.label}</span>
                  <span className="adm-bar__nums">
                    {p.uniques} unique · {p.views} views · ♥ {p.likes}
                    {p.medianSeconds ? ` · ${formatSeconds(p.medianSeconds)}` : ''}
                    {p.avgScroll === null || p.avgScroll === undefined ? '' : ` · ${p.avgScroll}% read`}
                  </span>
                </div>
                <div className="adm-bar__track">
                  <div className="adm-bar__fill" style={{ width: `${(p.uniques / maxUniques) * 100}%` }} />
                </div>
              </li>
            ))}
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
                <div className="adm-feedback__meta">
                  {new Date(f.created_at).toLocaleString()} · {f.path}
                </div>
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

// One reusable ranked list. Bars are scaled against the top row rather than
// the total, so small differences further down stay visible.
function Breakdown({ title, rows, empty, unit = 'visitors' }) {
  const max = Math.max(1, ...rows.map((r) => r.uniques))
  return (
    <section className="adm-panel">
      <h3 className="adm-h3">{title}</h3>
      {rows.length === 0 ? (
        <p className="adm-muted">{empty}</p>
      ) : (
        <ul className="adm-bars">
          {rows.map((r) => (
            <li key={r.key} className="adm-bar">
              <div className="adm-bar__head">
                <span className="adm-bar__label">{r.label}</span>
                <span className="adm-bar__nums">
                  {r.uniques} {unit} · {r.views} views
                </span>
              </div>
              <div className="adm-bar__track">
                <div className="adm-bar__fill" style={{ width: `${(r.uniques / max) * 100}%` }} />
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
        {parts.map((p, i) => (
          <div
            key={p.label}
            className="adm-split__seg"
            style={{
              width: `${(p.value / total) * 100}%`,
              background: i === 0 ? 'var(--ink)' : 'rgba(12,12,12,.16)',
            }}
          />
        ))}
      </div>
      <div className="adm-chart-legend">
        {parts.map((p, i) => (
          <span key={p.label}>
            <i style={{ background: i === 0 ? 'var(--ink)' : 'rgba(12,12,12,.16)' }} />
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

// Inline SVG chart — daily views as bars, unique visitors as a line.
// No dependency; colors come from the site's CSS vars.
function TrendChart({ series }) {
  const W = 720, H = 200, padL = 26, padR = 12, padT = 12, padB = 22
  const iw = W - padL - padR, ih = H - padT - padB
  const n = series.length
  const max = Math.max(1, ...series.map((d) => d.views))
  const x = (i) => padL + (iw / n) * (i + 0.5)
  const y = (v) => padT + ih - (v / max) * ih
  const bw = (iw / n) * 0.5
  const line = series.map((d, i) => `${x(i).toFixed(1)},${y(d.uniques).toFixed(1)}`).join(' ')

  return (
    <svg className="adm-chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" role="img" aria-label="Visitors over the last 14 days">
      <line x1={padL} y1={padT + ih} x2={W - padR} y2={padT + ih} stroke="rgba(12,12,12,.15)" />
      <text className="adm-chart__axis" x={padL - 4} y={padT + 8} textAnchor="end">{max}</text>
      {series.map((d, i) => {
        const h = (d.views / max) * ih
        return <rect key={`b${i}`} x={x(i) - bw / 2} y={padT + ih - h} width={bw} height={h} rx="2" fill="rgba(12,12,12,.16)" />
      })}
      <polyline points={line} fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {series.map((d, i) => <circle key={`c${i}`} cx={x(i)} cy={y(d.uniques)} r="2.6" fill="var(--ink)" />)}
      {series.map((d, i) => ((i % 3 === 0 || i === n - 1) ? (
        <text key={`t${i}`} className="adm-chart__axis" x={x(i)} y={H - 6} textAnchor="middle">{d.date.slice(5)}</text>
      ) : null))}
    </svg>
  )
}

function Stat({ label, value }) {
  return (
    <div className="adm-stat">
      <div className="adm-stat__value">{value}</div>
      <div className="adm-stat__label">{label}</div>
    </div>
  )
}
