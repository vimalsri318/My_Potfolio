import { createClient } from '@supabase/supabase-js'

// Health and keep-alive endpoint.
// Can be pinged by GitHub Actions, Cron-Job.org, or UptimeRobot to keep
// Supabase free tier active and alert if the database is paused or unreachable.
export default async function handler(req, res) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    return res.status(500).json({
      status: 'error',
      message: 'Supabase environment variables are missing',
      timestamp: new Date().toISOString(),
    })
  }

  const start = Date.now()
  try {
    const supabase = createClient(url, key, { auth: { persistSession: false } })
    const { data, error } = await supabase
      .from('site_sections')
      .select('key')
      .limit(1)

    const latencyMs = Date.now() - start

    if (error) {
      return res.status(502).json({
        status: 'degraded',
        database: 'error',
        error: error.message,
        latency_ms: latencyMs,
        timestamp: new Date().toISOString(),
      })
    }

    return res.status(200).json({
      status: 'ok',
      database: 'healthy',
      latency_ms: latencyMs,
      timestamp: new Date().toISOString(),
      rows_found: data?.length || 0,
    })
  } catch (err) {
    return res.status(500).json({
      status: 'down',
      error: String(err.message || err),
      latency_ms: Date.now() - start,
      timestamp: new Date().toISOString(),
    })
  }
}
