<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useUserStore } from '../stores/user'
import ProductImage from '../components/ProductImage.vue'

const router = useRouter()
const cart = useCartStore()
const user = useUserStore()

const form = ref({
  nama: '',
  email: '',
  telepon: '',
  alamat: '',
  metode: 'transfer',
})

const metodeLabel = {
  transfer: 'Transfer Bank',
  ewallet: 'E-Wallet (OVO/GOPAY)',
  cc: 'Kartu Kredit',
}

const formatPrice = (n) => n.toLocaleString('id-ID')

const checkoutItems = computed(() =>
  cart.checkoutIds.length
    ? cart.itemsForIds(cart.checkoutIds)
    : cart.items
)
const checkoutTotal = computed(() =>
  cart.checkoutIds.length
    ? cart.totalForIds(cart.checkoutIds)
    : cart.total
)

const canSubmit = computed(() => {
  const f = form.value
  return f.nama.trim() && f.email.trim() && f.telepon.trim() && f.alamat.trim()
})

watch(
  () => user.isLoggedIn,
  (loggedIn) => {
    if (!loggedIn) router.replace({ path: '/login', query: { returnUrl: '/checkout' } })
  },
  { immediate: true }
)

const submit = () => {
  if (!canSubmit.value || !checkoutItems.value.length) return
  const ids = checkoutItems.value.map((i) => i.id)
  user.addPurchase()
  router.push({ name: 'success', state: { customer: { ...form.value } } })
  cart.clearPaid(ids)
}
</script>

<template>
  <div class="checkout-page">
    <h1 class="page-title">Checkout</h1>
    <div v-if="checkoutItems.length" class="checkout-layout">
      <form class="checkout-form" @submit.prevent="submit">
        <h2 class="form-title">Data Pemesan</h2>
        <div class="form-group">
          <label>Nama Lengkap</label>
          <input v-model="form.nama" type="text" placeholder="Masukkan nama" required />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input v-model="form.email" type="email" placeholder="email@contoh.com" required />
        </div>
        <div class="form-group">
          <label>No. Telepon</label>
          <input v-model="form.telepon" type="tel" placeholder="08xxxxxxxxxx" required />
        </div>
        <div class="form-group">
          <label>Alamat Pengiriman</label>
          <textarea v-model="form.alamat" rows="3" placeholder="Alamat lengkap" required />
        </div>
        <div class="form-group">
          <label>Metode Pembayaran</label>
          <select v-model="form.metode">
            <option value="transfer">{{ metodeLabel.transfer }}</option>
            <option value="ewallet">{{ metodeLabel.ewallet }}</option>
            <option value="cc">{{ metodeLabel.cc }}</option>
          </select>
          <div v-if="form.metode === 'transfer'" class="payment-info">
            <p>BCA 1234567890</p>
            <p>a.n. Iran Situmorang</p>
          </div>
          <div v-else-if="form.metode === 'ewallet'" class="payment-info">
            <p>Link pembayaran akan dikirim via SMS/WhatsApp</p>
          </div>
          <div v-else-if="form.metode === 'cc'" class="payment-info">
            <p>Data kartu akan diminta di halaman berikutnya</p>
          </div>
        </div>
        <button type="submit" class="btn-bayar" :disabled="!canSubmit">
          Bayar {{ formatPrice(checkoutTotal) }}
        </button>
      </form>
      <div class="order-summary">
        <h2 class="summary-title">Ringkasan Pesanan</h2>
        <div class="summary-list">
          <div v-for="item in checkoutItems" :key="item.id" class="summary-item">
            <div class="summary-img-wrap">
              <ProductImage :src="item.image" :alt="item.name" />
            </div>
            <div class="summary-info">
              <span class="summary-name">{{ item.name }}</span>
              <span class="summary-qty">× {{ item.qty }}</span>
            </div>
            <span class="summary-price">{{ formatPrice(item.price * item.qty) }}</span>
          </div>
        </div>
        <div class="summary-total">
          <span>Total</span>
          <span>{{ formatPrice(checkoutTotal) }}</span>
        </div>
      </div>
    </div>
    <div v-else class="checkout-empty">
      <p>Keranjang kosong</p>
      <button class="btn-back" @click="router.push('/shop')">Kembali ke Shop</button>
    </div>
  </div>
</template>

<style scoped>
.checkout-page {
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
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.checkout-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 3rem;
  align-items: start;
}

.checkout-form {
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

.form-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: var(--text);
  font-size: 1rem;
  font-family: inherit;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: var(--text-muted);
  opacity: 0.7;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--accent);
}

.payment-info {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: rgba(201, 162, 39, 0.1);
  border-radius: 8px;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.payment-info p {
  margin: 0.25rem 0;
}

.btn-bayar {
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

.btn-bayar:hover:not(:disabled) {
  background: var(--accent-hover);
  transform: translateY(-2px);
}

.btn-bayar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.order-summary {
  position: sticky;
  top: 6rem;
  background: var(--card-bg);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.summary-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  color: var(--text);
}

.summary-list {
  max-height: 280px;
  overflow-y: auto;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.summary-img-wrap {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.summary-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.summary-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.summary-name {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text);
}

.summary-qty {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.summary-price {
  font-weight: 600;
  color: var(--accent);
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.checkout-empty {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-muted);
}

.checkout-empty p {
  margin: 0 0 1.5rem 0;
}

.btn-back {
  padding: 0.8rem 1.5rem;
  background: var(--accent);
  color: var(--bg);
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-back:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
}

@media (max-width: 900px) {
  .checkout-page {
    padding: 6rem 1rem 3rem;
  }

  .checkout-layout {
    grid-template-columns: 1fr;
  }

  .order-summary {
    position: static;
  }
}
</style>
