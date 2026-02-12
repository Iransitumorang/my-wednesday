<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const route = useRoute()
const user = useUserStore()
const form = ref({ email: '', password: '' })

const login = () => {
  const email = form.value.email?.trim()
  const name = email ? email.split('@')[0] : 'Iran Situmorang'
  user.login(name)
  const returnUrl = route.query.returnUrl || '/'
  router.push(returnUrl)
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <h1 class="login-title">Masuk</h1>
      <form @submit.prevent="login" class="login-form">
        <div class="form-group">
          <label>Email</label>
          <input v-model="form.email" type="email" placeholder="email@contoh.com" />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input v-model="form.password" type="password" placeholder="••••••••" />
        </div>
        <button type="submit" class="btn-login">Masuk</button>
      </form>
      <p class="login-hint">Demo: kosongkan form untuk login</p>
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

.form-group input {
  width: 100%;
  padding: 0.85rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: var(--text);
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: var(--accent);
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

.btn-login:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
}

.login-hint {
  font-size: 0.8rem;
  color: var(--text-muted);
  text-align: center;
  margin: 1rem 0 0 0;
}
</style>
