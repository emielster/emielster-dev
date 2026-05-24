import { requireAuth } from '../../api/_lib/session.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const user = await requireAuth(req, res)
  if (!user) return

  const { backend_url } = req.body
  if (!backend_url) return res.status(400).json({ error: 'backend_url is required' })

  const routes = [
    '/connections',
    '/ideas',
  ]

  const results = await Promise.all(
    routes.map(async (route) => {
      try {
        const r = await fetch(`${backend_url.replace(/\/$/, '')}${route}`, {
          method: 'GET',
          signal: AbortSignal.timeout(5000),
        })
        return { route, ok: r.status !== 404 }
      } catch {
        return { route, ok: false }
      }
    })
  )

  const failed = results.filter(r => !r.ok).map(r => r.route)

  if (failed.length > 0)
    return res.status(200).json({ valid: false, missing: failed })

  res.status(200).json({ valid: true })
}