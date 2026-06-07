import login from '../../../lib/thinkify/handlers/auth/login/index.js'
import logout from '../../../lib/thinkify/handlers/auth/logout/index.js'
import register from '../../../lib/thinkify/handlers/register/index.js'
import validate from '../../../lib/thinkify/handlers/validate/index.js'
import backends from '../../../lib/thinkify/handlers/backends/index.js'
import check from '../../../lib/thinkify/handlers/check/index.js'
import register_account from '../../../lib/thinkify/handlers/auth/register/index.js'


const ROUTES = {
  'auth/login':   { handler: login,    methods: ['POST'] },
  'auth/logout':  { handler: logout,   methods: ['POST'] },
  'auth/register': { handler: register_account, methods: ['POST'] },
  'register':     { handler: register, methods: ['POST'] },
  'validate':     { handler: validate, methods: ['POST'] },
  'backends':     { handler: backends, methods: ['GET'] },
  'check':        { handler: check,    methods: ['GET']  },
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')


  console.log('route query:', req.query)
  console.log('url:', req.url)
  if (req.method === 'OPTIONS') return res.status(200).end()

    const route = req.url
        .replace('/api/thinkify/v1/', '')
        .split('?')[0]

  const match = ROUTES[route]

  if (!match) {
    return res.status(404).json({ error: `Unknown route: ${route}` })
  }

  if (!match.methods.includes(req.method)) {
    return res.status(405).json({ error: `Method ${req.method} not allowed on ${route}` })
  }

  return match.handler(req, res)
}