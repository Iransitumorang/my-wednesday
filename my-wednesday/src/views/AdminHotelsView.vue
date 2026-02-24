<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  getHotels,
  createHotel,
  updateHotel,
  deleteHotel,
} from '../api/booking'

const router = useRouter()
const hotels = ref([])
const loading = ref(true)
const error = ref(null)
const editing = ref(null)
const addMode = ref(false)
const form = ref({ name: '', location: '' })

const loadHotels = async () => {
  loading.value = true
  error.value = null
  try {
    hotels.value = await getHotels(0, 100)
  } catch (e) {
    error.value = e.message || 'Gagal memuat hotel'
  } finally {
    loading.value = false
  }
}

const openAdd = () => {
  editing.value = null
  addMode.value = true
  form.value = { name: '', location: '' }
}

const openEdit = (h) => {
  editing.value = h.id
  addMode.value = false
  form.value = { name: h.name || '', location: h.location || '' }
}

const cancelEdit = () => {
  editing.value = null
  addMode.value = false
}

const saveHotel = async () => {
  const { name, location } = form.value
  if (!name?.trim() || !location?.trim()) return
  error.value = null
  try {
    if (editing.value) {
      await updateHotel(editing.value, { name: name.trim(), location: location.trim() })
    } else {
      await createHotel({ name: name.trim(), location: location.trim() })
    }
    cancelEdit()
    loadHotels()
  } catch (e) {
    error.value = e.message || 'Gagal menyimpan'
  }
}

const doDelete = async (id) => {
  if (!confirm('Hapus hotel ini?')) return
  error.value = null
  try {
    await deleteHotel(id)
    loadHotels()
  } catch (e) {
    error.value = e.message || 'Gagal menghapus'
  }
}

onMounted(loadHotels)
</script>

<template>
  <div class="admin-page">
    <div class="admin-header">
      <h1 class="page-title">Kelola Hotel</h1>
      <button class="btn-add" @click="openAdd">+ Tambah Hotel</button>
    </div>
    <p v-if="error" class="error-msg">{{ error }}</p>
    <div v-if="addMode || editing" class="form-card">
      <form class="inline-form" @submit.prevent="saveHotel">
        <input v-model="form.name" placeholder="Nama hotel" required />
        <input v-model="form.location" placeholder="Lokasi" required />
        <div class="form-actions">
          <button type="submit" class="btn-save">Simpan</button>
          <button type="button" class="btn-cancel" @click="cancelEdit">Batal</button>
        </div>
      </form>
    </div>
    <p v-if="loading" class="loading-msg">Memuat...</p>
    <div v-else class="list-table">
      <div v-for="h in hotels" :key="h.id" class="list-row">
        <div class="row-info">
          <strong>{{ h.name }}</strong>
          <span class="row-meta">{{ h.location }}</span>
        </div>
        <div class="row-actions">
          <button class="btn-edit" @click="router.push(`/admin/hotels/${h.id}/rooms`)">Kamar</button>
          <button class="btn-edit" @click="openEdit(h)">Edit</button>
          <button class="btn-delete" @click="doDelete(h.id)">Hapus</button>
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

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.btn-add:hover {
  background: var(--accent-hover);
}

.error-msg {
  color: #ff6b6b;
  margin-bottom: 1rem;
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

.inline-form input {
  padding: 0.6rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: var(--text);
  font-size: 1rem;
  min-width: 180px;
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
