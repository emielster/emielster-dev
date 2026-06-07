import { createClient } from '@supabase/supabase-js'
import { requireAuth } from '../../../_lib/session.js'


const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const user = await requireAuth(req, res)
  if (!user) return

  const { data, error } = await supabase
    .from('backends')
    .select('url, key, claimed_at')
    .eq('owner_id', user.id)

  if (error) return res.status(500).json({ error: error.message })

  res.status(200).json({ success: true, backends: data })
}