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
      .from('ideas')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ data, count: data.length })
  }

  if (req.method === 'POST') {
    const user = verifyToken(req)
    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    const { title, description, status, category, tags, links, images } = req.body
    if (!title) return res.status(400).json({ error: 'Title is required' })

    const { data, error } = await supabase
      .from('ideas')
      .insert({
        title,
        description,
        status:   status ?? 'idea',
        category,
        tags:     tags   ?? [],
        links:    links  ?? [],
        images:   images ?? [],
      })
      .select()
      .single()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json({ data })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}