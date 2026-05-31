import { createClient } from '@supabase/supabase-js'
import { verifyToken } from '../../../../lib/_lib/jwt.js'

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    if (req.method === 'OPTIONS') return res.status(200).end()

    const { id } = req.query

    // GET 
    if (req.method === 'GET') {
        const { data, error } = await supabase
            .from('ideas')
            .select('*')
            .eq('id', id)
            .single()

        if (error) return res.status(404).json({ error: 'Idea not found' })
        return res.status(200).json({ data })
    }

    // PATCH and DELETE require auth
    const user = verifyToken(req)
    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    // PATCH idea
    if (req.method === 'PATCH') {
        const { data, error } = await supabase
            .from('ideas')
            .update(req.body)
            .eq('id', id)
            .select()
            .single()

        if (error) return res.status(500).json({ error: error.message })
        return res.status(200).json({ data })
    }

    // DELETE idea
    if (req.method === 'DELETE') {
        const { error } = await supabase
            .from('ideas')
            .delete()
            .eq('id', id)

        if (error) return res.status(500).json({ error: error.message })
        return res.status(204).end()
    }

    return res.status(405).json({ error: 'Method not allowed' })
}