<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getBookings, cancelBooking } from '../api/booking'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const bookings = ref([])
const loading = ref(true)
const error = ref(null)
const customerFilter = ref('')

const isAdmin = computed(() => auth.isAdmin)
const filterValue = computed(() =>
  isAdmin.value && customerFilter.value?.trim()
    ? customerFilter.value.trim()
    : auth.username || ''
)

const filteredBookings = computed(() => bookings.value)

const formatDate = (d) => {
  if (!d) return '-'
  const t = typeof d === 'string' ? new Date(d) : d
  return t.toLocaleDateString('id-ID')
}

const loadBookings = async () => {
  if (!auth.isLoggedIn) return
  loading.value = true
  error.value = null
  try {
    bookings.value = await getBookings(filterValue.value)
  } catch (e) {
    error.value = e.message || 'Gagal memuat booking'
  } finally {
    loading.value = false
  }
}

const doCancel = async (id) => {
  if (!confirm('Batalkan booking ini?')) return
  try {
    await cancelBooking(id)
    loadBookings()
  } catch (e) {
    error.value = e.message || 'Gagal membatalkan'
  }
}

const clearFilter = () => {
  customerFilter.value = ''
}

onMounted(loadBookings)
watch(filterValue, loadBookings)
</script>

<template>
  <div class="bookings-page">
    <h1 class="page-title">Booking Saya</h1>
    <div v-if="isAdmin" class="filter-wrap">
      <div class="input-wrap">
        <input
          v-model="customerFilter"
          type="text"
          placeholder="Filter nama pemesan..."
          class="filter-input"
        />
        <button
          v-if="customerFilter"
          type="button"
          class="btn-clear"
          aria-label="Hapus"
          @click="clearFilter"
        >
          ×
        </button>
      </div>
    </div>
    <p v-if="!auth.isLoggedIn" class="no-results">Silakan login untuk melihat booking</p>
    <p v-else-if="error" class="error-msg">{{ error }}</p>
    <p v-else-if="loading" class="loading-msg">Memuat...</p>
    <p v-else-if="!filteredBookings.length" class="no-results">Tidak ada booking</p>
    <div v-else class="bookings-list">
      <div
        v-for="b in filteredBookings"
        :key="b.id"
        class="booking-card"
        :class="{ cancelled: b.status === 'CANCELLED' }"
      >
        <div class="booking-info">
          <span class="booking-id">#{{ b.id }}</span>
          <h3 class="booking-hotel">{{ b.room?.hotel?.name || '-' }}</h3>
          <p class="booking-room">Kamar {{ b.room?.roomNumber || '-' }} ({{ b.room?.type || '-' }})</p>
          <p class="booking-dates">
            {{ formatDate(b.checkInDate) }} – {{ formatDate(b.checkOutDate) }}
          </p>
          <p class="booking-customer">{{ b.customerName }}</p>
          <span class="booking-status" :class="b.status?.toLowerCase()">{{ b.status }}</span>
        </div>
        <button
          v-if="b.status !== 'CANCELLED'"
          class="btn-cancel"
          @click="doCancel(b.id)"
        >
          Batalkan
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bookings-page {
  padding: 7rem 4rem 4rem;
  min-height: 100vh;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 2rem 0;
  color: var(--text);
  animation: fadeUp 0.5s ease-out;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.filter-wrap {
  margin-bottom: 1.5rem;
}

.input-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.filter-input {
  padding: 0.6rem 2.25rem 0.6rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: var(--text);
  font-size: 1rem;
  font-family: inherit;
  min-width: 320px;
}

.filter-input:focus {
  outline: none;
  border-color: var(--accent);
}

.btn-clear {
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

.btn-clear:hover {
  background: rgba(255, 255, 255, 0.15);
  color: var(--text);
}

.error-msg,
.loading-msg {
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.no-results {
  color: var(--text-muted);
  text-align: center;
  padding: 3rem;
}

.bookings-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.booking-card {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
  padding: 1.5rem;
  background: var(--card-bg);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.booking-card.cancelled {
  opacity: 0.6;
}

.booking-info {
  flex: 1;
}

.booking-id {
  font-size: 0.8rem;
  color: var(--text-muted);
  display: block;
  margin-bottom: 0.25rem;
}

.booking-hotel {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.35rem 0;
  color: var(--text);
}

.booking-room,
.booking-dates,
.booking-customer {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin: 0.15rem 0;
}

.booking-status {
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
}

.booking-status.booked,
.booking-status.confirmed {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.booking-status.cancelled {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.btn-cancel {
  padding: 0.5rem 1rem;
  background: rgba(255, 80, 80, 0.2);
  border: 1px solid rgba(255, 80, 80, 0.3);
  color: #ff6b6b;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  background: rgba(255, 80, 80, 0.3);
}

@media (max-width: 600px) {
  .bookings-page {
    padding: 6rem 1rem 3rem;
  }

  .booking-card {
    flex-direction: column;
  }

  .filter-input {
    min-width: 100%;
  }
}
</style>
