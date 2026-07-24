// Server-side request enrichment. This is why page views now go through
// /api/track instead of straight from the browser to Supabase: the location
// of a visitor is only knowable from the request headers, which the browser
// can't see and can't be trusted to report.
//
// No third-party geo service, no IP stored — Vercel resolves the IP at its
// edge and hands us the result as headers. We keep the result, never the IP.

// `x-vercel-ip-country` is present on every Vercel plan. The finer-grained
// headers (city / region / timezone) depend on the plan, so treat them as
// optional — everything degrades to null and the dashboard just shows fewer
// rows. Locally (`npm run dev`) none of these exist, so visits log as unknown.
export function geoFrom(req) {
  const h = (name) => {
    const v = req.headers[name]
    if (!v) return null
    // City names arrive percent-encoded ("San%20Francisco").
    try {
      return decodeURIComponent(Array.isArray(v) ? v[0] : v) || null
    } catch {
      return Array.isArray(v) ? v[0] : v
    }
  }

  return {
    country: h('x-vercel-ip-country'),
    region: h('x-vercel-ip-country-region'),
    city: h('x-vercel-ip-city'),
    timezone: h('x-vercel-ip-timezone'),
  }
}

// Minimal user-agent parsing. A full UA library is a big dependency for what
// amounts to three buckets and a handful of string matches, and UA strings
// are deliberately fuzzy these days anyway — this is accurate enough to answer
// "is my audience on mobile?" without pretending to more precision than exists.
export function uaFrom(req) {
  const raw = req.headers['user-agent'] || ''
  const ua = raw.toLowerCase()
  if (!ua) return { device: null, os: null, browser: null, isBot: false }

  const isBot = /bot|crawler|spider|crawling|headless|lighthouse|preview|slurp|facebookexternalhit/.test(ua)

  const isTablet = /ipad|tablet|playbook|silk|(android(?!.*mobile))/.test(ua)
  const isMobile = !isTablet && /mobile|iphone|ipod|android|blackberry|iemobile|opera mini/.test(ua)
  const device = isBot ? 'bot' : isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop'

  const os =
    /windows nt/.test(ua) ? 'Windows'
    : /iphone|ipad|ipod/.test(ua) ? 'iOS'
    : /mac os x/.test(ua) ? 'macOS'
    : /android/.test(ua) ? 'Android'
    : /linux/.test(ua) ? 'Linux'
    : null

  // Order matters — Edge and Chrome both claim "chrome", Chrome claims "safari".
  const browser =
    /edg\//.test(ua) ? 'Edge'
    : /opr\/|opera/.test(ua) ? 'Opera'
    : /samsungbrowser/.test(ua) ? 'Samsung Internet'
    : /firefox|fxios/.test(ua) ? 'Firefox'
    : /chrome|crios/.test(ua) ? 'Chrome'
    : /safari/.test(ua) ? 'Safari'
    : null

  return { device, os, browser, isBot }
}

// Turn a full referrer URL into just the host, so the dashboard groups all
// traffic from one source together instead of listing every distinct URL.
// Our own domain is dropped — internal navigation isn't a traffic source.
export function referrerHost(referrer, selfHost) {
  if (!referrer) return null
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, '')
    // `selfHost` comes from the Host header, which carries the port in dev
    // ("localhost:3000") while `hostname` never does — so strip it before
    // comparing, or internal navigation gets logged as a traffic source.
    const self = selfHost ? selfHost.split(':')[0].replace(/^www\./, '') : null
    if (!host || host === self) return null
    return host
  } catch {
    return null
  }
}
