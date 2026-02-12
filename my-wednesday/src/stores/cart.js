import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    checkoutIds: [],
  }),
  getters: {
    count: (state) => state.items.reduce((sum, i) => sum + i.qty, 0),
    total: (state) => state.items.reduce((sum, i) => sum + i.price * i.qty, 0),
    totalForIds: (state) => (ids) =>
      state.items
        .filter((i) => ids.includes(i.id))
        .reduce((sum, i) => sum + i.price * i.qty, 0),
    itemsForIds: (state) => (ids) =>
      ids.length ? state.items.filter((i) => ids.includes(i.id)) : state.items,
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
    removeMany(ids) {
      this.items = this.items.filter((i) => !ids.includes(i.id))
    },
    updateQty(id, qty) {
      const item = this.items.find((i) => i.id === id)
      if (item) item.qty = Math.max(1, qty)
    },
    setCheckoutIds(ids) {
      this.checkoutIds = ids
    },
    clearCheckoutIds() {
      this.checkoutIds = []
    },
    clear() {
      this.items = []
      this.checkoutIds = []
    },
    clearPaid(ids) {
      this.items = this.items.filter((i) => !ids.includes(i.id))
      this.checkoutIds = []
    },
  },
})
