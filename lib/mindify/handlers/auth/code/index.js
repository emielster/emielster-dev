import { createClient } from '@supabase/supabase-js'
import { generateCode } from '../../../../_lib/auth.js'

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

  const { backend_url } = req.body
  if (!backend_url) return res.status(400).json({ error: 'backend_url is required' })

  const code = generateCode()
  const expires_at = new Date(Date.now() + 5 * 60 * 1000) // 5 mins

  const { error } = await supabase
    .from('auth_codes')
    .insert({ code, backend_url, expires_at })

  if (error) return res.status(500).json({ error: error.message })

  res.status(201).json({ code, expires_at })
}