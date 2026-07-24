import { useEffect } from 'react'
import { isOwner } from '../lib/visitor'
import { trackEvent } from '../lib/track'

const DOWNLOAD_RE = /\.(pdf|zip|docx?|pptx?|xlsx?|csv|png|jpe?g|svg|mp4|mp3)(\?|$)/i

// Anything explicitly opted in with data-track wins; otherwise the link is
// classified by where it points. Buckets stay coarse on purpose — five useful
// categories beat fifty that nobody reads.
function classify(el) {
  const explicit = el.closest('[data-track]')
  if (explicit) {
    return {
      name: explicit.getAttribute('data-track') || 'cta',
      label: explicit.getAttribute('data-track-label') || text(explicit),
      href: explicit.getAttribute('href') || null,
    }
  }

  const a = el.closest('a[href]')
  if (!a) return null

  const href = a.getAttribute('href') || ''
  if (!href || href.startsWith('#')) return null

  if (href.startsWith('mailto:') || href.startsWith('tel:')) {
    return { name: 'contact', label: text(a) || href, href }
  }

  if (a.hasAttribute('download') || DOWNLOAD_RE.test(href)) {
    return { name: 'download', label: text(a) || href.split('/').pop(), href }
  }

  // Same-origin relative links are internal navigation.
  let host = null
  try {
    host = new URL(href, window.location.href).hostname
  } catch {
    return null
  }
  const isExternal = host && host !== window.location.hostname

  return {
    name: isExternal ? 'outbound' : 'internal',
    label: text(a) || (isExternal ? host.replace(/^www\./, '') : href),
    href,
  }
}

// Prefer a real accessible name — icon-only links have no text but usually
// carry an aria-label or title.
function text(el) {
  const raw =
    el.getAttribute('aria-label') ||
    el.getAttribute('title') ||
    el.textContent ||
    ''
  return raw.replace(/\s+/g, ' ').trim().slice(0, 120) || null
}

// A single delegated listener on the document, mounted once in _app. This is
// the whole of "click tracking" — no per-component instrumentation, so new
// links and buttons are covered automatically as the site grows.
export function useTrackClicks() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (isOwner()) return

    const onClick = (e) => {
      // Capture phase, so we still see the click if a handler stops it later.
      const target = e.target
      if (!target || typeof target.closest !== 'function') return

      const hit = classify(target)
      if (!hit || !hit.name) return

      trackEvent(hit.name, { label: hit.label, href: hit.href })
    }

    document.addEventListener('click', onClick, { capture: true, passive: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])
}
