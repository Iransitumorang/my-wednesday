<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  getHotel,
  getHotelRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from '../api/booking'
import { swalToast, swalConfirm } from '../utils/swal'

const route = useRoute()
const router = useRouter()
const hotel = ref(null)
const rooms = ref([])
const loading = ref(true)
const editing = ref(null)
const addMode = ref(false)
const form = ref({ roomNumber: '', type: 'STANDARD', price: 0 })

const ROOM_TYPES = ['STANDARD', 'DELUXE', 'SUITE']

const loadData = async () => {
  const id = route.params.id
  if (!id) return
  loading.value = true
  try {
    const [h, r] = await Promise.allSettled([
      getHotel(id),
      getHotelRooms(id, 0, 100),
    ])
    if (h.status === 'fulfilled' && h.value) hotel.value = h.value
    else router.replace('/admin/hotels')
    rooms.value = r.status === 'fulfilled' && Array.isArray(r.value) ? r.value : []
  } catch (e) {
    swalToast.error('Gagal memuat', e.message)
  } finally {
    loading.value = false
  }
}

const getNextRoomNumber = () => {
  const nums = rooms.value
    .map((r) => parseInt(String(r.roomNumber || '').replace(/\D/g, ''), 10))
    .filter((n) => !isNaN(n))
  const max = nums.length ? Math.max(...nums) : 0
  return String(max + 1).padStart(3, '0')
}

const openAdd = () => {
  editing.value = null
  addMode.value = true
  form.value = { roomNumber: getNextRoomNumber(), type: 'STANDARD', price: 0 }
}

const openEdit = (r) => {
  editing.value = r.id
  addMode.value = false
  form.value = {
    roomNumber: r.roomNumber || '',
    type: r.type || 'STANDARD',
    price: r.price ?? 0,
  }
}

const cancelEdit = () => {
  editing.value = null
  addMode.value = false
}

const saveRoom = async () => {
  const { roomNumber, type, price } = form.value
  if (!roomNumber?.trim() || !type?.trim()) return
  try {
    const body = {
      roomNumber: roomNumber.trim(),
      type: (type || '').trim().toUpperCase(),
      price: Number(price) || 0,
      hotelId: hotel.value?.id,
    }
    if (editing.value) {
      await updateRoom(editing.value, body)
    } else {
      await createRoom(body)
    }
    swalToast.success('Berhasil', 'Kamar berhasil disimpan')
    cancelEdit()
    loadData()
  } catch (e) {
    swalToast.error('Gagal menyimpan', e.message)
  }
}

const doDelete = async (id) => {
  const { isConfirmed } = await swalConfirm({ title: 'Hapus kamar ini?' })
  if (!isConfirmed) return
  try {
    await deleteRoom(id)
    swalToast.success('Berhasil', 'Kamar berhasil dihapus')
    loadData()
  } catch (e) {
    swalToast.error('Gagal menghapus', e.message)
  }
}

const formatPrice = (n) => (n ?? 0).toLocaleString('id-ID')

onMounted(loadData)
watch(() => route.params.id, loadData)
</script>

<template>
  <div class="admin-page">
    <div class="admin-header">
      <div>
        <button class="back-btn" @click="router.push('/admin/hotels')">← Kembali</button>
        <h1 class="page-title">{{ hotel?.name || 'Kamar' }}</h1>
      </div>
      <button class="btn-add" @click="openAdd">+ Tambah Kamar</button>
    </div>
    <div v-if="addMode || editing" class="form-card">
      <form class="inline-form" @submit.prevent="saveRoom">
        <input v-model="form.roomNumber" placeholder="No. Kamar" required />
        <select v-model="form.type">
          <option v-for="t in ROOM_TYPES" :key="t" :value="t">{{ t }}</option>
        </select>
        <input v-model.number="form.price" type="number" min="0" placeholder="Harga" required />
        <div class="form-actions">
          <button type="submit" class="btn-save">Simpan</button>
          <button type="button" class="btn-cancel" @click="cancelEdit">Batal</button>
        </div>
      </form>
    </div>
    <p v-if="loading" class="loading-msg">Memuat...</p>
    <div v-else class="list-table">
      <div v-for="r in rooms" :key="r.id" class="list-row">
        <div class="row-info">
          <strong>Kamar {{ r.roomNumber }}</strong>
          <span class="row-meta">{{ r.type }} · Rp {{ formatPrice(r.price) }}/malam</span>
        </div>
        <div class="row-actions">
          <button class="btn-edit" @click="openEdit(r)">Edit</button>
          <button class="btn-delete" @click="doDelete(r.id)">Hapus</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-page {
  padding: 7rem 4rem 4rem;
  min-height: 100vh;
}

.back-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 0.9rem;
  cursor: pointer;
  margin-bottom: 0.5rem;
}

.back-btn:hover {
  color: var(--accent);
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: var(--text);
}

.btn-add {
  padding: 0.6rem 1.2rem;
  background: var(--accent);
  color: var(--bg);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.form-card {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.inline-form {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
}

.inline-form input,
.inline-form select {
  padding: 0.6rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: var(--text);
  font-size: 1rem;
  min-width: 120px;
}

.form-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-save {
  padding: 0.5rem 1rem;
  background: var(--accent);
  color: var(--bg);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-cancel {
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--text-muted);
  border-radius: 8px;
  cursor: pointer;
}

.list-table {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.list-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--card-bg);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.row-meta {
  font-size: 0.9rem;
  color: var(--text-muted);
  display: block;
}

.row-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit {
  padding: 0.4rem 0.8rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: var(--text);
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
}

.btn-delete {
  padding: 0.4rem 0.8rem;
  background: rgba(255, 80, 80, 0.2);
  border: 1px solid rgba(255, 80, 80, 0.3);
  color: #ff6b6b;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
}
</style>
