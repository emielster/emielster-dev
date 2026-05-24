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

  const { username, password } = req.body
  if (!username || !password)
    return res.status(400).json({ error: 'username and password are required' })

  const { data: user } = await supabase
    .from('users')
    .select('id, username, password_hash')
    .eq('username', username)
    .single()

  if (!user) return res.status(401).json({ error: 'Wrong username or password' })

  const valid = await verifyPassword(password, user.password_hash)
  if (!valid) return res.status(401).json({ error: 'Wrong username or password' })

  const token = generateToken()
  const expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

  const { error } = await supabase
    .from('sessions')
    .insert({ user_id: user.id, token, expires_at })

  if (error) return res.status(500).json({ error: error.message })

  res.status(200).json({ success: true, token, username: user.username })
}