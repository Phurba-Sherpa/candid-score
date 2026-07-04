import { useQuery } from '@tanstack/react-query'

import { getCandidate, listCandidates } from './service'
import type { ListCandidatesParams } from './types'

export const candidateQueryKeys = {
  all: ['candidates'] as const,
  list: (params: ListCandidatesParams) => [...candidateQueryKeys.all, 'list', params] as const,
  detail: (candidateId: number) => [...candidateQueryKeys.all, 'detail', candidateId] as const,
}

export function useCandidatesQuery(params: ListCandidatesParams = {}) {
  return useQuery({
    queryKey: candidateQueryKeys.list(params),
    queryFn: () => listCandidates(params),
  })
}

export function useCandidateQuery(candidateId: number | null) {
  return useQuery({
    queryKey: candidateId
      ? candidateQueryKeys.detail(candidateId)
      : [...candidateQueryKeys.all, 'detail', 'empty'],
    queryFn: async () => {
      if (candidateId === null) {
        throw new Error('Candidate id is required')
      }

      return getCandidate(candidateId)
    },
    enabled: candidateId !== null,
  })
}
