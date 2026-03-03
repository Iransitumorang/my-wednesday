<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { swalToast } from '../utils/swal'
import { humanizeApiError } from '../utils/errorMsg'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const mode = ref('login')
const form = ref({ username: 'admin', password: 'admin123', name: '' })
const showPassword = ref(false)
const loading = ref(false)

const submit = async () => {
  const { username, password, name } = form.value
  if (!username?.trim() || !password?.trim()) return
  if (mode.value === 'register' && !name?.trim()) return
  loading.value = true
  try {
    if (mode.value === 'login') {
      await auth.login(username.trim(), password)
    } else {
      await auth.register(username.trim(), password, name.trim())
    }
    const returnUrl = route.query.returnUrl
    const dest = auth.isAdmin ? (returnUrl?.startsWith('/admin') ? returnUrl : '/admin/hotels') : (returnUrl || '/')
    router.push(dest)
  } catch (e) {
    const msg = humanizeApiError(e)
    swalToast.error(mode.value === 'login' ? 'Gagal login' : 'Gagal daftar', msg)
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
  selectedRole.value = null
  form.value = mode.value === 'login' ? { ...CREDS.admin, name: '' } : { username: '', password: '', name: '' }
}

const selectedRole = ref('admin')

const fillCreds = (role) => {
  selectedRole.value = role
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
      <p v-if="mode === 'register'" class="register-hint">Daftar sebagai Customer. Akun Admin dibuat oleh sistem.</p>
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
        <button type="submit" class="btn-login" :disabled="loading">
          {{ loading ? 'Memproses...' : (mode === 'login' ? 'Masuk' : 'Daftar') }}
        </button>
      </form>
      <div v-if="mode === 'login'" class="cred-selector">
        <button
          type="button"
          class="cred-btn cred-admin"
          :class="{ active: selectedRole === 'admin' }"
          @click="fillCreds('admin')"
        >
          <span class="cred-icon">⚙</span>
          <span>Admin</span>
        </button>
        <button
          type="button"
          class="cred-btn cred-customer"
          :class="{ active: selectedRole === 'customer' }"
          @click="fillCreds('customer')"
        >
          <span class="cred-icon">👤</span>
          <span>Customer</span>
        </button>
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
  margin: 0 0 0.5rem 0;
  color: var(--text);
  text-align: center;
}

.register-hint {
  font-size: 0.9rem;
  color: var(--text-muted);
  text-align: center;
  margin: 0 0 1.5rem 0;
  padding: 0.5rem 1rem;
  background: rgba(34, 211, 238, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(34, 211, 238, 0.2);
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

.cred-selector {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
  margin-bottom: 1.25rem;
}

.cred-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.85rem 1rem;
  border: 2px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
}

.cred-admin {
  background: rgba(139, 92, 246, 0.08);
  color: #a78bfa;
}

.cred-admin:hover,
.cred-admin.active {
  background: rgba(139, 92, 246, 0.2);
  border-color: rgba(139, 92, 246, 0.5);
  color: #c4b5fd;
}

.cred-customer {
  background: rgba(34, 211, 238, 0.08);
  color: #22d3ee;
}

.cred-customer:hover,
.cred-customer.active {
  background: rgba(34, 211, 238, 0.2);
  border-color: rgba(34, 211, 238, 0.5);
  color: #67e8f9;
}

.cred-icon {
  font-size: 1.1rem;
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
  margin-bottom: 1.5rem;
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
