import { createClient } from '@supabase/supabase-js'
import { verifyToken } from '../../../_lib/jwt.js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'PATCH, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') return res.status(200).end()

  const { id } = req.query
  const user = verifyToken(req)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'PATCH') {
    const { label } = req.body

    const { data, error } = await supabase
      .from('connections')
      .update({ label })
      .eq('id', id)
      .select()
      .single()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ data })
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase
      .from('connections')
      .delete()
      .eq('id', id)

    if (error) return res.status(500).json({ error: error.message })
    return res.status(204).end()
  }

  return res.status(405).json({ error: 'Method not allowed' })
}