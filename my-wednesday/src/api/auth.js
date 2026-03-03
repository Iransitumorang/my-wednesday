const BASE = import.meta.env.VITE_API_URL || ''

const fetchAuth = async (path, body) => {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = new Error('Auth Error')
    err.status = res.status
    try {
      err.body = await res.json()
      const v = err.body?.violations
      const fallback = err.body?.message || err.body?.detail || res.statusText
      if (Array.isArray(v) && v.length) {
        const msg = v.map((x) => x.message).filter(Boolean).join('. ')
        err.message = msg ? msg.charAt(0).toUpperCase() + msg.slice(1) : fallback
      } else {
        err.message = typeof fallback === 'string' ? fallback : res.statusText
      }
    } catch (_) {
      err.message = res.statusText
    }
    throw err
  }
  return res.json()
}

const getToken = () => {
  const raw = (localStorage.getItem('auth_token') || '').trim()
  return raw.replace(/^["']|["']$/g, '') || null
}

export const login = (username, password) =>
  fetchAuth('/auth/login', { username, password })

export const register = (username, password, name) =>
  fetchAuth('/auth/register', { username, password, name })

export const getAuthMe = async () => {
  const token = getToken()
  if (!token) return null
  const res = await fetch(`${BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) return null
  return res.json()
}
