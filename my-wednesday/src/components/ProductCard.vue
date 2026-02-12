<script setup>
import { RouterLink } from 'vue-router'
import { useCartStore } from '../stores/cart'

const props = defineProps({
  product: { type: Object, required: true },
  index: { type: Number, default: 0 },
})

const cart = useCartStore()

const addToCart = (e) => {
  e.preventDefault()
  cart.add(props.product)
}
</script>

<template>
  <RouterLink
    :to="{ name: 'product', params: { id: product.id } }"
    class="product-card"
    :style="{ '--delay': `${index * 0.08}s` }"
  >
    <div class="card-image-wrap">
      <img :src="product.image" :alt="product.name" class="card-image" />
      <div class="card-overlay">
        <button class="btn-add" @click="addToCart">+ Add to Cart</button>
      </div>
    </div>
    <div class="card-body">
      <span class="card-category">{{ product.category }}</span>
      <h3 class="card-title">{{ product.name }}</h3>
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
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 50%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 1.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .card-overlay {
  opacity: 1;
}

.btn-add {
  padding: 0.6rem 1.2rem;
  background: var(--accent);
  color: var(--bg);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transform: translateY(10px);
  transition: transform 0.3s ease, background 0.3s ease;
}

.product-card:hover .btn-add {
  transform: translateY(0);
}

.btn-add:hover {
  background: var(--accent-hover);
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
  margin: 0 0 0.5rem 0;
  color: var(--text);
}

.card-price {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-muted);
  margin: 0;
}
</style>
