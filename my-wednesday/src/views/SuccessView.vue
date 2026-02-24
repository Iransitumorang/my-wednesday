<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const booking = computed(() => history.state?.booking)
const customerName = computed(() => history.state?.customerName || booking.value?.customerName)

const goHotels = () => router.push('/hotels')
const goBookings = () => router.push('/bookings')
</script>

<template>
  <div class="success-page">
    <div class="success-card">
      <div class="success-icon">✓</div>
      <h1 class="success-title">Booking Berhasil</h1>
      <p class="success-msg">Terima kasih. Reservasi kamar Anda telah dikonfirmasi.</p>
      <template v-if="booking">
        <p class="success-detail">
          No. Booking: <strong>#{{ booking.id }}</strong>
        </p>
        <p v-if="customerName" class="success-detail">
          Pemesan: {{ customerName }}
        </p>
      </template>
      <div class="success-actions">
        <button class="btn-continue" @click="goBookings">Lihat Booking Saya</button>
        <button class="btn-secondary" @click="goHotels">Cari Hotel Lain</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.success-page {
  min-height: 100vh;
  padding: 7rem 2rem 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-card {
  text-align: center;
  max-width: 420px;
  padding: 3rem;
  background: var(--card-bg);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  animation: successPop 0.6s ease-out;
}

@keyframes successPop {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.success-icon {
  width: 72px;
  height: 72px;
  margin: 0 auto 1.5rem;
  background: var(--accent);
  color: var(--bg);
  font-size: 2rem;
  font-weight: 700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-title {
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0 0 0.75rem 0;
  color: var(--text);
}

.success-msg {
  color: var(--text-muted);
  line-height: 1.6;
  margin: 0 0 1rem 0;
}

.success-detail {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin: 0 0 0.5rem 0;
}

.success-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.btn-continue {
  padding: 0.9rem 2rem;
  background: var(--accent);
  color: var(--bg);
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-continue:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
}

.btn-secondary {
  padding: 0.7rem 1.5rem;
  background: transparent;
  color: var(--text-muted);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  border-color: var(--accent);
  color: var(--accent);
}
</style>
