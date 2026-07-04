import { http } from '@/lib/http'

import type { AuthResponse, SignInPayload } from './types'

export async function signIn(payload: SignInPayload) {
  const body = new URLSearchParams()
  body.set('username', payload.username)
  body.set('password', payload.password)

  const { data } = await http.post<AuthResponse>('/auth/login', body, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })

  return data
}
