// Read-only dashboard for the dynamic data that lives in Supabase:
// unique visitors, page views, likes and feedback. Degrades gracefully
// when Supabase isn't configured yet.
export default function Analytics({ pages = [], feedback = [], totals = {}, configured }) {
  const { uniqueVisitors = 0, views = 0, likes = 0 } = totals
  const maxUniques = Math.max(1, ...pages.map((p) => p.uniques))

  return (
    <div>
      <div className="adm-section-head">
        <div>
          <h2 className="adm-h2">Analytics &amp; feedback</h2>
          <p className="adm-muted">Live visitor data from Supabase</p>
        </div>
      </div>

      {!configured && (
        <div className="adm-notice">
          Supabase isn&apos;t configured yet. Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and keys to
          <code> .env.local</code> to see visitors, likes and feedback here. Content management works without it.
        </div>
      )}

      <div className="adm-stats">
        <Stat label="Unique visitors" value={uniqueVisitors} />
        <Stat label="Total views" value={views} />
        <Stat label="Likes" value={likes} />
        <Stat label="Feedback" value={feedback.length} />
      </div>

      <div className="adm-grid2 adm-grid2--wide">
        <section className="adm-panel">
          <h3 className="adm-h3">By page — unique visitors</h3>
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
    </div>
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
