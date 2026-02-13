import { defineStore } from 'pinia'

const TIERS = [
  { id: 'bronze', label: 'Bronze', min: 0 },
  { id: 'silver', label: 'Silver', min: 1 },
  { id: 'gold', label: 'Gold', min: 5 },
  { id: 'platinum', label: 'Platinum', min: 10 },
]

const STORAGE_KEY = 'wednesday_user'

const loadFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) return JSON.parse(data)
  } catch (_) {}
  return null
}

const saveToStorage = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (_) {}
}


export const useUserStore = defineStore('user', {
  state: () => {
    const stored = loadFromStorage()
    return {
      isLoggedIn: stored?.isLoggedIn ?? false,
      name: stored?.name ?? 'Iran Situmorang',
      purchaseCount: stored?.purchaseCount ?? 0,
    }
  },
  getters: {
    tier: (state) => {
      const count = state.purchaseCount
      for (let i = TIERS.length - 1; i >= 0; i--) {
        if (count >= TIERS[i].min) return TIERS[i]
      }
      return TIERS[0]
    },
    tierLabel: (state) => {
      const count = state.purchaseCount
      for (let i = TIERS.length - 1; i >= 0; i--) {
        if (count >= TIERS[i].min) return TIERS[i].label
      }
      return TIERS[0].label
    },
  },
  actions: {
    login(name = 'Iran Situmorang') {
      this.isLoggedIn = true
      this.name = name || 'Iran Situmorang'
      saveToStorage({
        isLoggedIn: this.isLoggedIn,
        name: this.name,
        purchaseCount: this.purchaseCount,
      })
    },
    logout() {
      this.isLoggedIn = false
      saveToStorage({ isLoggedIn: false, name: this.name, purchaseCount: this.purchaseCount })
    },
    addPurchase() {
      this.purchaseCount++
      if (this.isLoggedIn) {
        saveToStorage({
          isLoggedIn: this.isLoggedIn,
          name: this.name,
          purchaseCount: this.purchaseCount,
        })
      }
    },
  },
})
