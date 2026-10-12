/** @type {import('next').NextConfig} */
const longCache = 'public, max-age=2592000, stale-while-revalidate=86400'

module.exports = {
  // Files in public/ default to `max-age=0, must-revalidate`, which made the
  // browser re-ask the server for every cover, clip and font on every visit.
  async headers() {
    return [
      { source: '/assets/:path*', headers: [{ key: 'Cache-Control', value: longCache }] },
      { source: '/:file(favicon.*|apple-touch-icon.png)', headers: [{ key: 'Cache-Control', value: longCache }] },
    ]
  },
}
