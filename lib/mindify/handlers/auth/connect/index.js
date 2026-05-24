import { createClient } from '@supabase/supabase-js'
import { verifyPassword, generateToken } from '../../../../_lib/auth.js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { code, username, password } = req.body
  if (!code || !username || !password)
    return res.status(400).json({ error: 'code, username and password are required' })

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

  const { data: user } = await supabase
    .from('users')
    .select('*, backends(*)')
    .eq('username', username)
    .single()

  if (!user) return res.status(401).json({ error: 'Wrong username or password' })

  const validPassword = await verifyPassword(password, user.password_hash)
  if (!validPassword) return res.status(401).json({ error: 'Wrong username or password' })

  const ownsBackend = user.backends.some(b => b.url === authCode.backend_url)
  if (!ownsBackend) return res.status(403).json({ error: 'You do not own this backend' })

  const token = generateToken(username)

  await supabase
    .from('auth_codes')
    .update({ authorized: true, token })
    .eq('code', code)

  res.status(200).json({ success: true })
}