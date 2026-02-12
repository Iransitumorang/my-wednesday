<script setup>
import { RouterLink } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import { products } from '../data/products'

const featured = products.slice(0, 3)
</script>

<template>
  <div class="home">
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="line">Curated</span>
          <span class="line accent">Essentials</span>
        </h1>
        <p class="hero-sub">Koleksi pilihan untuk gaya hidup minimalis</p>
        <RouterLink to="/shop" class="hero-cta">Explore Collection</RouterLink>
      </div>
      <div class="hero-visual">
        <div class="floating-card card-1" />
        <div class="floating-card card-2" />
        <div class="floating-card card-3" />
      </div>
    </section>

    <section class="featured">
      <h2 class="section-title">Featured</h2>
      <div class="product-grid">
        <ProductCard v-for="(p, i) in featured" :key="p.id" :product="p" :index="i" />
      </div>
      <RouterLink to="/shop" class="section-link">View All</RouterLink>
    </section>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
}

.hero {
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6rem 4rem 4rem;
  gap: 4rem;
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

.hero-title .line:nth-child(1) {
  animation-delay: 0.1s;
}

.hero-title .line.accent {
  color: var(--accent);
  animation-delay: 0.25s;
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
  animation: fadeUp 0.8s ease-out 0.4s backwards;
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
  animation: fadeUp 0.8s ease-out 0.55s backwards;
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

.featured {
  padding: 5rem 4rem 6rem;
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
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
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
    flex-direction: column;
    padding: 5rem 1.5rem 3rem;
    text-align: center;
  }

  .hero-visual {
    width: 280px;
    height: 280px;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .featured {
    padding: 3rem 1.5rem 4rem;
  }

  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
}
</style>
