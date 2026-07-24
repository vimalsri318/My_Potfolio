import { geoFrom, uaFrom, referrerHost } from '../../lib/geo'

// The single public ingest endpoint for analytics. The browser used to insert
// into Supabase directly with the anon key; it now posts here instead, which
// buys us three things:
//   1. location + device, which only exist in the request headers;
//   2. bot filtering, so crawlers don't inflate the numbers;
//   3. the anon key can no longer write page_views at all.
//
// It is deliberately quiet: analytics must never break the page, so every
// failure path returns a success-ish status and logs server-side only.

function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  const { createClient } = require('@supabase/supabase-js')
  return createClient(url, key, { auth: { persistSession: false } })
}

// Clamp anything client-supplied — it's untrusted input going into our table.
const str = (v, max = 512) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null)
const int = (v, min, max) => {
  const n = Number(v)
  if (!Number.isFinite(n)) return null
  return Math.min(max, Math.max(min, Math.round(n)))
}

// Next warns if a route handler resolves to a value, and `res.json()` /
// `res.end()` both return the response object — so replies go through these,
// which send and then return undefined.
const send = (res, code, body) => {
  if (body === undefined) res.status(code).end()
  else res.status(code).json(body)
}
const noContent = (res) => send(res, 204)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return send(res, 405)
  }

  const supabase = db()
  // Not configured yet (e.g. a fresh clone with no .env) — accept and drop.
  if (!supabase) return noContent(res)

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body || {}
  const { device, os, browser, isBot } = uaFrom(req)

  // Crawlers hit every page and would otherwise dominate the charts.
  if (isBot) return noContent(res)

  const geo = geoFrom(req)
  const selfHost = str(req.headers.host, 200)

  try {
    if (body.type === 'ping') {
      // Engagement update for a view we already inserted. Matching on
      // visitor_id too means one visitor can't rewrite another's row.
      const id = int(body.id, 1, Number.MAX_SAFE_INTEGER)
      const visitorId = str(body.visitorId, 100)
      if (!id || !visitorId) return noContent(res)

      await supabase
        .from('page_views')
        .update({
          duration_ms: int(body.durationMs, 0, 6 * 60 * 60 * 1000), // cap at 6h
          max_scroll: int(body.maxScroll, 0, 100),
        })
        .eq('id', id)
        .eq('visitor_id', visitorId)

      return noContent(res)
    }

    if (body.type === 'event') {
      const name = str(body.name, 40)
      if (!name) return send(res, 400, { error: 'name required' })

      await supabase.from('events').insert({
        name,
        path: str(body.path, 300),
        slug: str(body.slug, 120),
        label: str(body.label, 160),
        href: str(body.href, 600),
        visitor_id: str(body.visitorId, 100),
        session_id: str(body.sessionId, 100),
        props: body.props && typeof body.props === 'object' ? body.props : null,
        country: geo.country,
        device,
      })

      return noContent(res)
    }

    // Default: a page view.
    const { data, error } = await supabase
      .from('page_views')
      .insert({
        path: str(body.path, 300) || '/',
        slug: str(body.slug, 120),
        referrer: str(body.referrer, 600),
        referrer_host: referrerHost(body.referrer, selfHost),
        visitor_id: str(body.visitorId, 100),
        session_id: str(body.sessionId, 100),
        utm_source: str(body.utmSource, 120),
        utm_medium: str(body.utmMedium, 120),
        utm_campaign: str(body.utmCampaign, 120),
        ...geo,
        device,
        os,
        browser,
      })
      .select('id')
      .single()

    if (error) {
      console.error('track: page view insert failed —', error.message)
      return noContent(res)
    }

    // The id goes back so the client's unload beacon can attach how long the
    // visitor actually stayed and how far they scrolled.
    return send(res, 200, { id: data?.id ?? null })
  } catch (e) {
    console.error('track: unexpected failure —', e.message)
    return noContent(res)
  }
}

function safeParse(s) {
  try {
    return JSON.parse(s)
  } catch {
    return {}
  }
}
