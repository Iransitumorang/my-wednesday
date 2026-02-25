<script setup>
defineProps({
  room: { type: Object, required: true },
  index: { type: Number, default: 0 },
  available: { type: Boolean, default: true },
  hasDates: { type: Boolean, default: true },
})

const emit = defineEmits(['book'])

const formatPrice = (n) => (n ?? 0).toLocaleString('id-ID')
</script>

<template>
  <div class="room-card" :style="{ '--delay': `${index * 0.08}s` }">
    <div class="card-body">
      <span class="card-type">{{ room.type }}</span>
      <h3 class="card-title">Kamar {{ room.roomNumber }}</h3>
      <p class="card-price">Rp {{ formatPrice(room.price) }} / malam</p>
      <button
        class="btn-book"
        :disabled="!available"
        @click="emit('book', room)"
      >
        {{ available ? 'Pesan' : (hasDates ? 'Tidak tersedia' : 'Pilih tanggal') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.room-card {
  background: var(--card-bg);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  overflow: hidden;
  transition: all 0.3s ease;
  animation: cardReveal 0.6s ease-out backwards;
  animation-delay: var(--delay);
}

.room-card:hover {
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

.card-body {
  padding: 1.25rem;
}

.card-type {
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
  margin: 0 0 1rem 0;
}

.btn-book {
  width: 100%;
  padding: 0.6rem 1rem;
  background: var(--accent);
  color: var(--bg);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
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
</style>
