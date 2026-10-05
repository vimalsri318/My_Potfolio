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

// Hero: logos scattered through the hero's empty whitespace — down the
// gutters either side of the portrait on desktop, through the band between
// the nav and the headline on mobile. Never over the face.
//
// Each badge gets a slot (placed, and drifting) and an inner badge (which
// handles hover lift) so the two transforms never fight. Positions are
// percentages of the hero box: x/y for desktop, mx/my for mobile.
const HERO_STACK = [
  // Desktop: hand-placed x/y (% of the hero) in the gutters either side of
  // the portrait and the band under the nav, deliberately irregular, with
  // `s` varying the size a little so it never reads as a grid.
  //
  // Phone: the badges without `desk` form one ring that turns slowly (see
  // .stack-float in globals.css). Their order here is their order round the
  // ring, so neighbours alternate dark and coloured logos.
  { key: 'nextjs', x: 5, y: 23, s: 1 },
  { key: 'react', x: 13, y: 39, s: 1.1 },
  { key: 'azure', label: 'Microsoft Azure', x: 13, y: 14, s: 1 },
  { key: 'sarvam', label: 'Sarvam AI', x: 3, y: 40, s: 1.06 },
  { key: 'supabase', x: 92, y: 31, s: 0.95 },
  { key: 'python', x: 12, y: 73, s: 1.05 },
  { key: 'ios', x: 31, y: 79, s: 0.95 },
  { key: 'gemini', x: 22, y: 12, s: 0.9 },
  { key: 'typescript', x: 4, y: 57, s: 0.92 },
  { key: 'groq', x: 30, y: 20, s: 1.04 },
  { key: 'openai', x: 88, y: 61, s: 1.08 },
  { key: 'tailwind', x: 70, y: 13, s: 0.96 },
  { key: 'android', x: 93, y: 85, s: 1 },
  // desktop-only: a ring of these as well would be too crowded on a phone
  { key: 'fastapi', x: 83, y: 46, s: 1, desk: true },
  { key: 'expo', x: 85, y: 74, s: 0.93, desk: true },
  { key: 'vercel', x: 78, y: 20, s: 0.9, desk: true },
  { key: 'docker', x: 87, y: 12, s: 1.07, desk: true },
]

export function FloatingStack({ items: spec = HERO_STACK, className = '' }) {
  const items = spec.map((s) => ({ ...s, tech: STACK[s.key] })).filter((s) => s.tech)
  // Touch devices have no hover, so a tap opens the name instead.
  const [open, setOpen] = useState(null)
  if (!items.length) return null
  // Evenly spaced angles round the phone ring, in list order.
  const ringCount = items.filter((s) => !s.desk).length
  let ringIndex = 0
  return (
    <ul className={`stack-float ${className}`} aria-label="What I build with">
      {items.map((s, i) => {
        const angle = s.desk ? 0 : (ringIndex++ / ringCount) * 360
        return (
          <li
            key={s.key}
            className={`stack-float__slot${s.x >= 80 ? ' is-right' : ''}${
              s.y >= 75 ? ' is-low' : ''
            }${s.desk ? ' is-desk-only' : ''}`}
            style={{
              '--i': i,
              '--x': `${s.x}%`,
              '--y': `${s.y}%`,
              '--s': s.s ?? 1,
              '--a': `${angle}deg`,
            }}
          >
            <span
              className="stack-float__item"
              tabIndex={0}
              aria-label={s.label || s.tech.name}
              data-open={open === s.key ? 'true' : undefined}
              onClick={() => setOpen((o) => (o === s.key ? null : s.key))}
              onBlur={() => setOpen((o) => (o === s.key ? null : o))}
            >
              <Glyph icon={s.tech.icon} color={s.tech.color} mono={s.tech.mono} size={30} />
              <span className="stack-float__name" aria-hidden="true">
                {s.label || s.tech.name}
              </span>
            </span>
          </li>
        )
      })}
    </ul>
  )
}
