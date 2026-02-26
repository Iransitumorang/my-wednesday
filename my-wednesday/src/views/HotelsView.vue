<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import HotelCard from '../components/HotelCard.vue'
import { getHotels, getRooms, getBookings } from '../api/booking'
import { swalToast } from '../utils/swal'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const hotels = ref([])
const rooms = ref([])
const loading = ref(true)
const roomsLoading = ref(true)
const roomsError = ref(false)
const userBookedRoomIds = ref(new Set())

const searchQuery = ref(route.query.q || '')
const filterLocation = ref('')
const filterRoomType = ref('')

const locations = computed(() => {
  const fromHotels = (hotels.value || []).map((h) => h.location)
  const fromRooms = (rooms.value || []).map((r) => r.hotel?.location)
  const locs = [...new Set([...fromHotels, ...fromRooms].filter(Boolean))]
  return locs.sort()
})

const filteredHotels = computed(() => {
  let list = hotels.value || []
  const q = searchQuery.value?.trim().toLowerCase()
  if (q) {
    list = list.filter(
      (h) =>
        h.name?.toLowerCase().includes(q) ||
        h.location?.toLowerCase().includes(q)
    )
  }
  if (filterLocation.value?.trim()) {
    list = list.filter((h) => (h.location || '').toLowerCase() === filterLocation.value.toLowerCase())
  }
  return list
})

const filteredRooms = computed(() => {
  let list = rooms.value || []
  const q = searchQuery.value?.trim().toLowerCase()
  if (q) {
    list = list.filter(
      (r) =>
        r.roomNumber?.toLowerCase().includes(q) ||
        r.type?.toLowerCase().includes(q) ||
        r.hotel?.name?.toLowerCase().includes(q) ||
        r.hotel?.location?.toLowerCase().includes(q)
    )
  }
  if (filterLocation.value?.trim()) {
    list = list.filter((r) => (r.hotel?.location || '').toLowerCase() === filterLocation.value.toLowerCase())
  }
  if (filterRoomType.value?.trim()) {
    list = list.filter((r) => (r.type || '').toUpperCase() === filterRoomType.value.toUpperCase())
  }
  return list
})

const ROOM_TYPES = ['STANDARD', 'DELUXE', 'SUITE']
const formatPrice = (n) => (n ?? 0).toLocaleString('id-ID')

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

const loadUserBookings = async () => {
  if (!auth.isLoggedIn) return
  try {
    const customer = auth.isAdmin ? '' : auth.username
    const list = await getBookings(customer, 0, 100)
    const ids = new Set()
    ;(list || []).forEach((b) => {
      if (b?.status === 'BOOKED' && b?.room?.id) ids.add(b.room.id)
    })
    userBookedRoomIds.value = ids
  } catch (_) {
    userBookedRoomIds.value = new Set()
  }
}

const loadRooms = async () => {
  roomsLoading.value = true
  roomsError.value = false
  try {
    rooms.value = await getRooms(0, 50)
  } catch (e) {
    roomsError.value = true
    rooms.value = []
  } finally {
    roomsLoading.value = false
  }
  loadUserBookings()
}

onMounted(() => {
  loadHotels()
  loadRooms()
})
</script>

<template>
  <div class="shop">
    <div class="shop-header">
      <h1 class="page-title">Hotel</h1>
      <div class="filters-row">
        <div class="search-wrap">
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Cari hotel, kamar atau lokasi..."
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
        <div class="filter-location">
          <select v-model="filterLocation" class="filter-select">
            <option value="">Semua Lokasi</option>
            <option v-for="loc in locations" :key="loc" :value="loc">{{ loc }}</option>
          </select>
        </div>
        <div class="filter-location">
          <select v-model="filterRoomType" class="filter-select">
            <option value="">Semua Tipe Kamar</option>
            <option v-for="t in ROOM_TYPES" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
      </div>
      <p v-if="route.query.q" class="search-hint">Hasil untuk "{{ route.query.q }}"</p>
    </div>

    <section class="rooms-section">
      <h2 class="section-title">Kamar Tersedia</h2>
      <p v-if="roomsLoading" class="no-results">Memuat kamar...</p>
      <p v-else-if="roomsError" class="section-hint">Tidak dapat memuat daftar kamar. Klik hotel untuk lihat kamar.</p>
      <p v-else-if="!filteredRooms.length" class="no-results">Tidak ada kamar</p>
      <div v-else class="rooms-list">
        <component
          v-for="r in filteredRooms"
          :key="r.id"
          :is="userBookedRoomIds.has(r.id) ? 'div' : 'router-link'"
          :to="userBookedRoomIds.has(r.id) ? undefined : { name: 'room', params: { id: r.id } }"
          class="room-item"
          :class="{ 'room-item--sold': userBookedRoomIds.has(r.id) }"
        >
          <div class="room-item-main">
            <span class="room-item-type">{{ r.type }}</span>
            <h3 class="room-item-title">Kamar {{ r.roomNumber }}</h3>
            <p class="room-item-hotel">{{ r.hotel?.name }} · {{ r.hotel?.location }}</p>
          </div>
          <div class="room-item-right">
            <span v-if="userBookedRoomIds.has(r.id)" class="room-item-sold">Sudah terjual</span>
            <div class="room-item-price">Rp {{ formatPrice(r.price) }}/malam</div>
          </div>
        </component>
      </div>
    </section>

    <section class="hotels-section">
      <h2 class="section-title">Hotel</h2>
      <p v-if="loading" class="no-results">Memuat...</p>
      <p v-else-if="!filteredHotels.length" class="no-results">Tidak ada hotel</p>
      <div v-else class="product-grid">
        <HotelCard v-for="(h, i) in filteredHotels" :key="h.id" :hotel="h" :index="i" />
      </div>
    </section>
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

.filters-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: flex-end;
  margin-bottom: 1rem;
}

.search-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  max-width: 360px;
  width: 100%;
}

.filter-location .filter-select {
  padding: 0.6rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: var(--text);
  font-size: 1rem;
  min-width: 180px;
}

.filter-location .filter-select:focus {
  outline: none;
  border-color: var(--accent);
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

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1.25rem 0;
  color: var(--text);
}

.section-hint {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin: 0 0 1rem 0;
}

.rooms-section {
  margin-bottom: 3rem;
}

.rooms-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.room-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 1.25rem;
  background: var(--card-bg);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

.room-item:hover:not(.room-item--sold) {
  border-color: rgba(255, 255, 255, 0.12);
  transform: translateX(4px);
}

.room-item--sold {
  opacity: 0.65;
  cursor: default;
  pointer-events: none;
}

.room-item-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.room-item-sold {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.15);
  padding: 0.35rem 0.65rem;
  border-radius: 6px;
}

.room-item-type {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--accent);
  display: block;
  margin-bottom: 0.25rem;
}

.room-item-title {
  font-size: 1.05rem;
  font-weight: 600;
  margin: 0 0 0.2rem 0;
  color: var(--text);
}

.room-item-hotel {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0;
}

.room-item-price {
  font-size: 1rem;
  font-weight: 600;
  color: var(--accent);
  white-space: nowrap;
}

.hotels-section .section-title {
  margin-bottom: 1.5rem;
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
