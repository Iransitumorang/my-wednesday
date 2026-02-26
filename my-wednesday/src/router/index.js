import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('../views/HomeView.vue'), meta: { transition: 'fade' } },
    { path: '/hotels', name: 'hotels', component: () => import('../views/HotelsView.vue'), meta: { transition: 'slide' } },
    { path: '/hotels/:id', name: 'hotel', component: () => import('../views/HotelView.vue'), meta: { transition: 'fade' } },
    { path: '/room/:id', name: 'room', component: () => import('../views/RoomView.vue'), meta: { transition: 'fade' } },
    { path: '/book', name: 'book', component: () => import('../views/BookingView.vue'), meta: { transition: 'slide' } },
    { path: '/bookings', name: 'bookings', component: () => import('../views/BookingsView.vue'), meta: { transition: 'slide' } },
    { path: '/success', name: 'success', component: () => import('../views/SuccessView.vue'), meta: { transition: 'fade' } },
    { path: '/login', name: 'login', component: () => import('../views/LoginView.vue'), meta: { transition: 'fade' } },
    { path: '/admin/hotels', name: 'admin-hotels', component: () => import('../views/AdminHotelsView.vue'), meta: { transition: 'slide' } },
    { path: '/admin/hotels/:id/rooms', name: 'admin-rooms', component: () => import('../views/AdminHotelRoomsView.vue'), meta: { transition: 'slide' } },
  ],
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  const adminOnly = to.matched.some((r) => r.path.startsWith('/admin'))
  const bookOnly = to.name === 'book'

  if (adminOnly && !auth.isAdmin) {
    next(auth.isLoggedIn ? '/' : { path: '/login', query: { returnUrl: to.fullPath } })
    return
  }
  if (bookOnly && !auth.isLoggedIn) {
    next({ path: '/login', query: { returnUrl: to.fullPath } })
    return
  }
  next()
})

export default router
