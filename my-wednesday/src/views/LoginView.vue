<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const mode = ref('login')
const form = ref({ username: 'admin', password: 'admin123', name: '' })
const showPassword = ref(false)
const error = ref(null)
const loading = ref(false)

const submit = async () => {
  const { username, password, name } = form.value
  if (!username?.trim() || !password?.trim()) return
  if (mode.value === 'register' && !name?.trim()) return
  error.value = null
  loading.value = true
  try {
    if (mode.value === 'login') {
      await auth.login(username.trim(), password)
    } else {
      await auth.register(username.trim(), password, name.trim())
    }
    const returnUrl = route.query.returnUrl || '/'
    router.push(returnUrl)
  } catch (e) {
    error.value = e.message || 'Gagal'
  } finally {
    loading.value = false
  }
}

const CREDS = {
  admin: { username: 'admin', password: 'admin123' },
  customer: { username: 'customer', password: 'customer123' },
}

const switchMode = () => {
  mode.value = mode.value === 'login' ? 'register' : 'login'
  error.value = null
  form.value = mode.value === 'login' ? { ...CREDS.admin, name: '' } : { username: '', password: '', name: '' }
}

const fillCreds = (role) => {
  form.value = { ...CREDS[role], name: form.value.name }
}

const clearField = (field) => {
  form.value[field] = ''
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <h1 class="login-title">{{ mode === 'login' ? 'Masuk' : 'Daftar' }}</h1>
      <form @submit.prevent="submit" class="login-form">
        <div class="form-group">
          <label>Username</label>
          <div class="input-wrap">
            <input
              v-model="form.username"
              type="text"
              placeholder="Username"
              autocomplete="username"
            />
            <button
              v-if="form.username"
              type="button"
              class="btn-clear"
              aria-label="Hapus"
              @click="clearField('username')"
            >
              ×
            </button>
          </div>
        </div>
        <div v-if="mode === 'register'" class="form-group">
          <label>Nama Lengkap</label>
          <div class="input-wrap">
            <input v-model="form.name" type="text" placeholder="Nama lengkap" />
            <button
              v-if="form.name"
              type="button"
              class="btn-clear"
              aria-label="Hapus"
              @click="clearField('name')"
            >
              ×
            </button>
          </div>
        </div>
        <div class="form-group">
          <label>Password</label>
          <div class="input-wrap input-wrap-password">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Password"
              autocomplete="current-password"
            />
            <button
              type="button"
              class="btn-eye"
              :aria-label="showPassword ? 'Sembunyikan password' : 'Tampilkan password'"
              @click="togglePassword"
            >
              {{ showPassword ? '🙈' : '👁' }}
            </button>
            <button
              v-if="form.password"
              type="button"
              class="btn-clear"
              aria-label="Hapus"
              @click="clearField('password')"
            >
              ×
            </button>
          </div>
        </div>
        <p v-if="error" class="error-msg">{{ error }}</p>
        <button type="submit" class="btn-login" :disabled="loading">
          {{ loading ? 'Memproses...' : (mode === 'login' ? 'Masuk' : 'Daftar') }}
        </button>
      </form>
      <div v-if="mode === 'login'" class="cred-hint">
        <button type="button" class="cred-btn" @click="fillCreds('admin')">Admin</button>
        <span class="cred-sep">/</span>
        <button type="button" class="cred-btn" @click="fillCreds('customer')">Customer</button>
      </div>
      <p class="login-hint">
        <button type="button" class="link-btn" @click="switchMode">
          {{ mode === 'login' ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk' }}
        </button>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  padding: 7rem 2rem 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 2.5rem;
  background: var(--card-bg);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.login-title {
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0 0 1.5rem 0;
  color: var(--text);
  text-align: center;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.cred-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.cred-btn {
  padding: 0.35rem 0.75rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: var(--text-muted);
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.cred-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.cred-sep {
  color: var(--text-muted);
  font-size: 0.95rem;
}

.input-wrap input {
  flex: 1;
  padding: 0.85rem 2.25rem 0.85rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: var(--text);
  font-size: 1rem;
}

.input-wrap input:focus {
  outline: none;
  border-color: var(--accent);
}

.btn-eye {
  position: absolute;
  right: 2.75rem;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 1rem;
  cursor: pointer;
  transition: color 0.2s;
}

.btn-eye:hover {
  color: var(--accent);
}

.input-wrap-password input {
  padding-right: 4.5rem;
}

.btn-clear {
  position: absolute;
  right: 0.5rem;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: var(--text-muted);
  font-size: 1.25rem;
  line-height: 1;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-clear:hover {
  background: rgba(255, 255, 255, 0.15);
  color: var(--text);
}

.error-msg {
  color: #ff6b6b;
  font-size: 0.9rem;
  margin: 0 0 1rem 0;
}

.btn-login {
  width: 100%;
  padding: 0.9rem;
  background: var(--accent);
  color: var(--bg);
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background 0.3s ease, transform 0.3s ease;
}

.btn-login:hover:not(:disabled) {
  background: var(--accent-hover);
  transform: translateY(-2px);
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-hint {
  font-size: 0.85rem;
  color: var(--text-muted);
  text-align: center;
  margin: 1rem 0 0 0;
}

.link-btn {
  background: none;
  border: none;
  color: var(--accent);
  cursor: pointer;
  text-decoration: underline;
  font-size: inherit;
}

.link-btn:hover {
  color: var(--accent-hover);
}
</style>
