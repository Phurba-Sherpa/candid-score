"""Seed demo users and candidates for local development.

Run with: uv run python -m app.seed

This script is idempotent:
- demo users are created if missing and updated if they already exist
- demo candidates are inserted only when their email is not present yet
"""

from sqlmodel import Session, select

from app.auth import hash_password
from app.core.database import engine
from app.models import Candidate, CandidateStatus, Role, User

DEMO_USERS = [
    {
        "email": "admin@yopmail.com",
        "password": "admin",
        "role": Role.admin,
    },
    {
        "email": "recruiter@yopmail.com",
        "password": "recruiter.",
        "role": Role.reviewer,
    },
]

DEMO_CANDIDATES = [
    {
        "name": "Ada Lovelace",
        "email": "ada@example.com",
        "role_applied": "Backend Engineer",
        "status": CandidateStatus.new,
        "skills": ["python", "sql", "algorithms"],
        "internal_notes": "Strong referral from the CTO.",
    },
    {
        "name": "Grace Hopper",
        "email": "grace@example.com",
        "role_applied": "Backend Engineer",
        "status": CandidateStatus.reviewed,
        "skills": ["python", "go", "distributed-systems"],
        "internal_notes": "Salary expectations above band.",
    },
    {
        "name": "Alan Turing",
        "email": "alan@example.com",
        "role_applied": "ML Engineer",
        "status": CandidateStatus.new,
        "skills": ["python", "pytorch", "algorithms"],
        "internal_notes": None,
    },
    {
        "name": "Katherine Johnson",
        "email": "katherine@example.com",
        "role_applied": "Data Scientist",
        "status": CandidateStatus.hired,
        "skills": ["python", "statistics", "sql"],
        "internal_notes": "Accepted offer, starts next month.",
    },
    {
        "name": "Margaret Hamilton",
        "email": "margaret@example.com",
        "role_applied": "Platform Engineer",
        "status": CandidateStatus.reviewed,
        "skills": ["python", "kubernetes", "aws"],
        "internal_notes": "Strong systems design interview.",
    },
    {
        "name": "Barbara Liskov",
        "email": "barbara@example.com",
        "role_applied": "Backend Engineer",
        "status": CandidateStatus.new,
        "skills": ["java", "distributed-systems", "postgresql"],
        "internal_notes": "Needs deeper API design evaluation.",
    },
    {
        "name": "Donald Knuth",
        "email": "donald@example.com",
        "role_applied": "Data Engineer",
        "status": CandidateStatus.rejected,
        "skills": ["sql", "spark", "python"],
        "internal_notes": "Good technical depth, weak stakeholder communication.",
    },
    {
        "name": "Radia Perlman",
        "email": "radia@example.com",
        "role_applied": "Infrastructure Engineer",
        "status": CandidateStatus.reviewed,
        "skills": ["networking", "linux", "go"],
        "internal_notes": "Excellent networking fundamentals.",
    },
    {
        "name": "Tim Berners-Lee",
        "email": "tim@example.com",
        "role_applied": "Frontend Engineer",
        "status": CandidateStatus.new,
        "skills": ["typescript", "react", "web-performance"],
        "internal_notes": None,
    },
    {
        "name": "Frances Allen",
        "email": "frances@example.com",
        "role_applied": "Compiler Engineer",
        "status": CandidateStatus.hired,
        "skills": ["c++", "compilers", "performance"],
        "internal_notes": "Offer signed.",
    },
    {
        "name": "Guido van Rossum",
        "email": "guido@example.com",
        "role_applied": "Backend Engineer",
        "status": CandidateStatus.reviewed,
        "skills": ["python", "api-design", "developer-tools"],
        "internal_notes": "Would be great for platform-facing work.",
    },
    {
        "name": "Linus Torvalds",
        "email": "linus@example.com",
        "role_applied": "Systems Engineer",
        "status": CandidateStatus.rejected,
        "skills": ["c", "linux", "git"],
        "internal_notes": "Strong technical signal, team-fit concerns.",
    },
]


def seed_users(session: Session) -> int:
    created_or_updated = 0
    for item in DEMO_USERS:
        user = session.exec(select(User).where(User.email == item["email"])).first()
        hashed_password = hash_password(item["password"])

        if user is None:
            session.add(
                User(
                    email=item["email"],
                    hashed_password=hashed_password,
                    role=item["role"],
                )
            )
            created_or_updated += 1
            continue

        user.hashed_password = hashed_password
        user.role = item["role"]
        session.add(user)
        created_or_updated += 1

    return created_or_updated


def seed_candidates(session: Session) -> int:
    created = 0
    for item in DEMO_CANDIDATES:
        existing = session.exec(select(Candidate).where(Candidate.email == item["email"])).first()
        if existing is not None:
            continue
        session.add(Candidate(**item))
        created += 1
    return created


def seed() -> None:
    with Session(engine) as session:
        users_count = seed_users(session)
        candidates_count = seed_candidates(session)
        session.commit()
        print(
            "Seed complete: "
            f"{users_count} demo users created/updated, "
            f"{candidates_count} demo candidates inserted."
        )


if __name__ == "__main__":
    seed()
