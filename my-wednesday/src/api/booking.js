const BASE = import.meta.env.VITE_API_URL || ''

const getAuthHeaders = (skipAuth) => {
  if (skipAuth) return {}
  const raw = (localStorage.getItem('auth_token') || '').trim()
  const token = raw.replace(/^["']|["']$/g, '')
  if (!token) return {}
  return { Authorization: `Bearer ${token}` }
}

const fetchApi = async (path, opts = {}) => {
  const { skipAuth, ...rest } = opts
  const headers = { 'Content-Type': 'application/json', ...getAuthHeaders(skipAuth), ...rest.headers }
  const res = await fetch(`${BASE}${path}`, {
    ...rest,
    headers,
  })
  if (!res.ok) {
    const err = new Error('API Error')
    err.status = res.status
    try {
      err.body = await res.json()
      err.message = err.body?.message || err.body?.detail || res.statusText
    } catch (_) {
      err.message = res.statusText
    }
    if (res.status === 401) err.message = 'Unauthorized - silakan login'
    if (res.status === 403) err.message = 'Akses ditolak - login ulang dengan akun yang benar'
    throw err
  }
  if (res.status === 204) return null
  return res.json()
}

const fetchList = async (path, params = {}, skipAuth = false) => {
  const q = new URLSearchParams({ page: 0, size: 20, ...params }).toString()
  const sep = path.includes('?') ? '&' : '?'
  const res = await fetchApi(`${path}${sep}${q}`, { skipAuth })
  return res?.content ?? res ?? []
}

export const getHotels = (page = 0, size = 20) =>
  fetchList('/hotels', { page, size }, true)
export const getHotel = (id) => fetchApi(`/hotels/${id}`, { skipAuth: true })
export const getHotelRooms = (hotelId, page = 0, size = 20) =>
  fetchList(`/hotels/${hotelId}/rooms`, { page, size }, true)
export const getRooms = (page = 0, size = 50) =>
  fetchList('/rooms', { page, size }, true)
export const getRoom = (id) => fetchApi(`/rooms/${id}`, { skipAuth: true })
export const getRoomAvailability = (roomId, checkIn, checkOut) =>
  fetchApi(`/rooms/${roomId}/availability?checkIn=${checkIn}&checkOut=${checkOut}`, { skipAuth: true })
export const createBooking = (body) =>
  fetchApi('/bookings', { method: 'POST', body: JSON.stringify(body) })
export const getBookings = (customerName, page = 0, size = 20) => {
  const params = { page, size }
  if (customerName?.trim()) params.customerName = customerName.trim()
  const q = new URLSearchParams(params).toString()
  return fetchApi(`/bookings?${q}`).then((res) => res?.content ?? res ?? [])
}
export const getBooking = (id) => fetchApi(`/bookings/${id}`)
export const cancelBooking = (id) => fetchApi(`/bookings/${id}/cancel`, { method: 'PUT' })

export const createHotel = (body) =>
  fetchApi('/hotels', { method: 'POST', body: JSON.stringify(body) })
export const updateHotel = (id, body) =>
  fetchApi(`/hotels/${id}`, { method: 'PUT', body: JSON.stringify(body) })
export const deleteHotel = (id) =>
  fetchApi(`/hotels/${id}`, { method: 'DELETE' })

export const createRoom = (body) =>
  fetchApi('/rooms', { method: 'POST', body: JSON.stringify(body) })
export const updateRoom = (id, body) =>
  fetchApi(`/rooms/${id}`, { method: 'PUT', body: JSON.stringify(body) })
export const deleteRoom = (id) =>
  fetchApi(`/rooms/${id}`, { method: 'DELETE' })
