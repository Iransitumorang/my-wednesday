import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
  }),
  getters: {
    count: (state) => state.items.reduce((sum, i) => sum + i.qty, 0),
    total: (state) => state.items.reduce((sum, i) => sum + i.price * i.qty, 0),
    hasItem: (state) => (id) => state.items.some((i) => i.id === id),
  },
  actions: {
    add(item, qty = 1) {
      const existing = this.items.find((i) => i.id === item.id)
      if (existing) existing.qty += qty
      else this.items.push({ ...item, qty })
    },
    remove(id) {
      this.items = this.items.filter((i) => i.id !== id)
    },
    updateQty(id, qty) {
      const item = this.items.find((i) => i.id === id)
      if (item) item.qty = Math.max(1, qty)
    },
    clear() {
      this.items = []
    },
  },
})
