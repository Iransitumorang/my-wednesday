<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <RouterLink to="/" class="footer-logo">Iran Situmorang</RouterLink>
        <p class="footer-tagline">Curated essentials untuk gaya hidup minimalis</p>
      </div>
      <div class="footer-links">
        <div class="footer-col">
          <h4>Navigasi</h4>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/shop">Shop</RouterLink>
          <RouterLink to="/cart">Keranjang</RouterLink>
        </div>
        <div class="footer-col">
          <h4>Kategori</h4>
          <RouterLink to="/shop?cat=lifestyle">Lifestyle</RouterLink>
          <RouterLink to="/shop?cat=outerwear">Outerwear</RouterLink>
          <RouterLink to="/shop?cat=accessories">Accessories</RouterLink>
        </div>
        <div class="footer-col">
          <h4>Kontak</h4>
          <a href="mailto:hello@iransitumorang.com">hello@iransitumorang.com</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© {{ new Date().getFullYear() }} Iran Situmorang. All rights reserved.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: auto;
  background: linear-gradient(
    180deg,
    rgba(30, 32, 45, 0.6) 0%,
    rgba(25, 27, 38, 0.95) 100%
  );
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding: 3rem 2rem 1.5rem;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 3rem;
  margin-bottom: 2rem;
}

.footer-brand {
  max-width: 280px;
}

.footer-logo {
  display: inline-block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text);
  text-decoration: none;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
}

.footer-logo:hover {
  color: var(--accent);
}

.footer-tagline {
  color: var(--text-muted);
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
}

.footer-links {
  display: flex;
  gap: 3rem;
}

.footer-col h4 {
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin: 0 0 1rem 0;
}

.footer-col a {
  display: block;
  color: var(--text);
  text-decoration: none;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
}

.footer-col a:hover {
  color: var(--accent);
}

.footer-bottom {
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  text-align: center;
}

.footer-bottom p {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .footer-inner {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-links {
    flex-wrap: wrap;
    gap: 2rem;
  }
}
</style>
