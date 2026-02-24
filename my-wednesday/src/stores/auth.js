import { defineStore } from 'pinia'
import { login as apiLogin, register as apiRegister } from '../api/auth'

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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      localStorage.setItem(TOKEN_KEY, data.token)
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
    isAdmin: (state) => state.role === 'admin',
    isUser: (state) => state.role === 'user',
    displayName: (state) => state.name || state.username || '-',
  },
  actions: {
    setAuth(data) {
      this.token = data?.token ?? null
      this.username = data?.username ?? null
      this.name = data?.name ?? null
      this.role = data?.role?.toLowerCase?.() ?? null
      saveToStorage(data ? { ...data, role: this.role } : null)
    },
    async login(username, password) {
      const res = await apiLogin(username, password)
      this.setAuth(res)
      return res
    },
    async register(username, password, name) {
      const res = await apiRegister(username, password, name)
      this.setAuth(res)
      return res
    },
    logout() {
      this.setAuth(null)
    },
  },
})
