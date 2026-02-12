<script setup>
import { ref, computed } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import { getProductsByCategory } from '../data/products'

const filter = ref('')
const products = computed(() => getProductsByCategory(filter.value))
const categories = ['', 'lifestyle', 'outerwear', 'accessories']
const labels = { '': 'All', lifestyle: 'Lifestyle', outerwear: 'Outerwear', accessories: 'Accessories' }
</script>

<template>
  <div class="shop">
    <div class="shop-header">
      <h1 class="page-title">Shop</h1>
      <div class="filters">
        <button
          v-for="cat in categories"
          :key="cat || 'all'"
          class="filter-btn"
          :class="{ active: filter === cat }"
          @click="filter = cat"
        >
          {{ labels[cat] }}
        </button>
      </div>
    </div>
    <div class="product-grid">
      <ProductCard v-for="(p, i) in products" :key="p.id" :product="p" :index="i" />
    </div>
  </div>
</template>

<style scoped>
.shop {
  padding: 7rem 4rem 4rem;
  min-height: 100vh;
}

.shop-header {
  margin-bottom: 3rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 1.5rem 0;
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

.filters {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: var(--text-muted);
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  border-color: rgba(255, 255, 255, 0.25);
  color: var(--text);
}

.filter-btn.active {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--bg);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 600px) {
  .shop {
    padding: 6rem 1rem 3rem;
  }

  .page-title {
    font-size: 2rem;
  }
}
</style>
