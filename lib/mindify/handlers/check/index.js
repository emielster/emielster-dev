import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { backend } = req.query
  if (!backend) return res.status(400).json({ error: 'backend query param required' })

  const { data } = await supabase
    .from('backends')
    .select('id, owner_id, claimed_at, users(username)')
    .eq('url', backend)
    .single()

  if (!data) return res.status(200).json({ claimed: false })

  res.status(200).json({
    claimed: true,
    owner: data.users.username,
    claimed_at: data.claimed_at
  })
}