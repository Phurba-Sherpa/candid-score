import axios from 'axios'
import { toast } from 'sonner'

import { clearSession, getSessionToken } from '@/features/auth/api/session'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000',
})

let isHandlingUnauthorized = false

http.interceptors.request.use((config) => {
  const token = getSessionToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && getSessionToken() && !isHandlingUnauthorized) {
      isHandlingUnauthorized = true
      clearSession()
      toast.error('Your session has expired. Please sign in again.')

      if (window.location.pathname !== '/login') {
        window.location.replace('/login')
      }

      window.setTimeout(() => {
        isHandlingUnauthorized = false
      }, 0)
    }

    return Promise.reject(error)
  }
)
