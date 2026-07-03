"""Seed sample candidates for local development / testing.

Run with:  uv run python -m app.seed

Idempotent: skips seeding if any candidates already exist.
Note: users (reviewer/admin) are created via the /auth/register endpoint;
promote a user to admin manually (see README).
"""

from sqlmodel import Session, select

from app.core.database import engine
from app.models import Candidate, CandidateStatus

SAMPLE_CANDIDATES = [
    Candidate(
        name="Ada Lovelace",
        email="ada@example.com",
        role_applied="Backend Engineer",
        status=CandidateStatus.new,
        skills=["python", "sql", "algorithms"],
        internal_notes="Strong referral from the CTO.",
    ),
    Candidate(
        name="Grace Hopper",
        email="grace@example.com",
        role_applied="Backend Engineer",
        status=CandidateStatus.reviewed,
        skills=["python", "go", "distributed-systems"],
        internal_notes="Salary expectations above band.",
    ),
    Candidate(
        name="Alan Turing",
        email="alan@example.com",
        role_applied="ML Engineer",
        status=CandidateStatus.new,
        skills=["python", "pytorch", "algorithms"],
        internal_notes=None,
    ),
    Candidate(
        name="Katherine Johnson",
        email="katherine@example.com",
        role_applied="Data Scientist",
        status=CandidateStatus.hired,
        skills=["python", "statistics", "sql"],
        internal_notes="Accepted offer, starts next month.",
    ),
]


def seed() -> None:
    with Session(engine) as session:
        existing = session.exec(select(Candidate)).first()
        if existing is not None:
            print("Candidates already exist — skipping seed.")
            return
        session.add_all(SAMPLE_CANDIDATES)
        session.commit()
        print(f"Seeded {len(SAMPLE_CANDIDATES)} candidates.")


if __name__ == "__main__":
    seed()
