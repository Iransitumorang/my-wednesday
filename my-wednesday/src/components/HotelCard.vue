<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  hotel: { type: Object, required: true },
  index: { type: Number, default: 0 },
})

const hotelImage = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop'
</script>

<template>
  <RouterLink
    :to="{ name: 'hotel', params: { id: hotel.id } }"
    class="hotel-card"
    :style="{ '--delay': `${index * 0.08}s` }"
  >
    <div class="card-image-wrap">
      <img :src="hotelImage" :alt="hotel.name" class="card-image" />
    </div>
    <div class="card-body">
      <span class="card-location">{{ hotel.location }}</span>
      <h3 class="card-title">{{ hotel.name }}</h3>
    </div>
  </RouterLink>
</template>

<style scoped>
.hotel-card {
  display: block;
  text-decoration: none;
  color: inherit;
  background: var(--card-bg);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition:
    transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.4s ease,
    border-color 0.3s ease;
  animation: cardReveal 0.6s ease-out backwards;
  animation-delay: var(--delay);
}

.hotel-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
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

.card-image-wrap {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.hotel-card:hover .card-image {
  transform: scale(1.08);
}

.card-body {
  padding: 1.25rem;
}

.card-location {
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
  margin: 0;
  color: var(--text);
}
</style>
