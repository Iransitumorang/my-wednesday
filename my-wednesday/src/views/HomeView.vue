<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import { products, getBestSellers } from '../data/products'

const featured = products.slice(0, 3)
const bestSellers = getBestSellers().slice(0, 4)

const carouselProducts = products.slice(0, 3)

const slides = [
  {
    title: 'Curated',
    titleAccent: 'Essentials',
    sub: 'Koleksi pilihan untuk gaya hidup minimalis',
    cta: 'Explore Collection',
    link: '/shop',
    product: carouselProducts[0],
  },
  {
    title: 'New',
    titleAccent: 'Arrivals',
    sub: 'Temukan produk terbaru setiap minggu',
    cta: 'Lihat Koleksi',
    link: '/shop',
    product: carouselProducts[1],
  },
  {
    title: 'Best',
    titleAccent: 'Sellers',
    sub: 'Produk paling diminati pelanggan',
    cta: 'Beli Sekarang',
    link: '/shop',
    product: carouselProducts[2],
  },
]

const current = ref(0)
let autoplayTimer

const getAdjacentProducts = (i) => {
  const n = slides.length
  return {
    prev: slides[(i - 1 + n) % n]?.product,
    next: slides[(i + 1) % n]?.product,
  }
}

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

onMounted(() => {
  autoplayTimer = setInterval(next, 5000)
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
          <div class="hero-visual">
            <template v-if="slide.product">
              <div class="hero-cards-stack">
                <RouterLink
                  v-if="getAdjacentProducts(i).prev"
                  :to="{ name: 'product', params: { id: getAdjacentProducts(i).prev.id } }"
                  class="hero-card hero-card-left"
                >
                  <img :src="getAdjacentProducts(i).prev.image" :alt="getAdjacentProducts(i).prev.name" />
                </RouterLink>
                <div class="hero-card hero-card-center has-caption">
                  <RouterLink
                    :to="{ name: 'product', params: { id: slide.product.id } }"
                    class="hero-card-img"
                  >
                    <img :src="slide.product.image" :alt="slide.product.name" />
                  </RouterLink>
                  <div class="hero-card-caption">
                    <h2 class="caption-title">{{ slide.title }} <span class="accent">{{ slide.titleAccent }}</span></h2>
                    <p class="caption-sub">{{ slide.sub }}</p>
                    <RouterLink :to="slide.link" class="caption-cta">{{ slide.cta }}</RouterLink>
                  </div>
                </div>
                <RouterLink
                  v-if="getAdjacentProducts(i).next"
                  :to="{ name: 'product', params: { id: getAdjacentProducts(i).next.id } }"
                  class="hero-card hero-card-right"
                >
                  <img :src="getAdjacentProducts(i).next.image" :alt="getAdjacentProducts(i).next.name" />
                </RouterLink>
              </div>
            </template>
            <template v-else>
              <div class="floating-card card-1" />
              <div class="floating-card card-2" />
              <div class="floating-card card-3" />
            </template>
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
      <h2 class="section-title">Featured</h2>
      <div class="product-grid">
        <ProductCard v-for="(p, i) in featured" :key="p.id" :product="p" :index="i" />
      </div>
      <RouterLink to="/shop" class="section-link">View All</RouterLink>
    </section>
    <section class="bestsellers">
      <h2 class="section-title">Paling Laris Bulan Ini</h2>
      <p class="section-sub">Produk terpopuler yang dipilih pelanggan</p>
      <div class="product-grid">
        <ProductCard v-for="(p, i) in bestSellers" :key="p.id" :product="p" :index="i" />
      </div>
      <RouterLink to="/shop" class="section-link">Lihat Semua</RouterLink>
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

.hero::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 800px;
  height: 300px;
  background: radial-gradient(ellipse at center, rgba(201, 162, 39, 0.08) 0%, transparent 70%);
  pointer-events: none;
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
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1280px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rem;
}

.hero-slide {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rem;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.5s ease;
}

.hero-slide.active {
  position: relative;
  opacity: 1;
  pointer-events: auto;
}

.hero-slide-uniform.active .hero-visual {
  animation: cardZoomIn 0.6s ease-out;
}

@keyframes cardZoomIn {
  from {
    opacity: 0;
    transform: scale(0.92);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.hero-slide-uniform {
  justify-content: center;
}

.hero-slide-uniform .hero-visual {
  width: 600px;
  height: 420px;
}

.hero-slide-uniform .hero-card-center {
  width: 360px;
  height: 400px;
  margin-left: -180px;
  margin-top: -200px;
}

.hero-slide-uniform .hero-card-left {
  width: 150px;
  height: 195px;
  margin-top: -97px;
}

.hero-slide-uniform .hero-card-right {
  width: 150px;
  height: 195px;
  margin-top: -97px;
}

.hero-slide-uniform .hero-card-center.has-caption .hero-card-img {
  min-height: 220px;
}

.hero-visual {
  position: relative;
  width: 560px;
  height: 400px;
  flex-shrink: 0;
}

.hero-cards-stack {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-card {
  position: absolute;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease;
}

.hero-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-card-left {
  width: 140px;
  height: 180px;
  left: 0;
  top: 50%;
  margin-top: -90px;
  z-index: 1;
  transform: translateX(20%) scale(0.85) rotate(-3deg);
}

.hero-card-left:hover {
  transform: translateX(10%) scale(0.95) rotate(-1deg);
  box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(201, 162, 39, 0.15);
  z-index: 3;
}

.hero-card-right {
  width: 140px;
  height: 180px;
  right: 0;
  top: 50%;
  margin-top: -90px;
  z-index: 1;
  transform: translateX(-20%) scale(0.85) rotate(3deg);
}

.hero-card-right:hover {
  transform: translateX(-10%) scale(0.95) rotate(1deg);
  box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(201, 162, 39, 0.15);
  z-index: 3;
}

.hero-card-center {
  width: 320px;
  height: 380px;
  left: 50%;
  top: 50%;
  margin-left: -160px;
  margin-top: -190px;
  z-index: 2;
  transform: scale(1);
  box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08);
}

.hero-card-center:hover {
  transform: scale(1.02);
  box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(201, 162, 39, 0.2);
}

.hero-card-center .hero-card-img {
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.hero-card-center:not(.has-caption) .hero-card-img {
  border-radius: 24px;
}

.hero-card-center.has-caption {
  display: flex;
  flex-direction: column;
  padding: 0;
  background: rgba(30, 32, 45, 0.6);
}

.hero-card-center.has-caption .hero-card-img {
  flex: 1;
  min-height: 0;
  border-radius: 24px 24px 0 0;
}

.hero-card-center .hero-card-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-card-caption {
  padding: 1.35rem 1.6rem;
  background: linear-gradient(180deg, rgba(20, 22, 32, 0.98) 0%, rgba(16, 18, 28, 0.98) 100%);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
}

.caption-title {
  margin: 0 0 0.4rem 0;
  font-size: 1.6rem;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.caption-title .accent {
  color: var(--accent);
  text-shadow: 0 0 24px rgba(201, 162, 39, 0.25);
}

.caption-sub {
  font-size: 0.92rem;
  color: var(--text-muted);
  margin: 0 0 1rem 0;
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

.floating-card {
  position: absolute;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  animation: float 6s ease-in-out infinite;
}

.card-1 {
  width: 140px;
  height: 140px;
  top: 20%;
  right: 10%;
  animation-delay: 0s;
}

.card-2 {
  width: 100px;
  height: 100px;
  bottom: 25%;
  left: 5%;
  animation-delay: -2s;
}

.card-3 {
  width: 80px;
  height: 80px;
  top: 50%;
  left: 30%;
  animation-delay: -4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(3deg);
  }
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

.bestsellers {
  padding: 4rem 4rem 6rem;
}

.bestsellers .product-grid {
  grid-template-columns: repeat(4, 1fr);
}

.bestsellers .section-link {
  margin-top: 0.5rem;
}

.section-sub {
  color: var(--text-muted);
  font-size: 1rem;
  margin: -0.5rem 0 2rem 0;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 2.5rem 0;
  color: var(--text);
  animation: fadeUp 0.6s ease-out;
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

  .hero-carousel {
    flex-direction: column;
    text-align: center;
  }

  .hero-slide {
    flex-direction: column;
  }

  .hero-visual {
    width: 100%;
    max-width: 380px;
    height: 320px;
  }

  .hero-slide-uniform .hero-visual {
    max-width: 400px;
    height: 360px;
  }

  .hero-slide-uniform .hero-card-center {
    width: 280px;
    height: 320px;
    margin-left: -140px;
    margin-top: -160px;
  }

  .hero-card-left,
  .hero-card-right {
    width: 100px;
    height: 130px;
  }

  .hero-slide-uniform .hero-card-left,
  .hero-slide-uniform .hero-card-right {
    width: 110px;
    height: 145px;
    margin-top: -72px;
  }

  .hero-card-left {
    transform: translateX(30%) scale(0.8) rotate(-5deg);
  }

  .hero-card-right {
    transform: translateX(-30%) scale(0.8) rotate(5deg);
  }

  .hero-card-center {
    width: 260px;
    height: 300px;
  }

  .hero-card-center.has-caption .hero-card-caption {
    padding: 1rem 1.25rem;
  }

  .hero-slide-uniform .hero-card-center.has-caption .hero-card-img {
    min-height: 160px;
  }

  .caption-title {
    font-size: 1.25rem;
  }

  .featured,
  .bestsellers {
    padding: 3rem 1.5rem 4rem;
  }

  .product-grid,
  .bestsellers .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 500px) {
  .product-grid,
  .bestsellers .product-grid {
    grid-template-columns: 1fr;
  }
}
</style>
