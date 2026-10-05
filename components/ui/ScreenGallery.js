import { useCallback, useEffect, useState } from 'react'

// Case-study screens: every desktop screen in the same 16:10 tile, every
// phone screen in the same phone tile, so nothing is huge or tiny. Click a
// tile to open it full size; arrows and Esc work in the viewer.
const kindOf = (s) => s.kind || (/-m\.(jpg|png|webp)$/.test(s.src) ? 'phone' : 'desktop')

export default function ScreenGallery({ screens, title }) {
  const list = screens.map((s, i) => ({ ...s, kind: kindOf(s), i }))
  const desktop = list.filter((s) => s.kind === 'desktop')
  const phone = list.filter((s) => s.kind === 'phone')
  const order = [...desktop, ...phone]
  const [open, setOpen] = useState(-1)

  const close = useCallback(() => setOpen(-1), [])
  const step = useCallback((d) => setOpen((o) => (o < 0 ? o : (o + d + order.length) % order.length)), [order.length])

  useEffect(() => {
    if (open < 0) return
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, close, step])

  const tile = (s) => {
    const at = order.indexOf(s)
    return (
      <figure key={s.src} className={`screen-tile screen-tile--${s.kind}`}>
        <button type="button" className="screen-tile__frame" onClick={() => setOpen(at)} aria-label={`Open: ${s.caption || `${title} screen ${at + 1}`}`}>
          <img src={s.src} alt={s.alt || s.caption || `${title} — screen ${at + 1}`} loading="lazy" />
        </button>
        {s.caption && <figcaption>{s.caption}</figcaption>}
      </figure>
    )
  }

  const cur = order[open]
  return (
    <>
      {desktop.length > 0 && <div className="screen-grid screen-grid--desktop">{desktop.map(tile)}</div>}
      {phone.length > 0 && <div className="screen-grid screen-grid--phone">{phone.map(tile)}</div>}

      {cur && (
        <div className="screen-viewer" role="dialog" aria-modal="true" aria-label={cur.caption || title} onClick={close}>
          <figure className={`screen-viewer__figure screen-viewer__figure--${cur.kind}`} onClick={(e) => e.stopPropagation()}>
            <img src={cur.src} alt={cur.alt || cur.caption || title} />
            <figcaption>
              <span>{cur.caption}</span>
              <span className="mono">
                {open + 1} / {order.length}
              </span>
            </figcaption>
          </figure>
          {order.length > 1 && (
            <>
              <button type="button" className="screen-viewer__nav screen-viewer__nav--prev" onClick={(e) => (e.stopPropagation(), step(-1))} aria-label="Previous screen">
                ←
              </button>
              <button type="button" className="screen-viewer__nav screen-viewer__nav--next" onClick={(e) => (e.stopPropagation(), step(1))} aria-label="Next screen">
                →
              </button>
            </>
          )}
          <button type="button" className="screen-viewer__close" onClick={close} aria-label="Close" autoFocus>
            ×
          </button>
        </div>
      )}
    </>
  )
}
