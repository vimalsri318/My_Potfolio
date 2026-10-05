import { useMemo, useState } from 'react'
import ICONS from '../../data/stack-icons.json'
import { GROUPS, STACK, platformOf, resolveStack } from '../../data/stack'

// Brand logos and platform chips. Every logo carries its name: as the
// tooltip on hover/focus, and as the accessible label.
//
// Every entry point takes `stack` (keys from data/stack.js) *and* `tech`
// (the free-text list older projects and published Supabase rows carry)
// and resolves both through resolveStack — so a project shows logos even
// when it has never been given a `stack` array.

function Glyph({ icon, color, mono, size = 18 }) {
  const data = icon && ICONS[icon]
  if (data) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
        <path d={data.path} fill={color || data.hex} />
      </svg>
    )
  }
  return (
    <span className="stack-mono" style={{ '--mono': color || 'var(--ink)', fontSize: size * 0.5 }} aria-hidden="true">
      {mono || '•'}
    </span>
  )
}

const GLOBE = (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9M12 3C9.5 5.6 8.2 8.6 8.2 12s1.3 6.4 3.8 9" />
  </svg>
)
const PROMPT = (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="m5 7 5 5-5 5M12 17h7" />
  </svg>
)

// "Web app · iOS app · Android app" — what a client gets, in plain words.
export function PlatformChips({ platforms, className = '' }) {
  const list = (platforms || []).map(platformOf).filter(Boolean)
  if (!list.length) return null
  return (
    <ul className={`platform-chips ${className}`} aria-label="Built for">
      {list.map((p) => (
        <li key={p.key} className="platform-chip" data-tip={p.note} tabIndex={0}>
          {p.key === 'web' ? GLOBE : p.key === 'cli' ? PROMPT : <Glyph icon={p.icon} color="currentColor" size={15} />}
          {p.label}
        </li>
      ))}
    </ul>
  )
}

// A compact row of logos (the Work rows): names appear on hover. Anything
// without a logo (skills like "Creative Direction") stays a text chip.
export function StackLogos({ stack, tech, max = 7, className = '' }) {
  const { items, extra } = useMemo(() => resolveStack(stack, tech), [stack, tech])
  if (!items.length && !extra.length) return null
  const shown = items.slice(0, max)
  const hiddenLogos = items.slice(max)
  // Logos first; words only fill what's left of the row, the rest roll
  // into the "+N" tooltip.
  const words = extra.slice(0, Math.max(0, max - shown.length))
  const rest = hiddenLogos.length + (extra.length - words.length)
  const restNames = [...hiddenLogos.map(([, t]) => t.name), ...extra.slice(words.length)]
  return (
    <ul className={`stack-logos ${className}`} aria-label="Built with">
      {shown.map(([k, t]) => (
        <li key={k} className="stack-logo" data-tip={t.name} aria-label={t.name} tabIndex={0}>
          <Glyph icon={t.icon} color={t.color} mono={t.mono} />
        </li>
      ))}
      {words.map((w) => (
        <li key={w} className="stack-logo stack-logo--word">
          {w}
        </li>
      ))}
      {rest > 0 && (
        <li className="stack-logo stack-logo--more" data-tip={restNames.join(', ')} tabIndex={0}>
          +{rest}
        </li>
      )}
    </ul>
  )
}

// The case study's full stack, grouped under plain-word headings; each
// piece is its logo, named on hover/focus.
export function StackGroups({ stack, tech }) {
  const { items, extra } = useMemo(() => resolveStack(stack, tech), [stack, tech])
  if (!items.length && !extra.length) return null
  return (
    <div className="stack-groups">
      {GROUPS.map(([g, label]) => {
        const inGroup = items.filter(([, t]) => t.group === g)
        if (!inGroup.length) return null
        return (
          <div key={g} className="stack-group">
            <span className="mono stack-group__label">{label}</span>
            <ul>
              {inGroup.map(([k, t]) => (
                <li key={k} className="stack-tile" data-tip={t.name} aria-label={t.name} tabIndex={0}>
                  <Glyph icon={t.icon} color={t.color} mono={t.mono} size={26} />
                </li>
              ))}
            </ul>
          </div>
        )
      })}
      {extra.length > 0 && (
        <div className="stack-group">
          <span className="mono stack-group__label">Also</span>
          <ul className="stack-group__words">
            {extra.map((w) => (
              <li key={w} className="stack-logo stack-logo--word">
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
