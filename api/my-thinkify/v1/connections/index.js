import { createClient } from '@supabase/supabase-js'
import { verifyToken } from '../../../../lib/_lib/jwt.js'


const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('connections')
      .select(`
        id,
        label,
        created_at,
        from_idea (id, title, status),
        to_idea   (id, title, status)
      `)
      .order('created_at', { ascending: false })

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ data, count: data.length })
  }

  if (req.method === 'POST') {
    const user = verifyToken(req)
    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    const { from_idea, to_idea, label } = req.body

    if (!from_idea || !to_idea)
      return res.status(400).json({ error: 'from_idea and to_idea are required' })

    if (from_idea === to_idea)
      return res.status(400).json({ error: 'Cannot connect an idea to itself' })

    const { data, error } = await supabase
      .from('connections')
      .insert({ from_idea, to_idea, label })
      .select()
      .single()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json({ data })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}