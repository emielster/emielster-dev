import login from '../../../lib/mindify/handlers/auth/login/index.js'
import logout from '../../../lib/mindify/handlers/auth/logout/index.js'
import poll from '../../../lib/mindify/handlers/auth/poll/index.js'
import connect from '../../../lib/mindify/handlers/auth/connect/index.js'
import code from '../../../lib/mindify/handlers/auth/code/index.js'
import register from '../../../lib/mindify/handlers/register/index.js'
import validate from '../../../lib/mindify/handlers/validate/index.js'
import backends from '../../../lib/mindify/handlers/backends/index.js'
import check from '../../../lib/mindify/handlers/check/index.js'

const ROUTES = {
  'auth/login':   { handler: login,    methods: ['POST'] },
  'auth/logout':  { handler: logout,   methods: ['POST'] },
  'auth/poll':    { handler: poll,     methods: ['GET']  },
  'auth/connect': { handler: connect,  methods: ['POST'] },
  'auth/code':    { handler: code,     methods: ['POST'] },
  'register':     { handler: register, methods: ['POST'] },
  'validate':     { handler: validate, methods: ['POST'] },
  'backends':     { handler: backends, methods: ['GET']  },
  'check':        { handler: check,    methods: ['GET']  },
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') return res.status(200).end()

  const route = Array.isArray(req.query.route)
    ? req.query.route.join('/')
    : req.query.route ?? ''

  const match = ROUTES[route]

  if (!match) {
    return res.status(404).json({ error: `Unknown route: ${route}` })
  }

  if (!match.methods.includes(req.method)) {
    return res.status(405).json({ error: `Method ${req.method} not allowed on ${route}` })
  }

  return match.handler(req, res)
}