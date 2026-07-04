import { useMutation, useQueryClient } from '@tanstack/react-query'

import { candidateQueryKeys } from './query'
import { createCandidateScore, generateCandidateSummary } from './service'
import type { CreateCandidateScorePayload } from './types'

export function useCreateCandidateScoreMutation(candidateId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateCandidateScorePayload) =>
      createCandidateScore(candidateId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: candidateQueryKeys.detail(candidateId),
      })
    },
  })
}

export function useGenerateCandidateSummaryMutation(candidateId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => generateCandidateSummary(candidateId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: candidateQueryKeys.detail(candidateId),
      })
    },
  })
}
