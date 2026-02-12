import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('../views/HomeView.vue'), meta: { transition: 'fade' } },
    { path: '/shop', name: 'shop', component: () => import('../views/ShopView.vue'), meta: { transition: 'slide' } },
    { path: '/product/:id', name: 'product', component: () => import('../views/ProductView.vue'), meta: { transition: 'fade' } },
    { path: '/cart', name: 'cart', component: () => import('../views/CartView.vue'), meta: { transition: 'slide' } },
    { path: '/checkout', name: 'checkout', component: () => import('../views/CheckoutView.vue'), meta: { transition: 'slide' } },
    { path: '/success', name: 'success', component: () => import('../views/SuccessView.vue'), meta: { transition: 'fade' } },
    { path: '/login', name: 'login', component: () => import('../views/LoginView.vue'), meta: { transition: 'fade' } },
  ],
})

router.beforeEach((to, _from, next) => {
  const user = useUserStore()
  const authRequired = to.path === '/checkout'
  if (authRequired && !user.isLoggedIn && to.path !== '/login') {
    next({ path: '/login', query: { returnUrl: to.fullPath } })
  } else {
    next()
  }
})

export default router
