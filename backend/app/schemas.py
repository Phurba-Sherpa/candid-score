from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models import CandidateStatus, Role


class UserCreate(BaseModel):
    """Registration payload. Note: `role` is intentionally absent — it is
    hardcoded to `reviewer` server-side and never accepted from the client."""

    email: EmailStr
    password: str


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    role: Role
    created_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: Role


class ScoreCreate(BaseModel):
    category: str = Field(min_length=1, max_length=255)
    score: int = Field(ge=1, le=5)
    note: str | None = None


class ScoreRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    candidate_id: int
    reviewer_id: int
    category: str
    score: int
    note: str | None
    created_at: datetime


class CandidateSummary(BaseModel):
    """List-view representation of a candidate. `internal_notes` is only
    populated for admins; it is set to None for reviewers."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str
    role_applied: str
    status: CandidateStatus
    skills: list[str]
    internal_notes: str | None = None
    created_at: datetime


class CandidateDetail(CandidateSummary):
    summary: str | None = None
    scores: list[ScoreRead] = []


class CandidateListResponse(BaseModel):
    items: list[CandidateSummary]
    total: int
    offset: int
    limit: int


class SummaryResponse(BaseModel):
    candidate_id: int
    summary: str
