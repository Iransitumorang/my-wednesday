<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useUserStore } from '../stores/user'
import ProductImage from './ProductImage.vue'

const props = defineProps({
  product: { type: Object, required: true },
  index: { type: Number, default: 0 },
})

const cart = useCartStore()
const user = useUserStore()
const router = useRouter()

const requireAuth = (e, fn) => {
  e.preventDefault()
  if (!user.isLoggedIn) {
    router.push({ path: '/login', query: { returnUrl: router.currentRoute.value.fullPath } })
    return
  }
  fn()
}

const addToCart = (e) => {
  requireAuth(e, () => cart.add(props.product))
}

const buyNow = (e) => {
  requireAuth(e, () => {
    cart.clear()
    cart.add(props.product)
    cart.setCheckoutIds([props.product.id])
    router.push('/checkout')
  })
}

const stars = (r) => '★'.repeat(Math.floor(r)) + '☆'.repeat(5 - Math.floor(r))
</script>

<template>
  <RouterLink
    :to="{ name: 'product', params: { id: product.id } }"
    class="product-card"
    :style="{ '--delay': `${index * 0.08}s` }"
  >
    <div class="card-image-wrap">
      <ProductImage :src="product.image" :alt="product.name" img-class="card-image" />
      <div class="card-overlay">
        <button class="btn-add" @click="addToCart">+ Add to Cart</button>
        <button class="btn-buy" @click="buyNow">Buy Now</button>
      </div>
    </div>
    <div class="card-body">
      <span class="card-category">{{ product.category }}</span>
      <h3 class="card-title">{{ product.name }}</h3>
      <div v-if="product.rating" class="card-meta">
        <span class="card-rating">{{ stars(product.rating) }}</span>
        <span class="card-sold">{{ (product.soldCount || 0).toLocaleString('id-ID') }} terjual</span>
      </div>
      <p class="card-price">{{ product.price.toLocaleString('id-ID') }}</p>
    </div>
  </RouterLink>
</template>

<style scoped>
.product-card {
  display: block;
  text-decoration: none;
  color: inherit;
  background: var(--card-bg);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.4s ease,
    border-color 0.3s ease;
  animation: cardReveal 0.6s ease-out backwards;
  animation-delay: var(--delay);
}

.product-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  border-color: rgba(255, 255, 255, 0.1);
}

@keyframes cardReveal {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-image-wrap {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .card-image {
  transform: scale(1.08);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, transparent 50%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .card-overlay {
  opacity: 1;
}

.btn-add,
.btn-buy {
  padding: 0.55rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transform: translateY(10px);
  transition: transform 0.3s ease, background 0.3s ease, border-color 0.3s ease;
}

.product-card:hover .btn-add,
.product-card:hover .btn-buy {
  transform: translateY(0);
}

.btn-add {
  background: var(--accent);
  color: var(--bg);
  border: none;
}

.btn-add:hover {
  background: var(--accent-hover);
}

.btn-buy {
  background: transparent;
  color: var(--text);
  border: 2px solid rgba(255, 255, 255, 0.4);
}

.btn-buy:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.card-body {
  padding: 1.25rem;
}

.card-category {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--accent);
  display: block;
  margin-bottom: 0.35rem;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.4rem 0;
  color: var(--text);
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
}

.card-rating {
  color: #fbbf24;
}

.card-sold {
  color: var(--text-muted);
}

.card-price {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-muted);
  margin: 0;
}
</style>
