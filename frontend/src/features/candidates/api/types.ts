export const candidateStatus = {
  New: 'new',
  Reviewed: 'reviewed',
  Hired: 'hired',
  Rejected: 'rejected',
} as const

export type CandidateStatus = (typeof candidateStatus)[keyof typeof candidateStatus]

export type Candidate = {
  id: number
  name: string
  email: string
  role_applied: string
  status: CandidateStatus
  skills: string[]
  internal_notes: string | null
  created_at: string
}

export type CandidateScore = {
  id: number
  candidate_id: number
  reviewer_id: number
  category: string
  score: number
  note: string | null
  created_at: string
}

export type CandidateDetail = Candidate & {
  summary: string | null
  scores: CandidateScore[]
}

export type CandidateListResponse = {
  items: Candidate[]
  total: number
  offset: number
  limit: number
}

export type CandidateSummaryResponse = {
  candidate_id: number
  summary: string
}

export type ListCandidatesParams = {
  status?: CandidateStatus
  role_applied?: string
  skill?: string
  keyword?: string
  offset?: number
  limit?: number
}

export type CreateCandidateScorePayload = {
  category: string
  score: number
  note: string | null
}
