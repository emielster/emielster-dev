import { createClient } from '@supabase/supabase-js'
import { requireAuth } from '../../../../api/_lib/session.js'

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

  const user = await requireAuth(req, res)
  if (!user) return

  const { backend_url } = req.body
  if (!backend_url) return res.status(400).json({ error: 'backend_url is required' })

  const { data: claimed } = await supabase
    .from('backends')
    .select('id')
    .eq('url', backend_url)
    .single()

  if (claimed) return res.status(409).json({ error: 'Backend already claimed' })

  const { data: userData } = await supabase
    .from('users')
    .select('id')
    .eq('username', user.username)
    .single()

  const { error } = await supabase
    .from('backends')
    .insert({ url: backend_url, owner_id: userData.id })

  if (error) return res.status(500).json({ error: error.message })

  res.status(201).json({ success: true, backend_url })
}