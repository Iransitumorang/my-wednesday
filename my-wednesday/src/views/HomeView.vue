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
      <div class="hero-carousel">
        <div
          v-for="(slide, i) in slides"
          :key="i"
          class="hero-slide"
          :class="{ active: current === i }"
        >
          <div class="hero-content">
            <h1 class="hero-title">
              <span class="line">{{ slide.title }}</span>
              <span class="line accent">{{ slide.titleAccent }}</span>
            </h1>
            <p class="hero-sub">{{ slide.sub }}</p>
            <RouterLink :to="slide.link" class="hero-cta">{{ slide.cta }}</RouterLink>
          </div>
          <div class="hero-visual">
            <RouterLink
              v-if="slide.product"
              :to="{ name: 'product', params: { id: slide.product.id } }"
              class="hero-product-img"
            >
              <img :src="slide.product.image" :alt="slide.product.name" />
            </RouterLink>
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
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 4rem 4rem;
  overflow: hidden;
}

.hero-carousel {
  position: relative;
  width: 100%;
  max-width: 1200px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4rem;
}

.hero-slide {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4rem;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.6s ease;
}

.hero-slide.active {
  position: relative;
  opacity: 1;
  pointer-events: auto;
}

.hero-content {
  flex: 1;
  max-width: 520px;
}

.hero-title {
  margin: 0 0 1rem 0;
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.hero-title .line {
  display: block;
  animation: fadeUp 0.8s ease-out backwards;
}

.hero-slide.active .hero-title .line:nth-child(1) {
  animation: fadeUp 0.6s ease-out forwards;
}

.hero-title .line.accent {
  color: var(--accent);
}

.hero-slide.active .hero-title .line.accent {
  animation: fadeUp 0.6s ease-out 0.15s backwards;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-sub {
  font-size: 1.15rem;
  color: var(--text-muted);
  margin: 0 0 2rem 0;
}

.hero-cta {
  display: inline-block;
  padding: 0.9rem 2rem;
  background: var(--accent);
  color: var(--bg);
  text-decoration: none;
  font-weight: 600;
  border-radius: 10px;
  transition: transform 0.3s ease, background 0.3s ease;
}

.hero-cta:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
}

.hero-visual {
  position: relative;
  width: 380px;
  height: 380px;
  flex-shrink: 0;
}

.hero-product-img {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}

.hero-product-img:hover {
  transform: scale(1.03);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.hero-product-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.carousel-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
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

  .hero-content {
    max-width: none;
  }

  .hero-visual {
    width: 280px;
    height: 280px;
  }

  .hero-title {
    font-size: 2.5rem;
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
