import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('../views/HomeView.vue'), meta: { transition: 'fade' } },
    { path: '/shop', name: 'shop', component: () => import('../views/ShopView.vue'), meta: { transition: 'slide' } },
    { path: '/product/:id', name: 'product', component: () => import('../views/ProductView.vue'), meta: { transition: 'fade' } },
    { path: '/cart', name: 'cart', component: () => import('../views/CartView.vue'), meta: { transition: 'slide' } },
  ],
})

export default router
