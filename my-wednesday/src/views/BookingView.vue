<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createBooking } from '../api/booking'

const route = useRoute()
const router = useRouter()
const submitting = ref(false)
const error = ref(null)

const roomId = computed(() => route.query.roomId)
const hotelName = computed(() => route.query.hotelName || '')
const roomNumber = computed(() => route.query.roomNumber || '')
const checkIn = ref(route.query.checkIn || '')
const checkOut = ref(route.query.checkOut || '')

const canSubmit = computed(() => {
  return (
    roomId.value &&
    checkIn.value &&
    checkOut.value &&
    new Date(checkOut.value) > new Date(checkIn.value)
  )
})

const toApiDate = (val) => {
  if (!val) return ''
  const d = new Date(val)
  if (isNaN(d.getTime())) return val
  return d.toISOString().slice(0, 10)
}

const submit = async () => {
  if (!canSubmit.value || submitting.value) return
  submitting.value = true
  error.value = null
  try {
    const res = await createBooking({
      roomId: Number(roomId.value),
      checkInDate: toApiDate(checkIn.value),
      checkOutDate: toApiDate(checkOut.value),
    })
    router.push({
      name: 'success',
      state: { booking: res },
    })
  } catch (e) {
    error.value = e.status === 401
      ? 'Silakan login sebagai customer terlebih dahulu'
      : (e.message || 'Gagal membuat booking')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  if (!roomId.value) router.replace('/hotels')
})
</script>

<template>
  <div class="booking-page">
    <h1 class="page-title">Pesan Kamar</h1>
    <div v-if="roomId" class="booking-layout">
      <form class="booking-form" @submit.prevent="submit">
        <h2 class="form-title">{{ hotelName }} - Kamar {{ roomNumber }}</h2>
        <div class="form-row">
          <div class="form-group">
            <label>Check-in</label>
            <input v-model="checkIn" type="date" required />
          </div>
          <div class="form-group">
            <label>Check-out</label>
            <input v-model="checkOut" type="date" required />
          </div>
        </div>
        <p v-if="error" class="error-msg">{{ error }}</p>
        <button type="submit" class="btn-submit" :disabled="!canSubmit || submitting">
          {{ submitting ? 'Memproses...' : 'Konfirmasi Booking' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.booking-page {
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

.booking-layout {
  max-width: 480px;
}

.booking-form {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.form-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  color: var(--text);
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: var(--text);
  font-size: 1rem;
  font-family: inherit;
}

.form-group input:focus {
  outline: none;
  border-color: var(--accent);
}

.error-msg {
  color: #ff6b6b;
  font-size: 0.9rem;
  margin: 0 0 1rem 0;
}

.btn-submit {
  width: 100%;
  margin-top: 1rem;
  padding: 1rem;
  background: var(--accent);
  color: var(--bg);
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-submit:hover:not(:disabled) {
  background: var(--accent-hover);
  transform: translateY(-2px);
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .booking-page {
    padding: 6rem 1rem 3rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
