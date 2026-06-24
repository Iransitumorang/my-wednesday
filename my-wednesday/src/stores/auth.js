import { defineStore } from 'pinia'
import { login as loginApi, register as registerApi, getAuthMe } from '../api/auth'

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

const normalizeRole = (role) => {
  if (!role) return ''
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
}

const normalizeUser = (data) => {
  if (!data) return null

  return {
    username: data.username || '',
    name: data.name || data.username || '',
    role: normalizeRole(data.role),
    groups: data.groups || [],
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem(TOKEN_KEY) || null,
    user: JSON.parse(localStorage.getItem(USER_KEY) || 'null'),
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.token),

    displayName: (state) => {
      return state.user?.name || state.user?.username || 'Masuk'
    },

    isAdmin: (state) => {
      const role = state.user?.role?.toLowerCase()
      const groups = state.user?.groups || []

      return role === 'admin' || groups.includes('Admin')
    },
  },

  actions: {
    setSession(data) {
      this.token = data.token
      this.user = normalizeUser(data)

      localStorage.setItem(TOKEN_KEY, data.token)
      localStorage.setItem(USER_KEY, JSON.stringify(this.user))
    },

    async login(username, password) {
      this.loading = true
      this.error = null

      try {
        const data = await loginApi(username, password)
        this.setSession(data)
        return data
      } catch (error) {
        this.error = error.message || 'Login gagal'
        this.logout()
        throw error
      } finally {
        this.loading = false
      }
    },

    async register(username, password, name) {
      this.loading = true
      this.error = null

      try {
        const data = await registerApi(username, password, name)
        this.setSession(data)
        return data
      } catch (error) {
        this.error = error.message || 'Register gagal'
        this.logout()
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchMe() {
      if (!this.token) return null

      try {
        const data = await getAuthMe()
        this.user = normalizeUser(data)
        localStorage.setItem(USER_KEY, JSON.stringify(this.user))
        return data
      } catch {
        return this.user
      }
    },

    logout() {
      this.token = null
      this.user = null
      this.error = null

      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    },
  },
})