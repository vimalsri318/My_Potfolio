// Every admin API route runs through this. In a production build the admin
// simply does not exist — the routes 404 and nothing can be written. The
// admin is only ever reachable from `npm run dev` on your own machine, so
// there is no admin surface on the public Netlify site to attack.
export function guardAdmin(req, res) {
  if (process.env.NODE_ENV === 'production') {
    res.status(404).json({ error: 'Not found' })
    return false
  }
  return true
}
