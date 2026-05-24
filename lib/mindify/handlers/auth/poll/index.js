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

  const { code } = req.query
  if (!code) return res.status(400).json({ error: 'code is required' })

  const { data } = await supabase
    .from('auth_codes')
    .select('*')
    .eq('code', code)
    .single()

  if (!data) return res.status(404).json({ error: 'Invalid code' })

  if (new Date() > new Date(data.expires_at)) {
    await supabase.from('auth_codes').delete().eq('code', code)
    return res.status(410).json({ error: 'Code expired' })
  }

  if (!data.authorized)
    return res.status(200).json({ authorized: false })

  const token = data.token
  await supabase.from('auth_codes').delete().eq('code', code)

  res.status(200).json({ authorized: true, token })
}