import { createClient } from '@supabase/supabase-js'
import { getTokenFromHeader } from './auth.js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export async function requireAuth(req, res) {
  const token = getTokenFromHeader(req)
  if (!token) {
    res.status(401).json({ error: 'Missing or invalid Authorization header' })
    return null
  }

  const { data: session } = await supabase
    .from('sessions')
    .select('user_id, expires_at, users(id, username)')
    .eq('token', token)
    .single()

  if (!session) {
    res.status(401).json({ error: 'Invalid or expired token' })
    return null
  }

  if (new Date() > new Date(session.expires_at)) {
    await supabase.from('sessions').delete().eq('token', token)
    res.status(401).json({ error: 'Session expired, please log in again' })
    return null
  }

  return session.users
}