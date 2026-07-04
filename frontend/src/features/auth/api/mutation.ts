import { useMutation } from '@tanstack/react-query'

import { persistSession } from './session'
import { signIn } from './service'
import type { SignInPayload } from './types'

export function useSignInMutation() {
  return useMutation({
    mutationFn: (payload: SignInPayload) => signIn(payload),
    onSuccess: (response) => {
      persistSession(response)
    },
  })
}
