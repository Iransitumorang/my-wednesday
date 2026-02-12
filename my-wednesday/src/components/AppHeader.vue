<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useCartStore } from '../stores/cart'
import { useUserStore } from '../stores/user'
import { useRouter, useRoute, RouterLink } from 'vue-router'

const cart = useCartStore()
const user = useUserStore()
const router = useRouter()
const route = useRoute()
const searchQuery = ref(route.query.q || '')
const showUserMenu = ref(false)

watch(
  () => route.query.q,
  (q) => {
    searchQuery.value = q || ''
  }
)

const onSearch = (e) => {
  e?.preventDefault()
  const q = searchQuery.value.trim()
  if (q) router.push({ path: '/shop', query: { q } })
  else router.push('/shop')
}

const logout = () => {
  showUserMenu.value = false
  user.logout()
}

const closeMenu = (e) => {
  if (!e.target.closest('.user-wrap')) showUserMenu.value = false
}

onMounted(() => {
  document.addEventListener('click', closeMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenu)
})
</script>

<template>
  <header class="header">
    <RouterLink to="/" class="logo">
      <span class="logo-text">Iran Situmorang</span>
    </RouterLink>
    <form class="search-wrap" @submit="onSearch">
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Cari produk..."
        class="search-input"
        aria-label="Cari produk"
      />
      <button type="submit" class="search-btn" aria-label="Cari">🔍</button>
    </form>
    <nav class="nav">
      <RouterLink to="/" class="nav-link" active-class="active">Home</RouterLink>
      <RouterLink to="/shop" class="nav-link" active-class="active">Shop</RouterLink>
      <RouterLink to="/cart" class="nav-link cart-link" active-class="active">
        <span class="cart-icon">🛒</span>
        <span v-if="cart.count" class="cart-badge">{{ cart.count }}</span>
      </RouterLink>
      <RouterLink v-if="!user.isLoggedIn" to="/login" class="btn-login">Masuk</RouterLink>
      <div v-else class="user-wrap" @click="showUserMenu = !showUserMenu">
        <div class="user-avatar">IS</div>
        <div class="user-info">
          <span class="user-name">{{ user.name }}</span>
          <span class="user-role">{{ user.tierLabel }}</span>
        </div>
        <Transition name="dropdown">
          <div v-if="showUserMenu" class="user-dropdown" @click.stop>
            <button class="dropdown-item" @click="logout">Keluar</button>
          </div>
        </Transition>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 2rem;
  background: rgba(30, 32, 45, 0.9);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  animation: slideDown 0.6s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logo {
  text-decoration: none;
  font-weight: 700;
  font-size: 1.5rem;
  letter-spacing: 0.02em;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.03);
}

.logo-text {
  background: linear-gradient(
    90deg,
    #e8e8ed 0%,
    #c9a227 20%,
    #7c3aed 40%,
    #06b6d4 60%,
    #c9a227 80%,
    #e8e8ed 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: logoGradient 6s linear infinite;
}

@keyframes logoGradient {
  0% {
    background-position: 0% center;
  }
  100% {
    background-position: 200% center;
  }
}

.search-wrap {
  display: flex;
  align-items: center;
  max-width: 320px;
  width: 100%;
  justify-self: center;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.search-wrap:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px rgba(201, 162, 39, 0.2);
}

.search-input {
  flex: 1;
  padding: 0.6rem 1rem;
  background: transparent;
  border: none;
  color: var(--text);
  font-size: 0.9rem;
  outline: none;
}

.search-input::placeholder {
  color: var(--text-muted);
}

.search-btn {
  padding: 0.5rem 0.75rem;
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 1rem;
  transition: color 0.3s ease;
}

.search-btn:hover {
  color: var(--accent);
}

.nav {
  display: flex;
  align-items: center;
  gap: 2rem;
  justify-self: end;
}

.nav-link {
  position: relative;
  text-decoration: none;
  color: var(--text-muted);
  font-size: 0.95rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--accent);
  transition: width 0.3s ease;
}

.nav-link:hover,
.nav-link.active {
  color: var(--text);
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 100%;
}

.cart-link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.cart-icon {
  font-size: 1.1rem;
}

.cart-badge {
  position: absolute;
  top: -6px;
  right: -10px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--bg);
  background: var(--accent);
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: popIn 0.4s ease-out;
}

.btn-login {
  padding: 0.5rem 1rem;
  background: var(--accent);
  color: var(--bg);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: 10px;
  transition: background 0.3s ease, transform 0.3s ease;
}

.btn-login:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
}

.user-wrap {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.75rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  margin-left: 0.5rem;
  cursor: pointer;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: var(--card-bg);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  min-width: 140px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 0.6rem 1rem;
  background: transparent;
  border: none;
  color: var(--text);
  text-align: left;
  font-size: 0.9rem;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.dropdown-item:hover {
  background: rgba(255, 80, 80, 0.2);
  color: #ff6b6b;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--accent) 0%, #a88b1a 100%);
  color: var(--bg);
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 0.05rem;
}

.user-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text);
}

.user-role {
  font-size: 0.7rem;
  color: var(--text-muted);
}

@keyframes popIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .header {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    gap: 0.75rem;
  }

  .search-wrap {
    grid-column: 1 / -1;
    order: 3;
    max-width: none;
  }
}

@media (max-width: 600px) {
  .header {
    padding: 0.75rem 1rem;
  }

  .logo-text {
    font-size: 1.25rem;
  }

  .nav {
    gap: 0.75rem;
  }

  .nav-link {
    font-size: 0.85rem;
  }

  .user-info {
    display: none;
  }

  .user-wrap {
    padding: 0.25rem 0.5rem;
  }
}
</style>
