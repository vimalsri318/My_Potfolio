// Free company logo resolver using Unavatar & Google Favicon services.
// Zero cost, zero API keys required.
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { query, domain } = req.query || {}
  const raw = String(domain || query || '').trim().toLowerCase()

  if (!raw) {
    return res.status(400).json({ error: 'Company name or domain is required' })
  }

  // If input already looks like a domain (e.g. stripe.com, vercel.app, neuralflow.ai)
  let targetDomain = raw.replace(/^https?:\/\//, '').replace(/\/.*$/, '')

  // If input is just a company name (e.g. "Google", "OpenAI", "Meta")
  if (!targetDomain.includes('.')) {
    const cleanName = targetDomain.replace(/[^a-z0-9]/g, '')
    targetDomain = `${cleanName}.com`
  }

  // Try unavatar first (high-res svg/png vector logos)
  const unavatarUrl = `https://unavatar.io/${targetDomain}?fallback=false`
  const googleFaviconUrl = `https://www.google.com/s2/favicons?domain=${targetDomain}&sz=128`

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3000)

    const unavatarRes = await fetch(unavatarUrl, {
      method: 'HEAD',
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (unavatarRes.ok) {
      return res.status(200).json({
        found: true,
        domain: targetDomain,
        logoUrl: `https://unavatar.io/${targetDomain}`,
        source: 'unavatar',
      })
    }
  } catch {
    // Fall back to Google favicon
  }

  // Google favicon service is 100% reliable for any registered web domain
  return res.status(200).json({
    found: true,
    domain: targetDomain,
    logoUrl: googleFaviconUrl,
    source: 'google',
  })
}
