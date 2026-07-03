from datetime import datetime, timezone
from enum import Enum

from sqlalchemy import CheckConstraint, Column, String
from sqlalchemy.dialects.postgresql import ARRAY
from sqlmodel import Field, SQLModel


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Role(str, Enum):
    reviewer = "reviewer"
    admin = "admin"


class CandidateStatus(str, Enum):
    new = "new"
    reviewed = "reviewed"
    hired = "hired"
    rejected = "rejected"


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: int | None = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    role: Role = Field(default=Role.reviewer)
    created_at: datetime = Field(default_factory=_utcnow, nullable=False)


class Candidate(SQLModel, table=True):
    __tablename__ = "candidates"

    id: int | None = Field(default=None, primary_key=True)
    name: str
    email: str
    role_applied: str = Field(index=True)
    status: CandidateStatus = Field(default=CandidateStatus.new, index=True)
    skills: list[str] = Field(
        sa_column=Column(ARRAY(String), nullable=False, server_default="{}")
    )
    internal_notes: str | None = Field(default=None)
    summary: str | None = Field(default=None)
    created_at: datetime = Field(default_factory=_utcnow, nullable=False)


class Score(SQLModel, table=True):
    __tablename__ = "scores"
    __table_args__ = (
        CheckConstraint("score >= 1 AND score <= 5", name="score_range"),
    )

    id: int | None = Field(default=None, primary_key=True)
    candidate_id: int = Field(foreign_key="candidates.id", index=True)
    reviewer_id: int = Field(foreign_key="users.id", index=True)
    category: str
    score: int
    note: str | None = Field(default=None)
    created_at: datetime = Field(default_factory=_utcnow, nullable=False)
