<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HotelCard from '../components/HotelCard.vue'
import { getHotels } from '../api/booking'
import { swalToast } from '../utils/swal'

const route = useRoute()
const router = useRouter()
const hotels = ref([])
const loading = ref(true)

const searchQuery = ref(route.query.q || '')

const filteredHotels = computed(() => {
  const q = searchQuery.value?.trim().toLowerCase()
  if (!q) return hotels.value
  return hotels.value.filter(
    (h) =>
      h.name?.toLowerCase().includes(q) ||
      h.location?.toLowerCase().includes(q)
  )
})

watch(
  () => route.query.q,
  (q) => { searchQuery.value = q || '' }
)

const loadHotels = async () => {
  loading.value = true
  try {
    hotels.value = await getHotels(0, 50)
  } catch (e) {
    swalToast.error('Gagal memuat hotel', e.message)
  } finally {
    loading.value = false
  }
}

onMounted(loadHotels)
</script>

<template>
  <div class="shop">
    <div class="shop-header">
      <h1 class="page-title">Hotel</h1>
      <div class="search-wrap">
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Cari hotel atau lokasi..."
          class="search-input"
        />
        <button
          v-if="searchQuery"
          type="button"
          class="btn-clear"
          aria-label="Hapus"
          @click="searchQuery = ''; router.replace({ path: '/hotels', query: {} })"
        >
          ×
        </button>
      </div>
      <p v-if="route.query.q" class="search-hint">Hasil untuk "{{ route.query.q }}"</p>
    </div>
    <p v-if="loading" class="no-results">Memuat...</p>
    <p v-else-if="!filteredHotels.length" class="no-results">Tidak ada hotel</p>
    <div v-else class="product-grid">
      <HotelCard v-for="(h, i) in filteredHotels" :key="h.id" :hotel="h" :index="i" />
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
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.search-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-bottom: 1rem;
  max-width: 360px;
  width: 100%;
}

.search-wrap .search-input {
  flex: 1;
  padding: 0.6rem 2.25rem 0.6rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: var(--text);
  font-size: 1rem;
}

.search-wrap .search-input:focus {
  outline: none;
  border-color: var(--accent);
}

.search-wrap .btn-clear {
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
  font-size: 1.1rem;
  line-height: 1;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.search-wrap .btn-clear:hover {
  background: rgba(255, 255, 255, 0.15);
  color: var(--text);
}

.search-hint {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin: -0.5rem 0 1rem 0;
}

.no-results {
  color: var(--text-muted);
  text-align: center;
  padding: 3rem;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

@media (max-width: 1200px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .shop {
    padding: 6rem 1rem 3rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .product-grid {
    grid-template-columns: 1fr;
  }
}
</style>
