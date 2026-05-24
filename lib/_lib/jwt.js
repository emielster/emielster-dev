import jwt from 'jsonwebtoken'

export function verifyToken(req) {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) return null

    try {
        return jwt.verify(token, process.env.JWT_SECRET)
    } catch {
        return null
    }
}