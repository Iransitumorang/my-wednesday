<script setup>
import { useCartStore } from '../stores/cart'
import { RouterLink } from 'vue-router'

const cart = useCartStore()

const formatPrice = (n) => n.toLocaleString('id-ID')
</script>

<template>
  <div class="cart-page">
    <h1 class="page-title">Cart</h1>
    <div v-if="cart.count" class="cart-content">
      <TransitionGroup name="list" tag="div" class="cart-list">
        <div v-for="item in cart.items" :key="item.id" class="cart-item">
          <img :src="item.image" :alt="item.name" class="item-image" />
          <div class="item-info">
            <h3 class="item-name">{{ item.name }}</h3>
            <p class="item-price">{{ formatPrice(item.price) }}</p>
          </div>
          <div class="item-qty">
            <button class="qty-btn" @click="cart.updateQty(item.id, item.qty - 1)">−</button>
            <span class="qty-val">{{ item.qty }}</span>
            <button class="qty-btn" @click="cart.updateQty(item.id, item.qty + 1)">+</button>
          </div>
          <p class="item-total">{{ formatPrice(item.price * item.qty) }}</p>
          <button class="remove-btn" @click="cart.remove(item.id)">×</button>
        </div>
      </TransitionGroup>
      <div class="cart-footer">
        <p class="cart-total">Total: {{ formatPrice(cart.total) }}</p>
        <button class="btn-checkout">Checkout</button>
      </div>
    </div>
    <div v-else class="cart-empty">
      <p>Keranjang kosong</p>
      <RouterLink to="/shop" class="btn-shop">Lanjut Belanja</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.cart-page {
  padding: 7rem 4rem 4rem;
  min-height: 100vh;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 2rem 0;
  color: var(--text);
  animation: fadeUp 0.5s ease-out;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.cart-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  display: grid;
  grid-template-columns: 80px 1fr auto auto auto;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem;
  background: var(--card-bg);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.item-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: var(--text);
}

.item-price {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin: 0;
}

.item-qty {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.qty-btn {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: var(--text);
  border-radius: 6px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.qty-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.qty-val {
  min-width: 24px;
  text-align: center;
  font-weight: 600;
}

.item-total {
  font-weight: 700;
  color: var(--accent);
  margin: 0;
}

.remove-btn {
  width: 36px;
  height: 36px;
  background: rgba(255, 80, 80, 0.2);
  border: none;
  color: #ff6b6b;
  border-radius: 8px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.remove-btn:hover {
  background: rgba(255, 80, 80, 0.4);
}

.cart-footer {
  margin-top: 2rem;
  padding: 1.5rem;
  background: var(--card-bg);
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.cart-total {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text);
  margin: 0;
}

.btn-checkout {
  padding: 0.8rem 2rem;
  background: var(--accent);
  color: var(--bg);
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.3s ease;
}

.btn-checkout:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
}

.cart-empty {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-muted);
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.cart-empty p {
  margin: 0 0 1.5rem 0;
  font-size: 1.1rem;
}

.btn-shop {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background: var(--accent);
  color: var(--bg);
  text-decoration: none;
  font-weight: 600;
  border-radius: 10px;
  transition: background 0.3s ease, transform 0.3s ease;
}

.btn-shop:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.list-move {
  transition: transform 0.4s ease;
}

@media (max-width: 700px) {
  .cart-page {
    padding: 6rem 1rem 3rem;
  }

  .cart-item {
    grid-template-columns: 60px 1fr;
    grid-template-rows: auto auto auto;
    gap: 0.75rem;
  }

  .item-image {
    width: 60px;
    height: 60px;
  }

  .item-qty {
    grid-column: 2;
  }

  .item-total {
    grid-column: 2;
  }

  .remove-btn {
    grid-column: 2;
    justify-self: start;
  }

  .cart-footer {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
