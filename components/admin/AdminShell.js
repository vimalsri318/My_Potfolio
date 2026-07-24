import Head from 'next/head'
import Link from 'next/link'

// The admin chrome + all admin styling. Matches the site's light
// "paper & ink" editorial theme (see styles/globals.css). Local-only.
export default function AdminShell({ tabs, active, onSelect, children }) {
  return (
    <div className="adm">
      <Head>
        <title>Studio · Local Admin</title>
        <meta name="robots" content="noindex" />
      </Head>

      <header className="adm-top">
        <div className="adm-top__brand">
          <span className="adm-dot" />
          <span className="adm-top__title">Studio</span>
          <span className="adm-top__tag">local only</span>
        </div>
        <nav className="adm-tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`adm-tab ${active === t.id ? 'is-active' : ''}`}
              onClick={() => onSelect(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <Link href="/" className="adm-top__back">View site ↗</Link>
      </header>

      <main className="adm-main">{children}</main>

      <style jsx global>{`
        .adm {
          /* Map admin tokens onto the site's light paper/ink palette. */
          --panel: var(--white);
          --panel-2: #f7f7f4;
          --line-soft: rgba(12, 12, 12, 0.08);
          --text: var(--ink);
          --muted: var(--ink-soft);
          --accent: var(--ink);
          --on-accent: var(--paper);
          --danger: #b42318;

          min-height: 100vh;
          background-color: var(--paper);
          /* graph paper — same as the site body */
          background-image: linear-gradient(var(--grid-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
          background-size: 32px 32px;
          color: var(--ink);
          font-family: var(--font-body);
          -webkit-font-smoothing: antialiased;
        }
        .adm * { box-sizing: border-box; }

        .adm-top {
          position: sticky; top: 0; z-index: 20;
          display: flex; align-items: center; gap: 24px;
          padding: 14px 28px;
          background: rgba(241, 241, 238, 0.88); backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--ink);
        }
        .adm-top__brand { display: flex; align-items: center; gap: 10px; }
        .adm-dot { width: 11px; height: 11px; border-radius: 50%; background: var(--ink); }
        .adm-top__title { font-family: var(--font-batangas); font-size: 22px; line-height: 1; }
        .adm-top__tag { font-family: var(--font-mono); font-size: 10.5px; text-transform: uppercase;
          letter-spacing: .08em; color: var(--muted);
          border: 1px solid var(--line); padding: 3px 8px; border-radius: 999px; }
        .adm-tabs { display: flex; gap: 4px; margin-left: 8px; }
        .adm-tab {
          background: transparent; color: var(--muted); border: none;
          padding: 8px 14px; border-radius: 999px; cursor: pointer;
          font-family: var(--font-mono); font-size: 12px; text-transform: uppercase;
          letter-spacing: .06em; transition: .15s;
        }
        .adm-tab:hover { color: var(--ink); background: rgba(12,12,12,.05); }
        .adm-tab.is-active { color: var(--on-accent); background: var(--ink); }
        .adm-top__back { margin-left: auto; color: var(--muted);
          text-decoration: none; font-family: var(--font-mono); font-size: 12px;
          text-transform: uppercase; letter-spacing: .06em; }
        .adm-top__back:hover { color: var(--ink); }

        .adm-main { max-width: 1080px; margin: 0 auto; padding: 40px 28px 120px; }

        .adm-h2 { font-family: var(--font-batangas); font-size: 30px; font-weight: 400;
          margin: 0; line-height: 1.05; letter-spacing: -.01em; }
        .adm-h3 { font-size: 14px; font-weight: 600; margin: 0 0 14px; }
        .adm-muted { color: var(--muted); font-size: 14px; margin: 6px 0 0; }

        .adm-section-head { display: flex; justify-content: space-between;
          align-items: flex-end; margin-bottom: 26px; gap: 16px; }

        /* Buttons */
        .adm-btn {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: var(--font-mono); font-size: 12px; text-transform: uppercase;
          letter-spacing: .05em; font-weight: 500;
          padding: 9px 15px; border-radius: 999px; cursor: pointer;
          border: 1px solid var(--ink); background: var(--white);
          color: var(--ink); text-decoration: none; transition: .15s; white-space: nowrap;
        }
        .adm-btn:hover { background: var(--ink); color: var(--on-accent); }
        .adm-btn--primary { background: var(--ink); border-color: var(--ink); color: var(--on-accent); }
        .adm-btn--primary:hover { background: #2a2a2a; }
        .adm-btn--danger { color: var(--danger); border-color: rgba(180,35,24,.4); background: var(--white); }
        .adm-btn--danger:hover { background: var(--danger); border-color: var(--danger); color: #fff; }
        .adm-btn:disabled { opacity: .5; cursor: default; }
        .adm-btn:disabled:hover { background: var(--white); color: var(--ink); }
        .adm-btn--primary:disabled:hover { background: var(--ink); color: var(--on-accent); }

        /* Cards / rows (list views) */
        .adm-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 18px; }
        .adm-card { background: var(--white); border: 1px solid var(--line);
          border-radius: 4px; overflow: hidden; display: flex; flex-direction: column; }
        .adm-card__thumb { aspect-ratio: 16/9; background: var(--panel-2);
          display: flex; align-items: center; justify-content: center; overflow: hidden;
          border-bottom: 1px solid var(--line); }
        .adm-card__thumb img { width: 100%; height: 100%; object-fit: cover; }
        .adm-card__body { padding: 16px 18px 6px; }
        .adm-card__title { font-family: var(--font-batangas); font-size: 19px; }
        .adm-card__meta { color: var(--muted); font-family: var(--font-mono); font-size: 11.5px;
          text-transform: uppercase; letter-spacing: .04em; margin-top: 5px;
          display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .adm-card__actions { display: flex; gap: 8px; padding: 16px 18px; margin-top: auto; align-items: center; }
        .adm-card__publish { padding: 0 18px; display: flex; }
        .adm-badge { font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; letter-spacing: .05em;
          color: var(--ink); border: 1px solid var(--line);
          background: rgba(12,12,12,.05); padding: 2px 7px; border-radius: 999px; }

        .adm-rows { display: flex; flex-direction: column; gap: 10px; }
        .adm-row { display: flex; align-items: center; justify-content: space-between;
          gap: 16px; background: var(--white); border: 1px solid var(--line);
          border-radius: 4px; padding: 16px 20px; }

        /* Editor */
        .adm-editor__top { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
        .adm-editor__top .adm-h2 { flex: 0 1 auto; }
        .adm-editor__actions { margin-left: auto; display: flex; gap: 10px; }
        .adm-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 20px; margin-bottom: 4px; }
        .adm-grid2--wide { align-items: start; margin-top: 8px; margin-bottom: 20px; }
        @media (max-width: 760px) { .adm-grid2 { grid-template-columns: 1fr; } }

        .adm-field { display: flex; flex-direction: column; gap: 7px; margin: 14px 0; }
        .adm-field--wide { margin: 18px 0; }
        .adm-field__label { font-family: var(--font-mono); font-size: 11px; font-weight: 500; color: var(--muted);
          text-transform: uppercase; letter-spacing: .07em; }
        .adm-field__hint { font-size: 12px; color: var(--muted); }
        .adm-field__hint code, .adm-notice code { background: rgba(12,12,12,.06);
          padding: 1px 5px; border-radius: 4px; font-size: 11.5px; font-family: var(--font-mono); }

        .adm-input {
          width: 100%; font-family: var(--font-body); font-size: 14px; color: var(--ink);
          background: var(--white); border: 1px solid var(--line);
          border-radius: 6px; padding: 10px 12px; transition: .15s; resize: vertical;
        }
        .adm-input:focus { outline: none; border-color: var(--ink);
          box-shadow: 0 0 0 3px rgba(12,12,12,.1); }
        .adm-input--mono { font-family: var(--font-mono); font-size: 13px; }
        .adm-input::placeholder { color: rgba(12,12,12,.32); }

        /* String / pair lists */
        .adm-list { display: flex; flex-direction: column; gap: 8px; }
        .adm-list__row { display: flex; gap: 8px; align-items: flex-start; }
        .adm-list__row .adm-input { flex: 1; }
        .adm-list__ctrls { display: flex; gap: 4px; padding-top: 2px; }
        .adm-icon { width: 32px; height: 36px; border-radius: 6px; cursor: pointer;
          border: 1px solid var(--line); background: var(--white); color: var(--muted); font-size: 13px;
          transition: .15s; }
        .adm-icon:hover { color: var(--ink); border-color: var(--ink); }
        .adm-icon--danger:hover { color: #fff; background: var(--danger); border-color: var(--danger); }

        /* Image field */
        .adm-image { display: flex; gap: 16px; align-items: flex-start; }
        .adm-image__preview { width: 168px; height: 104px; flex: none; border-radius: 6px;
          overflow: hidden; background: var(--panel-2); border: 1px solid var(--line);
          display: flex; align-items: center; justify-content: center; }
        .adm-image__preview img { width: 100%; height: 100%; object-fit: cover; }
        .adm-image__empty { color: rgba(12,12,12,.35); font-family: var(--font-mono);
          font-size: 11px; text-transform: uppercase; letter-spacing: .05em; }
        .adm-image__side { flex: 1; display: flex; flex-direction: column; gap: 8px; }
        .adm-upload { cursor: pointer; align-self: flex-start; }
        .adm-upload input { display: none; }

        .adm-gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px,1fr));
          gap: 10px; margin-bottom: 12px; }
        .adm-gallery__item { position: relative; aspect-ratio: 4/3; border-radius: 6px;
          overflow: hidden; border: 1px solid var(--line); }
        .adm-gallery__item img { width: 100%; height: 100%; object-fit: cover; }
        .adm-gallery__rm { position: absolute; top: 6px; right: 6px; background: rgba(255,255,255,.85); }

        /* Block editor */
        .adm-blocks { display: flex; flex-direction: column; gap: 12px; }
        .adm-block { border: 1px solid var(--line); border-radius: 6px; overflow: hidden;
          background: var(--white); }
        .adm-block__bar { display: flex; align-items: center; justify-content: space-between;
          padding: 9px 12px; background: var(--panel-2); border-bottom: 1px solid var(--line-soft); }
        .adm-block__type { font-family: var(--font-mono); font-size: 10.5px; text-transform: uppercase; letter-spacing: .07em;
          color: var(--muted); font-weight: 600; }
        .adm-block__body { padding: 14px; display: flex; flex-direction: column; gap: 10px; }
        .adm-block__add { margin-top: 6px; }
        .adm-block__add-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }

        .adm-divider { display: flex; align-items: center; gap: 14px; margin: 32px 0 18px; }
        .adm-divider::before, .adm-divider::after { content: ''; height: 1px; background: var(--line); flex: 1; }
        .adm-divider span { font-family: var(--font-mono); font-size: 11px; text-transform: uppercase;
          letter-spacing: .1em; color: var(--muted); }

        .adm-interactive { border: 1px solid var(--line); border-radius: 6px; padding: 16px; background: var(--white); }
        .adm-interactive__actions { display: flex; gap: 10px; flex-wrap: wrap; margin: 12px 0 8px; }

        /* Analytics */
        .adm-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 26px; }
        /* Two stat rows stack tighter than a row followed by a panel. */
        .adm-stats + .adm-stats { margin-top: -12px; }
        @media (max-width: 700px) { .adm-stats { grid-template-columns: repeat(2,1fr); } }
        .adm-stat { background: var(--white); border: 1px solid var(--line); border-radius: 4px; padding: 20px; }
        .adm-stat__value { font-family: var(--font-batangas); font-size: 36px; line-height: 1; }
        .adm-stat__label { color: var(--muted); font-family: var(--font-mono); font-size: 11px;
          text-transform: uppercase; letter-spacing: .05em; margin-top: 8px; }
        .adm-panel { background: var(--white); border: 1px solid var(--line); border-radius: 6px; padding: 22px; }
        .adm-bars { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 14px; }
        .adm-bar__head { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px; gap: 12px; }
        .adm-bar__label { font-family: var(--font-mono); font-size: 12px; }
        .adm-bar__nums { color: var(--muted); font-family: var(--font-mono); font-size: 12px; white-space: nowrap; }
        .adm-bar__track { height: 8px; background: rgba(12,12,12,.07); border-radius: 999px; overflow: hidden; }
        .adm-bar__fill { height: 100%; background: var(--ink); border-radius: 999px; }
        .adm-tag { display: inline-block; background: rgba(12,12,12,.07); border-radius: 3px;
          padding: 1px 5px; font-size: 10px; text-transform: uppercase; letter-spacing: .05em;
          color: var(--muted); margin-right: 4px; vertical-align: 1px; }
        .adm-split { display: flex; height: 10px; border-radius: 999px; overflow: hidden;
          background: rgba(12,12,12,.07); }
        .adm-split__seg { height: 100%; }
        .adm-feedback { display: flex; flex-direction: column; gap: 12px; max-height: 460px; overflow: auto; }
        .adm-feedback__item { background: var(--panel-2); border: 1px solid var(--line-soft); border-radius: 6px; padding: 14px; }
        .adm-feedback__meta { font-family: var(--font-mono); font-size: 11px; color: var(--muted); margin-bottom: 8px;
          text-transform: uppercase; letter-spacing: .04em; }
        .adm-feedback__msg { margin: 0 0 8px; white-space: pre-wrap; font-size: 14px; }
        .adm-feedback__author { font-size: 13px; font-weight: 600; }

        /* Toggle switch */
        .adm-toggle-wrap { display: inline-flex; align-items: center; gap: 10px; }
        .adm-toggle { width: 42px; height: 24px; border-radius: 999px; padding: 0;
          border: 1px solid var(--line); background: #e4e4df; cursor: pointer;
          position: relative; transition: .18s; flex: none; }
        .adm-toggle__knob { position: absolute; top: 2px; left: 2px; width: 18px; height: 18px;
          border-radius: 50%; background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,.25); transition: .18s; }
        .adm-toggle.is-on { background: var(--ink); border-color: var(--ink); }
        .adm-toggle.is-on .adm-toggle__knob { left: 22px; }
        .adm-toggle:disabled { opacity: .5; cursor: default; }
        .adm-toggle__label { font-family: var(--font-mono); font-size: 11px; text-transform: uppercase;
          letter-spacing: .05em; color: var(--muted); }
        .adm-toggle__label.is-on { color: var(--ink); }

        /* Sections list */
        .adm-toggle-rows { display: flex; flex-direction: column; gap: 10px; }
        .adm-toggle-row { display: flex; align-items: center; justify-content: space-between;
          gap: 16px; background: var(--white); border: 1px solid var(--line);
          border-radius: 10px; padding: 16px 20px; }
        .adm-toggle-row--master { border-color: var(--ink); }
        .adm-toggle-row__title { font-weight: 600; }
        .adm-toggle-row__hint { color: var(--muted); font-size: 12.5px; margin-top: 2px; }

        /* Simple chart */
        .adm-chart { width: 100%; height: auto; display: block; }
        .adm-chart__axis { fill: var(--muted); font-family: var(--font-mono); font-size: 9px; }
        .adm-chart-legend { display: flex; gap: 16px; margin-top: 10px; font-family: var(--font-mono);
          font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: .04em; }
        .adm-chart-legend span { display: inline-flex; align-items: center; gap: 6px; }
        .adm-chart-legend i { width: 10px; height: 10px; border-radius: 2px; display: inline-block; }

        .adm-notice { background: rgba(12,12,12,.04); border: 1px solid var(--line);
          color: var(--ink); border-radius: 6px; padding: 12px 16px; font-size: 13.5px; margin-bottom: 24px; }
        .adm-error { color: var(--danger); font-size: 13px; }
        .adm-error--bar { background: rgba(180,35,24,.07); border: 1px solid rgba(180,35,24,.3);
          padding: 10px 14px; border-radius: 6px; margin-bottom: 16px; }
      `}</style>
    </div>
  )
}
