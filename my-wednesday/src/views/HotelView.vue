<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import RoomCard from '../components/RoomCard.vue'
import { getHotel, getHotelRooms, getRoomAvailability, getBookings } from '../api/booking'
import { swalToast } from '../utils/swal'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const hotel = ref(null)
const rooms = ref([])
const loading = ref(true)

const checkIn = ref('')
const checkOut = ref('')
const availabilityMap = ref({})
const userBookedRoomIds = ref(new Set())
const filterType = ref('')
const filterPriceMin = ref('')
const filterPriceMax = ref('')

const hasDates = computed(() => !!(checkIn.value && checkOut.value))

const roomAvailability = computed(() => {
  const map = {}
  ;(rooms.value || []).forEach((r) => {
    if (r?.id == null) return
    if (!hasDates.value) map[r.id] = false
    else map[r.id] = availabilityMap.value[r.id] === true
  })
  return map
})

const filteredRooms = computed(() => {
  let list = rooms.value || []
  if (filterType.value?.trim()) {
    list = list.filter((r) => (r.type || '').toUpperCase() === filterType.value.toUpperCase())
  }
  const min = Number(filterPriceMin.value)
  const max = Number(filterPriceMax.value)
  if (!isNaN(min) && min > 0) list = list.filter((r) => (r.price ?? 0) >= min)
  if (!isNaN(max) && max > 0) list = list.filter((r) => (r.price ?? 0) <= max)
  return list
})

const ROOM_TYPES = ['STANDARD', 'DELUXE', 'SUITE']

const minPrice = computed(() => {
  const prices = (rooms.value || []).map((r) => r.price).filter((p) => p != null && p > 0)
  return prices.length ? Math.min(...prices).toLocaleString('id-ID') : '0'
})

const loadUserBookings = async () => {
  if (!auth.isLoggedIn || !auth.username) return
  try {
    const list = await getBookings(auth.username, 0, 100)
    const ids = new Set()
    ;(list || []).forEach((b) => {
      if (b?.status === 'BOOKED' && b?.room?.id) ids.add(b.room.id)
    })
    userBookedRoomIds.value = ids
  } catch (_) {
    userBookedRoomIds.value = new Set()
  }
}

const loadData = async () => {
  const id = route.params.id
  if (!id) return
  loading.value = true
  hotel.value = null
  rooms.value = []
  try {
    const [hotelRes, roomsRes] = await Promise.allSettled([
      getHotel(id),
      getHotelRooms(id),
    ])
    if (hotelRes.status === 'fulfilled' && hotelRes.value) {
      hotel.value = hotelRes.value
    } else {
      swalToast.error('Hotel tidak ditemukan', hotelRes.reason?.message)
    }
    if (roomsRes.status === 'fulfilled') {
      rooms.value = Array.isArray(roomsRes.value) ? roomsRes.value : []
    } else {
      swalToast.error('Gagal memuat kamar', roomsRes.reason?.message)
      rooms.value = []
    }
  } catch (e) {
    swalToast.error('Gagal memuat data', e?.message)
  } finally {
    loading.value = false
  }
  loadUserBookings()
}

const checkAvailability = async () => {
  if (!checkIn.value || !checkOut.value) return
  const map = {}
  for (const r of rooms.value) {
    try {
      const res = await getRoomAvailability(r.id, checkIn.value, checkOut.value)
      map[r.id] = res?.available !== false
    } catch (_) {
      map[r.id] = false
    }
  }
  availabilityMap.value = map
}

watch(
  () => [checkIn.value, checkOut.value],
  () => { checkAvailability() },
  { deep: true }
)

watch(() => route.params.id, loadData)

const onBook = (room) => {
  if (!roomAvailability.value[room.id]) return
  router.push({
    name: 'book',
    query: {
      roomId: room.id,
      hotelId: hotel.value?.id,
      hotelName: hotel.value?.name,
      roomNumber: room.roomNumber,
      checkIn: checkIn.value,
      checkOut: checkOut.value,
    },
  })
}

onMounted(loadData)
</script>

<template>
  <div v-if="hotel" class="hotel-page">
    <button class="back-btn" @click="router.back()">← Back</button>
    <div class="hotel-header">
      <h1 class="hotel-title">{{ hotel.name }}</h1>
      <p class="hotel-location">{{ hotel.location }}</p>
      <p class="hotel-info">Harga mulai Rp {{ minPrice }} / malam · {{ rooms.length }} kamar</p>
    </div>
    <div class="date-filter">
      <div class="form-group">
        <label>Check-in</label>
        <input v-model="checkIn" type="date" />
      </div>
      <div class="form-group">
        <label>Check-out</label>
        <input v-model="checkOut" type="date" />
      </div>
    </div>
    <p v-if="!hasDates" class="date-hint">Pilih tanggal check-in & check-out untuk cek ketersediaan kamar</p>
    <div class="room-filters">
      <div class="filter-group">
        <label>Tipe Kamar</label>
        <select v-model="filterType">
          <option value="">Semua</option>
          <option v-for="t in ROOM_TYPES" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>
      <div class="filter-group">
        <label>Harga Min</label>
        <input v-model="filterPriceMin" type="number" min="0" placeholder="Rp" />
      </div>
      <div class="filter-group">
        <label>Harga Max</label>
        <input v-model="filterPriceMax" type="number" min="0" placeholder="Rp" />
      </div>
    </div>
    <h2 class="rooms-title">Kamar ({{ filteredRooms.length }})</h2>
    <p v-if="!filteredRooms.length" class="no-rooms-msg">Belum ada kamar tersedia di hotel ini</p>
    <div v-else class="room-grid">
      <RoomCard
        v-for="(r, i) in filteredRooms"
        :key="r.id"
        :room="r"
        :index="i"
        :available="roomAvailability[r.id]"
        :has-dates="hasDates"
        :already-booked="userBookedRoomIds.has(r.id)"
        @book="onBook"
      />
    </div>
  </div>
  <div v-else-if="loading" class="page-state loading-state">
    <p class="loading-msg">Memuat...</p>
  </div>
  <div v-else class="page-state not-found">
    <h2>Hotel tidak ditemukan</h2>
    <button @click="router.push('/hotels')">Kembali ke Hotel</button>
  </div>
</template>

<style scoped>
.hotel-page {
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
}

.back-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.hotel-header {
  margin-bottom: 2rem;
}

.hotel-title {
  font-size: 2.25rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: var(--text);
}

.hotel-location {
  font-size: 1rem;
  color: var(--accent);
  margin: 0 0 0.25rem 0;
}

.hotel-info {
  font-size: 0.95rem;
  color: var(--text-muted);
  margin: 0;
}

.room-filters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.filter-group label {
  display: block;
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 0.35rem;
}

.filter-group select,
.filter-group input {
  padding: 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: var(--text);
  font-size: 0.95rem;
  min-width: 120px;
}

.date-filter {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 0.35rem;
}

.form-group input {
  padding: 0.6rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: var(--text);
  font-size: 1rem;
}

.date-hint {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin: -0.5rem 0 1rem 0;
}

.no-rooms-msg {
  color: var(--text-muted);
  font-size: 1rem;
  margin: 0 0 1.5rem 0;
}

.rooms-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  color: var(--text);
}

.page-state {
  padding: 7rem 4rem 4rem;
  min-height: 100vh;
}

.loading-state .loading-msg {
  color: var(--text-muted);
}

.page-state.not-found {
  text-align: center;
  color: var(--text-muted);
}

.room-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
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
  .hotel-page {
    padding: 6rem 1rem 3rem;
  }

  .hotel-title {
    font-size: 1.75rem;
  }
}
</style>
