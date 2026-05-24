import bcrypt from 'bcryptjs'
import crypto from 'crypto'

export async function hashPassword(password) {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash)
}

export function generateToken() {
  return crypto.randomBytes(32).toString('hex')
}

export function generateCode() {
  return crypto.randomBytes(3).toString('hex').toUpperCase()
}

export function getTokenFromHeader(req) {
  const auth = req.headers['authorization']
  if (!auth || !auth.startsWith('Bearer ')) return null
  return auth.slice(7)
}