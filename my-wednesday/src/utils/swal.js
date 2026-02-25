import Swal from 'sweetalert2'

const toast = (icon, title, text = '') =>
  Swal.fire({ icon, title, text, toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 })

export const swalToast = {
  success: (title, text) => toast('success', title, text),
  error: (title, text) => toast('error', title, text),
  warning: (title, text) => toast('warning', title, text),
}

export const swalConfirm = (opts) =>
  Swal.fire({
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#c9a227',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya',
    cancelButtonText: 'Batal',
    ...opts,
  })

export const swalError = (title, text = '') =>
  Swal.fire({ icon: 'error', title, text, confirmButtonColor: '#c9a227' })

export const swalSuccess = (title, text = '') =>
  Swal.fire({ icon: 'success', title, text, confirmButtonColor: '#c9a227' })
