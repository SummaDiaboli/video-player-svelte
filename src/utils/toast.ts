import type { Toast } from '../types'

let toastId = 0

export const createToast = (message: string, icon: string, timeoutId: number): Toast => {
  return {
    id: ++toastId,
    message,
    icon,
    timeoutId
  }
}