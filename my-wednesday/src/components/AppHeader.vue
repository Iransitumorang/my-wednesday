<script setup>
import { useCartStore } from '../stores/cart'
import { RouterLink } from 'vue-router'

const cart = useCartStore()
</script>

<template>
  <header class="header">
    <RouterLink to="/" class="logo">
      <span class="logo-text">Wednesday</span>
    </RouterLink>
    <nav class="nav">
      <RouterLink to="/" class="nav-link" active-class="active">Home</RouterLink>
      <RouterLink to="/shop" class="nav-link" active-class="active">Shop</RouterLink>
      <RouterLink to="/cart" class="nav-link cart-link" active-class="active">
        <span class="cart-icon">🛒</span>
        <span v-if="cart.count" class="cart-badge">{{ cart.count }}</span>
      </RouterLink>
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: rgba(18, 18, 20, 0.85);
  backdrop-filter: blur(12px);
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
  color: var(--text);
  font-weight: 700;
  font-size: 1.5rem;
  letter-spacing: 0.02em;
  transition: color 0.3s ease;
}

.logo:hover {
  color: var(--accent);
}

.nav {
  display: flex;
  align-items: center;
  gap: 2rem;
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

@media (max-width: 600px) {
  .header {
    padding: 0.75rem 1rem;
  }

  .logo-text {
    font-size: 1.25rem;
  }

  .nav {
    gap: 1rem;
  }

  .nav-link {
    font-size: 0.85rem;
  }
}
</style>
