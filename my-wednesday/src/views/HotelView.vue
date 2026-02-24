<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RoomCard from '../components/RoomCard.vue'
import { getHotel, getHotelRooms, getRoomAvailability } from '../api/booking'

const route = useRoute()
const router = useRouter()
const hotel = ref(null)
const rooms = ref([])
const loading = ref(true)
const error = ref(null)

const checkIn = ref('')
const checkOut = ref('')
const availabilityMap = ref({})

const roomAvailability = computed(() => {
  const map = {}
  rooms.value.forEach((r) => {
    map[r.id] = availabilityMap.value[r.id] ?? true
  })
  return map
})

const loadData = async () => {
  loading.value = true
  error.value = null
  try {
    const [h, r] = await Promise.all([
      getHotel(route.params.id),
      getHotelRooms(route.params.id),
    ])
    hotel.value = h
    rooms.value = r || []
  } catch (e) {
    error.value = e.message || 'Gagal memuat data'
  } finally {
    loading.value = false
  }
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

const onBook = (room) => {
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
    <h2 class="rooms-title">Kamar Tersedia</h2>
    <p v-if="error" class="error-msg">{{ error }}</p>
    <div v-else class="room-grid">
      <RoomCard
        v-for="(r, i) in rooms"
        :key="r.id"
        :room="r"
        :index="i"
        :available="roomAvailability[r.id]"
        @book="onBook"
      />
    </div>
  </div>
  <div v-else-if="loading" class="loading-msg">Memuat...</div>
  <div v-else class="not-found">
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
  margin: 0;
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

.rooms-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  color: var(--text);
}

.error-msg,
.loading-msg {
  color: var(--text-muted);
  margin-bottom: 1rem;
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
