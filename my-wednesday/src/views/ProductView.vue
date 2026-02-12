<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { getProductById } from '../data/products'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()

const product = computed(() => getProductById(route.params.id))

const addAndGo = () => {
  if (product.value) {
    cart.add(product.value)
    router.push('/cart')
  }
}

const addToCart = () => {
  if (product.value) cart.add(product.value)
}
</script>

<template>
  <div v-if="product" class="product-page">
    <button class="back-btn" @click="router.back()">← Back</button>
    <div class="product-layout">
      <div class="product-image-wrap">
        <img :src="product.image" :alt="product.name" class="product-image" />
      </div>
      <div class="product-info">
        <span class="product-category">{{ product.category }}</span>
        <h1 class="product-title">{{ product.name }}</h1>
        <p class="product-desc">{{ product.description }}</p>
        <p class="product-price">{{ product.price.toLocaleString('id-ID') }}</p>
        <div class="product-actions">
          <button class="btn-primary" @click="addAndGo">Add to Cart & Checkout</button>
          <button class="btn-secondary" @click="addToCart">Add to Cart</button>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="not-found">
    <h2>Produk tidak ditemukan</h2>
    <button @click="router.push('/shop')">Kembali ke Shop</button>
  </div>
</template>

<style scoped>
.product-page {
  padding: 7rem 4rem 4rem;
  min-height: 100vh;
}

.back-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: var(--text-muted);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  animation: fadeIn 0.5s ease-out;
}

.back-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.product-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.product-image-wrap {
  aspect-ratio: 1;
  border-radius: 16px;
  overflow: hidden;
  background: var(--card-bg);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  padding: 1rem 0;
}

.product-category {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--accent);
  display: block;
  margin-bottom: 0.5rem;
}

.product-title {
  font-size: 2.25rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  color: var(--text);
}

.product-desc {
  color: var(--text-muted);
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
}

.product-price {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 2rem 0;
}

.product-actions {
  display: flex;
  gap: 1rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.9rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: var(--accent);
  color: var(--bg);
  border: none;
}

.btn-primary:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
}

.btn-secondary {
  background: transparent;
  color: var(--text);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.not-found {
  padding: 7rem 4rem;
  text-align: center;
  color: var(--text-muted);
}

.not-found button {
  margin-top: 1rem;
  padding: 0.6rem 1.2rem;
  background: var(--accent);
  color: var(--bg);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

@media (max-width: 900px) {
  .product-page {
    padding: 6rem 1rem 3rem;
  }

  .product-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .product-title {
    font-size: 1.75rem;
  }

  .product-actions {
    flex-direction: column;
  }
}
</style>
