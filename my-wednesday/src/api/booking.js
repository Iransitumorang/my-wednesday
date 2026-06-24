/**
 * Hotel Booking API
 * Semua id, hotelId, roomId = string UUID (bukan number)
 */
const BASE = import.meta.env.VITE_API_URL || ''

const getToken = () => {
  const raw = (localStorage.getItem('auth_token') || '').trim()
  return raw.replace(/^["']|["']$/g, '') || null
}

const getAuthHeaders = (skipAuth = false) => {
  if (skipAuth) return {}

  const token = getToken()
  if (!token) return {}

  return {
    Authorization: `Bearer ${token}`,
  }
}

const fetchApi = async (path, opts = {}) => {
  const { skipAuth = false, headers: customHeaders = {}, body, ...rest } = opts

  const headers = {
    ...getAuthHeaders(skipAuth),
    ...customHeaders,
  }

  const requestOptions = {
    ...rest,
    headers,
  }

  if (body !== undefined && body !== null) {
    headers['Content-Type'] = 'application/json'
    requestOptions.body = typeof body === 'string' ? body : JSON.stringify(body)
  }

  const res = await fetch(`${BASE}${path}`, requestOptions)

  if (!res.ok) {
    const err = new Error('API Error')
    err.status = res.status

    try {
      err.body = await res.json()

      const violations = err.body?.violations
      const fallback = err.body?.message || err.body?.detail || res.statusText

      if (Array.isArray(violations) && violations.length) {
        const msg = violations.map((item) => item.message).filter(Boolean).join('. ')
        err.message = msg ? msg.charAt(0).toUpperCase() + msg.slice(1) : fallback
      } else {
        err.message = typeof fallback === 'string' ? fallback : res.statusText
      }
    } catch (_) {
      err.message = res.statusText
    }

    if (res.status === 401) err.message = 'Unauthorized'
    if (res.status === 403) err.message = 'Akses ditolak'

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

/**
 * Public endpoints
 */
export const getHotels = (page = 0, size = 20) =>
  fetchList('/hotels', { page, size }, true)

export const getHotel = (id) =>
  fetchApi(`/hotels/${id}`, { skipAuth: true })

export const getHotelRooms = (hotelId, page = 0, size = 20) =>
  fetchList(`/hotels/${hotelId}/rooms`, { page, size }, true)

export const getRooms = (page = 0, size = 50) =>
  fetchList('/rooms', { page, size }, true)

export const getRoom = (id) =>
  fetchApi(`/rooms/${id}`, { skipAuth: true })

export const getRoomAvailability = (roomId, checkIn, checkOut) =>
  fetchApi(`/rooms/${roomId}/availability?checkIn=${checkIn}&checkOut=${checkOut}`, {
    skipAuth: true,
  })

/**
 * Authenticated booking endpoints
 */
export const createBooking = (body) =>
  fetchApi('/bookings', {
    method: 'POST',
    body,
  })

export const getBookings = (customerName, page = 0, size = 20) => {
  const params = { page, size }

  if (customerName?.trim()) {
    params.customerName = customerName.trim()
  }

  const q = new URLSearchParams(params).toString()

  return fetchApi(`/bookings?${q}`).then((res) => res?.content ?? res ?? [])
}

export const getBooking = (id) =>
  fetchApi(`/bookings/${id}`)

export const cancelBooking = (id) =>
  fetchApi(`/bookings/${id}/cancel`, {
    method: 'PUT',
  })

/**
 * Admin endpoints
 */
export const createHotel = (body) =>
  fetchApi('/hotels', {
    method: 'POST',
    body,
  })

export const updateHotel = (id, body) =>
  fetchApi(`/hotels/${id}`, {
    method: 'PUT',
    body,
  })

export const deleteHotel = (id) =>
  fetchApi(`/hotels/${id}`, {
    method: 'DELETE',
  })

export const createRoom = (body) =>
  fetchApi('/rooms', {
    method: 'POST',
    body,
  })

export const updateRoom = (id, body) =>
  fetchApi(`/rooms/${id}`, {
    method: 'PUT',
    body,
  })

export const deleteRoom = (id) =>
  fetchApi(`/rooms/${id}`, {
    method: 'DELETE',
  })