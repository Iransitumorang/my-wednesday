<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import RoomCard from '../components/RoomCard.vue'
import {
  getRoom,
  getHotelRooms,
  getRoomAvailability,
  getBookings,
} from '../api/booking'
import { swalToast } from '../utils/swal'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const room = ref(null)
const otherRooms = ref([])
const loading = ref(true)

const checkIn = ref(route.query.checkIn || '')
const checkOut = ref(route.query.checkOut || '')
const available = ref(null)
const userBookedRoomIds = ref(new Set())

const hasDates = computed(() => !!(checkIn.value && checkOut.value))

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
  room.value = null
  otherRooms.value = []
  available.value = null
  try {
    const r = await getRoom(id)
    if (!r) {
      router.replace('/hotels')
      return
    }
    room.value = r
    if (r.hotel?.id) {
      const list = await getHotelRooms(r.hotel.id, 0, 50)
      otherRooms.value = (list || []).filter((x) => x?.id !== r.id)
    }
  } catch (e) {
    swalToast.error('Gagal memuat kamar', e?.message)
    router.replace('/hotels')
  } finally {
    loading.value = false
  }
  loadUserBookings()
}

const checkAvailability = async () => {
  if (!room.value?.id || !checkIn.value || !checkOut.value) return
  try {
    const res = await getRoomAvailability(room.value.id, checkIn.value, checkOut.value)
    available.value = res?.available !== false
  } catch (_) {
    available.value = false
  }
}

watch(
  () => [checkIn.value, checkOut.value],
  () => { checkAvailability() },
  { deep: true }
)

watch(() => route.params.id, loadData)
watch(
  () => [route.query.checkIn, route.query.checkOut],
  ([ci, co]) => {
    if (ci) checkIn.value = ci
    if (co) checkOut.value = co
  }
)

const canBook = computed(() => {
  if (!room.value?.id) return false
  if (userBookedRoomIds.value.has(room.value.id)) return false
  if (!hasDates.value) return false
  return available.value === true
})

const onBook = () => {
  if (!canBook.value || !room.value) return
  router.push({
    name: 'book',
    query: {
      roomId: room.value.id,
      hotelId: room.value.hotel?.id,
      hotelName: room.value.hotel?.name,
      roomNumber: room.value.roomNumber,
      checkIn: checkIn.value,
      checkOut: checkOut.value,
    },
  })
}

const onBookOther = (r) => {
  router.push({
    name: 'room',
    params: { id: r.id },
  })
}

const formatPrice = (n) => (n ?? 0).toLocaleString('id-ID')
const ROOM_TYPES = ['STANDARD', 'DELUXE', 'SUITE']

onMounted(loadData)
</script>

<template>
  <div v-if="room" class="room-page">
    <button class="back-btn" @click="router.back()">← Kembali</button>
    <div class="room-header">
      <span class="room-type">{{ room.type }}</span>
      <h1 class="room-title">Kamar {{ room.roomNumber }}</h1>
      <p class="room-hotel">{{ room.hotel?.name }} · {{ room.hotel?.location }}</p>
      <p class="room-price">Rp {{ formatPrice(room.price) }} / malam</p>
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
    <p v-if="!hasDates" class="date-hint">Pilih tanggal check-in & check-out untuk cek ketersediaan</p>
    <div v-else class="availability-status">
      <span v-if="available === null" class="status-pending">Memeriksa...</span>
      <span v-else-if="available" class="status-ok">Tersedia</span>
      <span v-else class="status-no">Tidak tersedia</span>
    </div>
    <div class="book-section">
      <button
        class="btn-book"
        :disabled="!canBook"
        @click="onBook"
      >
        {{ userBookedRoomIds.has(room.id) ? 'Sudah dipesan' : (canBook ? 'Pesan Kamar Ini' : (hasDates ? 'Tidak tersedia' : 'Pilih tanggal')) }}
      </button>
    </div>

    <section v-if="otherRooms.length" class="other-rooms">
      <h2 class="section-title">Kamar lain di {{ room.hotel?.name }}</h2>
      <div class="room-grid">
        <RoomCard
          v-for="(r, i) in otherRooms"
          :key="r.id"
          :room="r"
          :index="i"
          :available="true"
          :has-dates="true"
          :already-booked="userBookedRoomIds.has(r.id)"
          link-label="Lihat"
          @book="onBookOther"
        />
      </div>
      <p class="section-hint">Klik kamar untuk melihat detail dan memesan</p>
    </section>
  </div>
  <div v-else-if="loading" class="page-state loading-state">
    <p class="loading-msg">Memuat...</p>
  </div>
</template>

<style scoped>
.room-page {
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

.room-header {
  margin-bottom: 2rem;
}

.room-type {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--accent);
  display: block;
  margin-bottom: 0.25rem;
}

.room-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
  color: var(--text);
}

.room-hotel {
  font-size: 1rem;
  color: var(--text-muted);
  margin: 0 0 0.5rem 0;
}

.room-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--accent);
  margin: 0;
}

.date-filter {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
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
  margin: 0 0 1rem 0;
}

.availability-status {
  margin-bottom: 1rem;
}

.status-pending {
  color: var(--text-muted);
  font-size: 0.95rem;
}

.status-ok {
  color: #4ade80;
  font-size: 0.95rem;
  font-weight: 600;
}

.status-no {
  color: #ff6b6b;
  font-size: 0.95rem;
  font-weight: 600;
}

.book-section {
  margin-bottom: 3rem;
}

.btn-book {
  padding: 0.75rem 2rem;
  background: var(--accent);
  color: var(--bg);
  border: none;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-book:hover:not(:disabled) {
  background: var(--accent-hover);
  transform: translateY(-2px);
}

.btn-book:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.other-rooms {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  color: var(--text);
}

.section-hint {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-top: 1rem;
}

.room-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.page-state {
  padding: 7rem 4rem 4rem;
  min-height: 100vh;
}

.loading-msg {
  color: var(--text-muted);
}

@media (max-width: 600px) {
  .room-page {
    padding: 6rem 1rem 3rem;
  }

  .room-title {
    font-size: 1.5rem;
  }
}
</style>
