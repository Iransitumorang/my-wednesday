const MAP = {
  'Bad Request': 'Terjadi kesalahan. Periksa data yang Anda masukkan.',
  'Unauthorized': 'Silakan login terlebih dahulu.',
  'Forbidden': 'Akses ditolak.',
  'Not Found': 'Data tidak ditemukan.',
  'Conflict': 'Data bentrok. Coba lagi.',
  'already booked': 'Kamar sudah dibooking. Pilih tanggal atau kamar lain.',
  'sudah dibooking': 'Kamar sudah dibooking. Pilih tanggal atau kamar lain.',
  'invalid credentials': 'Username atau password salah.',
  'credentials': 'Username atau password salah.',
  'password': 'Password minimal 6 karakter.',
  'username': 'Username tidak valid.',
}

const humanizeViolation = (msg) => {
  if (!msg || typeof msg !== 'string') return ''
  const lower = msg.toLowerCase()
  if (lower.includes('password') && (lower.includes('least') || lower.includes('minimal'))) return 'Password minimal 6 karakter.'
  if (lower.includes('username') && lower.includes('blank')) return 'Username tidak boleh kosong.'
  if (lower.includes('password') && lower.includes('blank')) return 'Password tidak boleh kosong.'
  if (lower.includes('already') && lower.includes('book')) return 'Kamar sudah dibooking.'
  return msg
}

export const humanizeApiError = (err) => {
  if (!err) return 'Terjadi kesalahan.'
  const body = err.body || {}
  const violations = body.violations
  if (Array.isArray(violations) && violations.length) {
    const msg = violations.map((v) => humanizeViolation(v.message)).filter(Boolean).join(' ')
    if (msg) return msg.charAt(0).toUpperCase() + msg.slice(1)
  }
  const raw = (err.message || body.message || body.detail || '').trim()
  if (!raw) {
    if (err.status === 400) return MAP['Bad Request']
    if (err.status === 401) return MAP['Unauthorized']
    if (err.status === 403) return MAP['Forbidden']
    if (err.status === 404) return MAP['Not Found']
    return 'Terjadi kesalahan. Coba lagi.'
  }
  const lower = raw.toLowerCase()
  for (const [key, val] of Object.entries(MAP)) {
    if (lower.includes(key.toLowerCase())) return val
  }
  if (err.status === 400 && (raw === 'Bad Request' || raw === 'bad request')) return MAP['Bad Request']
  return raw
}
