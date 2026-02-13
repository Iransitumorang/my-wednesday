<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useUserStore } from '../stores/user'
import { getProductById } from '../data/products'
import ProductImage from '../components/ProductImage.vue'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()
const user = useUserStore()
const showReviews = ref(false)

const product = computed(() => getProductById(route.params.id))

const stars = (r) => '★'.repeat(Math.floor(r)) + '☆'.repeat(5 - Math.floor(r))

const requireAuth = (fn) => {
  if (!user.isLoggedIn) {
    router.push({ path: '/login', query: { returnUrl: route.fullPath } })
    return
  }
  fn()
}

const addAndCheckout = () => {
  if (!product.value) return
  requireAuth(() => {
    cart.add(product.value)
    router.push('/cart')
  })
}
</script>

<template>
  <div v-if="product" class="product-page">
    <button class="back-btn" @click="router.back()">← Back</button>
    <div class="product-layout">
      <div class="product-image-wrap">
        <ProductImage :src="product.image" :alt="product.name" />
      </div>
      <div class="product-info">
        <span class="product-category">{{ product.category }}</span>
        <h1 class="product-title">{{ product.name }}</h1>
        <div v-if="product.rating" class="product-meta">
          <span class="product-rating">{{ stars(product.rating) }}</span>
          <span class="product-sold">{{ (product.soldCount || 0).toLocaleString('id-ID') }} terjual</span>
        </div>
        <p class="product-desc">{{ product.description }}</p>
        <p class="product-price">{{ product.price.toLocaleString('id-ID') }}</p>
        <div class="product-actions">
          <button class="btn-primary" @click="addAndCheckout">Tambah ke Keranjang</button>
        </div>
      </div>
    </div>
    <div class="product-detail">
      <h3 class="detail-title">Deskripsi</h3>
      <p class="detail-text">{{ product.fullDescription || product.description }}</p>
      <div class="reviews-section">
        <button class="reviews-toggle" @click="showReviews = !showReviews">
          <span>Review ({{ product.reviews?.length || 0 }})</span>
          <span class="toggle-icon">{{ showReviews ? '−' : '+' }}</span>
        </button>
        <p v-if="!user.isLoggedIn" class="review-login-hint">Login untuk memberi penilaian</p>
        <Transition name="reveal">
          <div v-if="showReviews && product.reviews?.length" class="reviews-list">
            <div
              v-for="(r, i) in product.reviews"
              :key="i"
              class="review-item"
            >
              <div class="review-header">
                <span class="review-name">{{ r.name }}</span>
                <span class="review-stars">{{ stars(r.rating) }}</span>
              </div>
              <p class="review-text">{{ r.text }}</p>
              <span class="review-date">{{ r.date }}</span>
            </div>
          </div>
        </Transition>
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
  align-items: start;
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
  margin: 0 0 0.75rem 0;
  color: var(--text);
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.product-rating {
  color: #fbbf24;
  font-size: 1rem;
}

.product-sold {
  color: var(--text-muted);
  font-size: 0.9rem;
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
  margin: 0 0 1.5rem 0;
}

.product-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn-primary {
  padding: 0.9rem 2rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--accent);
  color: var(--bg);
  border: none;
}

.btn-primary:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
}

.product-detail {
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  animation: slideUp 0.6s ease-out 0.2s backwards;
}

.detail-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  color: var(--text);
}

.detail-text {
  color: var(--text-muted);
  line-height: 1.8;
  margin: 0 0 2rem 0;
}

.reviews-section {
  margin-top: 1.5rem;
}

.review-login-hint {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin: 0.75rem 0 0 0;
}

.reviews-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  color: var(--text);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reviews-toggle:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: var(--accent);
}

.toggle-icon {
  font-size: 1.25rem;
  color: var(--accent);
}

.reviews-list {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.review-item {
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.review-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.review-name {
  font-weight: 600;
  color: var(--text);
}

.review-stars {
  color: #fbbf24;
  font-size: 0.9rem;
}

.review-text {
  color: var(--text-muted);
  line-height: 1.5;
  margin: 0 0 0.5rem 0;
}

.review-date {
  font-size: 0.8rem;
  color: var(--text-muted);
  opacity: 0.8;
}

.reveal-enter-active,
.reveal-leave-active {
  transition: all 0.3s ease;
}

.reveal-enter-from,
.reveal-leave-to {
  opacity: 0;
  transform: translateY(-10px);
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
