import { createClient } from '@supabase/supabase-js'
import { getTokenFromHeader, generateToken, normalizeUrl } from '../../../../_lib/auth.js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const sessionToken = getTokenFromHeader(req)
  if (!sessionToken) return res.status(401).json({ error: 'Authorization header required' })

  const { data: session } = await supabase
    .from('sessions')
    .select('*, users(*, backends(*))')
    .eq('token', sessionToken)
    .single()

  if (!session) return res.status(401).json({ error: 'Invalid or expired session' })
  if (new Date() > new Date(session.expires_at))
    return res.status(401).json({ error: 'Session expired' })

  const { code } = req.body
  if (!code) return res.status(400).json({ error: 'code is required' })

  const { data: authCode } = await supabase
    .from('auth_codes')
    .select('*')
    .eq('code', code)
    .single()

  if (!authCode) return res.status(404).json({ error: 'Invalid code' })
  if (new Date() > new Date(authCode.expires_at))
    return res.status(410).json({ error: 'Code expired' })
  if (authCode.authorized)
    return res.status(409).json({ error: 'Code already used' })

  const user = session.users
  const ownsBackend = user.backends.some(b => b.url === normalizeUrl(authCode.backend_url))
  if (!ownsBackend) return res.status(403).json({ error: 'You do not own this backend' })

  const token = generateToken()

  await supabase
    .from('auth_codes')
    .update({ authorized: true, token })
    .eq('code', code)

  res.status(200).json({ success: true })
}