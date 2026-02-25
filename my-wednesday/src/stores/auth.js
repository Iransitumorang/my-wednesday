import { defineStore } from 'pinia'
import { login as apiLogin, register as apiRegister, getAuthMe } from '../api/auth'

const STORAGE_KEY = 'auth'
const TOKEN_KEY = 'auth_token'

const loadFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) return JSON.parse(data)
  } catch (_) {}
  return null
}

const saveToStorage = (data) => {
  try {
    if (data) {
      const token = (data.token != null ? String(data.token).trim().replace(/^["']|["']$/g, '') : null) || ''
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, token: token || null }))
      localStorage.setItem(TOKEN_KEY, token)
    } else {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(TOKEN_KEY)
    }
  } catch (_) {}
}

export const useAuthStore = defineStore('auth', {
  state: () => {
    const stored = loadFromStorage()
    return {
      token: stored?.token ?? null,
      username: stored?.username ?? null,
      name: stored?.name ?? null,
      role: stored?.role ?? null,
    }
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => (state.role || '').toLowerCase() === 'admin',
    isUser: (state) => state.role === 'user',
    displayName: (state) => state.name || state.username || '-',
  },
  actions: {
    setAuth(data) {
      const token = data?.token != null ? String(data.token).trim().replace(/^["']|["']$/g, '') : null
      this.token = token
      this.username = data?.username ?? null
      this.name = data?.name ?? null
      this.role = data?.role?.toLowerCase?.() ?? null
      saveToStorage(data ? { ...data, token, role: this.role } : null)
    },
    async login(username, password) {
      const res = await apiLogin(username, password)
      this.setAuth(res)
      const me = await getAuthMe()
      if (me) {
        const role = (me.role ?? me.groups?.[0])?.toLowerCase?.() || 'user'
        this.setAuth({ token: res.token, username: me.username, name: me.name, role })
      }
      return res
    },
    async register(username, password, name) {
      const res = await apiRegister(username, password, name)
      this.setAuth(res)
      const me = await getAuthMe()
      if (me) {
        const role = (me.role ?? me.groups?.[0])?.toLowerCase?.() || 'user'
        this.setAuth({ token: res.token, username: me.username, name: me.name, role })
      }
      return res
    },
    logout() {
      this.setAuth(null)
    },
    async validateToken() {
      const token = localStorage.getItem(TOKEN_KEY)
      if (!token) return false
      const me = await getAuthMe()
      if (!me) {
        this.setAuth(null)
        return false
      }
      const role = (me.role ?? me.groups?.[0])?.toLowerCase?.() || 'user'
      this.setAuth({ token, username: me.username, name: me.name, role })
      return true
    },
  },
})
