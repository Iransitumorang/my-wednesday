<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import HotelCard from '../components/HotelCard.vue'
import { getHotels } from '../api/booking'
import { swalToast } from '../utils/swal'

const hotels = ref([])
const loading = ref(true)

const slides = [
  { title: 'Temukan', titleAccent: 'Hotel', sub: 'Pilih hotel favorit untuk menginap', cta: 'Lihat Hotel', link: '/hotels', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80' },
  { title: 'Pesan', titleAccent: 'Kamar', sub: 'Cek ketersediaan dan booking dengan mudah', cta: 'Cari Hotel', link: '/hotels', img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920&q=80' },
  { title: 'Nikmati', titleAccent: 'Liburan', sub: 'Konfirmasi booking dan siap menginap', cta: 'Booking Saya', link: '/bookings', img: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1920&q=80' },
]

const current = ref(0)
let autoplayTimer

const goTo = (i) => {
  current.value = i
  resetAutoplay()
}

const next = () => {
  current.value = (current.value + 1) % slides.length
  resetAutoplay()
}

const prev = () => {
  current.value = (current.value - 1 + slides.length) % slides.length
  resetAutoplay()
}

const resetAutoplay = () => {
  clearInterval(autoplayTimer)
  autoplayTimer = setInterval(next, 5000)
}

const starfield = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: (i * 13 + 7) % 100,
  y: (i * 17 + 11) % 100,
  size: (i % 3) + 1,
  delay: (i % 20) * 0.2,
  duration: 2 + (i % 3),
}))

onMounted(async () => {
  autoplayTimer = setInterval(next, 5000)
  try {
    hotels.value = await getHotels(0, 6)
  } catch (e) {
    swalToast.error('Gagal memuat hotel', e.message)
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  clearInterval(autoplayTimer)
})
</script>

<template>
  <div class="home">
    <section class="hero">
      <div class="hero-cosmic" aria-hidden="true">
        <div class="starfield">
          <span
            v-for="s in starfield"
            :key="s.id"
            class="star"
            :class="`star-${s.size}`"
            :style="{
              left: `${s.x}%`,
              top: `${s.y}%`,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }"
          />
        </div>
        <div class="cosmic-orbs">
          <div class="orb orb-1" />
          <div class="orb orb-2" />
          <div class="orb orb-3" />
        </div>
        <div class="cosmic-dust" />
      </div>
      <div class="hero-carousel">
        <div
          v-for="(slide, i) in slides"
          :key="i"
          class="hero-slide hero-slide-uniform"
          :class="{ active: current === i }"
        >
          <div class="hero-visual" :style="{ backgroundImage: `url(${slide.img})` }">
            <div class="hero-content">
              <h2 class="caption-title">{{ slide.title }} <span class="accent">{{ slide.titleAccent }}</span></h2>
              <div class="caption-sub-box">
                <p class="caption-sub">{{ slide.sub }}</p>
              </div>
              <RouterLink :to="slide.link" class="caption-cta">{{ slide.cta }}</RouterLink>
            </div>
          </div>
        </div>
      </div>
      <div class="carousel-controls">
        <button class="carousel-btn prev" aria-label="Previous" @click="prev">‹</button>
        <div class="carousel-dots">
          <button
            v-for="(_, i) in slides"
            :key="i"
            class="dot"
            :class="{ active: current === i }"
            :aria-label="`Slide ${i + 1}`"
            @click="goTo(i)"
          />
        </div>
        <button class="carousel-btn next" aria-label="Next" @click="next">›</button>
      </div>
    </section>

    <section class="featured">
      <h2 class="section-title">Hotel Tersedia</h2>
      <div v-if="loading" class="section-loading">Memuat...</div>
      <div v-else-if="!hotels.length" class="section-loading">Tidak ada hotel</div>
      <div v-else class="product-grid">
        <HotelCard v-for="(h, i) in hotels" :key="h.id" :hotel="h" :index="i" />
      </div>
      <RouterLink v-if="!loading && hotels.length" to="/hotels" class="section-link">Lihat Semua</RouterLink>
    </section>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
}

.hero {
  position: relative;
  min-height: 92vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 4rem 5rem;
  overflow: hidden;
}

.hero-cosmic {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.starfield {
  position: absolute;
  inset: 0;
}

.star {
  position: absolute;
  background: #fff;
  border-radius: 50%;
  animation: twinkle ease-in-out infinite;
  transform: translate(-50%, -50%);
}

.star-1 {
  width: 2px;
  height: 2px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 0 6px 1px rgba(255, 255, 255, 0.6);
}

.star-2 {
  width: 3px;
  height: 3px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 0 8px 2px rgba(255, 255, 255, 0.7);
}

.star-3 {
  width: 4px;
  height: 4px;
  background: #fff;
  box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.8), 0 0 20px 4px rgba(255, 255, 255, 0.3);
}

@keyframes twinkle {
  0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(0.9); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

.cosmic-orbs {
  position: absolute;
  inset: 0;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%);
  top: -10%;
  left: -5%;
  animation: orbFloat1 18s ease-in-out infinite;
}

.orb-2 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%);
  bottom: -15%;
  right: -8%;
  animation: orbFloat2 22s ease-in-out infinite;
}

.orb-3 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(201, 162, 39, 0.2) 0%, transparent 70%);
  top: 40%;
  right: 10%;
  animation: orbFloat3 20s ease-in-out infinite;
}

@keyframes orbFloat1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -20px) scale(1.05); }
  66% { transform: translate(-20px, 30px) scale(0.95); }
}

@keyframes orbFloat2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-40px, -30px) scale(1.08); }
  66% { transform: translate(25px, 20px) scale(0.92); }
}

@keyframes orbFloat3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-15px, -25px) scale(1.03); }
}

.cosmic-dust {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(139, 92, 246, 0.03) 20%,
    transparent 40%,
    rgba(6, 182, 212, 0.02) 60%,
    transparent 80%,
    rgba(201, 162, 39, 0.02) 100%
  );
  animation: cosmicDust 12s ease-in-out infinite;
}

@keyframes cosmicDust {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.hero-carousel {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
}

.hero-slide {
  position: absolute;
  inset: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.5s ease;
}

.hero-slide.active {
  opacity: 1;
  pointer-events: auto;
}

.hero-visual {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 7rem;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.hero-visual::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.4) 0%, rgba(15, 23, 42, 0.75) 100%);
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 2rem;
}

.caption-title {
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.caption-title .accent {
  color: var(--accent);
  text-shadow: 0 0 24px rgba(201, 162, 39, 0.25);
}

.caption-sub-box {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.85rem 1.5rem;
  margin: 0 0 1.5rem 0;
}

.caption-sub {
  font-size: 1.1rem;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.4;
}

.caption-cta {
  display: inline-block;
  padding: 0.7rem 1.5rem;
  background: linear-gradient(135deg, var(--accent) 0%, #a88b1a 100%);
  color: var(--bg);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(201, 162, 39, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.caption-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(201, 162, 39, 0.4);
}

.carousel-controls {
  position: absolute;
  z-index: 2;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.carousel-btn {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 50%;
  color: var(--text);
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.carousel-btn:hover {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--bg);
  transform: scale(1.08);
}

.carousel-dots {
  display: flex;
  gap: 0.5rem;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot:hover,
.dot.active {
  background: var(--accent);
  transform: scale(1.2);
  box-shadow: 0 0 12px rgba(201, 162, 39, 0.2);
}

.featured {
  padding: 5rem 4rem 4rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 2.5rem 0;
  color: var(--text);
  animation: fadeUp 0.6s ease-out;
}

.section-loading {
  color: var(--text-muted);
  margin-bottom: 2rem;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.section-link {
  display: inline-block;
  color: var(--accent);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: color 0.3s ease, transform 0.3s ease;
}

.section-link:hover {
  color: var(--accent-hover);
  transform: translateX(4px);
}

@media (max-width: 900px) {
  .hero {
    padding: 5rem 1.5rem 5rem;
  }

  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .featured {
    padding: 3rem 1.5rem 4rem;
  }
}

@media (max-width: 500px) {
  .product-grid {
    grid-template-columns: 1fr;
  }
}
</style>
