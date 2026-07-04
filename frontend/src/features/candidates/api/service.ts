import { http } from '@/lib/http'

import type {
  CandidateDetail,
  CandidateListResponse,
  CandidateScore,
  CandidateSummaryResponse,
  CreateCandidateScorePayload,
  ListCandidatesParams,
} from './types'

export async function listCandidates(params: ListCandidatesParams = {}) {
  const { data } = await http.get<CandidateListResponse>('/candidates', {
    params,
  })

  return data
}

export async function getCandidate(candidateId: number) {
  const { data } = await http.get<CandidateDetail>(`/candidates/${candidateId}`)

  return data
}

export async function createCandidateScore(
  candidateId: number,
  payload: CreateCandidateScorePayload
) {
  const { data } = await http.post<CandidateScore>(
    `/candidates/${candidateId}/scores`,
    payload
  )

  return data
}

export async function generateCandidateSummary(candidateId: number) {
  const { data } = await http.post<CandidateSummaryResponse>(
    `/candidates/${candidateId}/summary`
  )

  return data
}
