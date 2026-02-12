<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const customer = computed(() => route.params.customer || history.state?.customer || {})

const goShop = () => router.push('/shop')
</script>

<template>
  <div class="success-page">
    <div class="success-card">
      <div class="success-icon">✓</div>
      <h1 class="success-title">Pembayaran Berhasil</h1>
      <p class="success-msg">Terima kasih atas pembelian Anda. Pesanan akan diproses segera.</p>
      <template v-if="customer?.nama">
        <p class="success-detail">Konfirmasi akan dikirim ke <strong>{{ customer.email }}</strong></p>
      </template>
      <button class="btn-continue" @click="goShop">Lanjut Belanja</button>
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
  margin: 0 0 1.5rem 0;
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
</style>
