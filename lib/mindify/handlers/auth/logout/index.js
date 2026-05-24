import { createClient } from '@supabase/supabase-js'
import { getTokenFromHeader } from '../../../../_lib/auth.js'

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

  const token = getTokenFromHeader(req)
  if (!token) return res.status(401).json({ error: 'Missing Authorization header' })

  await supabase.from('sessions').delete().eq('token', token)

  res.status(200).json({ success: true })
}