import { createClient } from '@supabase/supabase-js'
import { hashPassword, generateToken } from '../../../../_lib/auth.js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { username, password } = req.body
  if (!username || !password)
    return res.status(400).json({ error: 'username and password are required' })

  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('username', username)
    .single()

  if (existing) return res.status(409).json({ error: 'Username already taken' })

  const password_hash = await hashPassword(password)

  const { data: user, error } = await supabase
    .from('users')
    .insert({ username, password_hash })
    .select('id, username')
    .single()

  if (error) return res.status(500).json({ error: error.message })

  res.status(201).json({ success: true, username: user.username })
}