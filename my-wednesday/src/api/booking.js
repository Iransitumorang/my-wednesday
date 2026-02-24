const BASE = import.meta.env.VITE_API_URL || ''

const fetchApi = async (path, opts = {}) => {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...opts.headers },
    ...opts,
  })
  if (!res.ok) {
    const err = new Error('API Error')
    err.status = res.status
    try {
      err.body = await res.json()
      err.message = err.body?.message || res.statusText
    } catch (_) {
      err.message = res.statusText
    }
    throw err
  }
  if (res.status === 204) return null
  return res.json()
}

const fetchList = async (path, params = {}) => {
  const q = new URLSearchParams({ page: 0, size: 20, ...params }).toString()
  const sep = path.includes('?') ? '&' : '?'
  const res = await fetchApi(`${path}${sep}${q}`)
  return res?.content ?? res ?? []
}

export const getHotels = (page = 0, size = 20) =>
  fetchList('/hotels', { page, size })
export const getHotel = (id) => fetchApi(`/hotels/${id}`)
export const getHotelRooms = (hotelId, page = 0, size = 20) =>
  fetchList(`/hotels/${hotelId}/rooms`, { page, size })
export const getRoom = (id) => fetchApi(`/rooms/${id}`)
export const getRoomAvailability = (roomId, checkIn, checkOut) =>
  fetchApi(`/rooms/${roomId}/availability?checkIn=${checkIn}&checkOut=${checkOut}`)
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
