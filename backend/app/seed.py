"""Seed demo users, candidates, and scores for local development.

Run with: uv run python -m app.seed

This script is idempotent:
- demo users are created if missing and updated if they already exist
- demo candidates are created if missing and updated if they already exist
- demo scores are created if missing and updated if they already exist
"""

from sqlmodel import Session, select

from app.auth import hash_password
from app.core.database import engine
from app.models import Candidate, CandidateStatus, Role, Score, User

DEMO_USERS = [
    {
        "email": "admin@yopmail.com",
        "password": "admin",
        "role": Role.admin,
    },
    {
        "email": "reviewer@yopmail.com",
        "password": "reviewer",
        "role": Role.reviewer,
    },
]

SCORE_CATEGORIES = [
    "culture",
    "problem solving",
    "technical",
    "productivity",
    "communication",
    "inquisitive",
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
        "internal_notes": "Strong pair-programming signal and clear tradeoff thinking.",
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
        "status": CandidateStatus.rejected,
        "skills": ["python", "kubernetes", "aws"],
        "internal_notes": "Strong systems design interview, but role fit was too senior.",
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
        "status": CandidateStatus.reviewed,
        "skills": ["sql", "spark", "python"],
        "internal_notes": "Good technical depth, moving to final panel.",
    },
    {
        "name": "Radia Perlman",
        "email": "radia@example.com",
        "role_applied": "Infrastructure Engineer",
        "status": CandidateStatus.hired,
        "skills": ["networking", "linux", "go"],
        "internal_notes": "Excellent networking fundamentals and strong leadership signal.",
    },
    {
        "name": "Tim Berners-Lee",
        "email": "tim@example.com",
        "role_applied": "Frontend Engineer",
        "status": CandidateStatus.reviewed,
        "skills": ["typescript", "react", "web-performance"],
        "internal_notes": "Strong frontend fundamentals with a few open architecture questions.",
    },
    {
        "name": "Frances Allen",
        "email": "frances@example.com",
        "role_applied": "Compiler Engineer",
        "status": CandidateStatus.rejected,
        "skills": ["c++", "compilers", "performance"],
        "internal_notes": "Excellent depth, but unavailable inside hiring timeline.",
    },
    {
        "name": "Guido van Rossum",
        "email": "guido@example.com",
        "role_applied": "Backend Engineer",
        "status": CandidateStatus.hired,
        "skills": ["python", "api-design", "developer-tools"],
        "internal_notes": "Would be great for platform-facing work. Offer accepted.",
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

DEMO_SCORE_TEMPLATES = {
    "grace@example.com": [5, 4, 5, 4, 4, 5],
    "donald@example.com": [3, 4, 4, 3, 3, 4],
    "tim@example.com": [4, 4, 4, 4, 5, 3],
    "katherine@example.com": [5, 5, 5, 4, 5, 4],
    "radia@example.com": [5, 4, 5, 5, 4, 4],
    "guido@example.com": [4, 5, 5, 4, 4, 5],
    "margaret@example.com": [3, 3, 4, 3, 2, 4],
    "frances@example.com": [4, 4, 5, 3, 3, 3],
    "linus@example.com": [2, 4, 5, 3, 2, 2],
}


def _score_note(status: CandidateStatus, category: str, value: int) -> str:
    if status == CandidateStatus.hired:
        return f"Strong {category} signal. Rated {value}/5 during the final round."
    if status == CandidateStatus.reviewed:
        return f"Promising {category} signal so far. Rated {value}/5 in review."
    return f"Mixed {category} signal. Rated {value}/5 before rejection decision."


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
    created_or_updated = 0
    for item in DEMO_CANDIDATES:
        candidate = session.exec(select(Candidate).where(Candidate.email == item["email"])).first()
        if candidate is None:
            session.add(Candidate(**item))
            created_or_updated += 1
            continue

        candidate.name = item["name"]
        candidate.role_applied = item["role_applied"]
        candidate.status = item["status"]
        candidate.skills = item["skills"]
        candidate.internal_notes = item["internal_notes"]
        session.add(candidate)
        created_or_updated += 1

    return created_or_updated


def seed_scores(session: Session) -> int:
    reviewer = session.exec(
        select(User).where(User.email == "reviewer@yopmail.com")
    ).first()
    if reviewer is None:
        raise RuntimeError("Demo reviewer user must exist before seeding scores")

    created_or_updated = 0
    for item in DEMO_CANDIDATES:
        if item["status"] == CandidateStatus.new:
            continue

        candidate = session.exec(
            select(Candidate).where(Candidate.email == item["email"])
        ).first()
        if candidate is None:
            raise RuntimeError(f"Demo candidate {item['email']} must exist before seeding scores")

        values = DEMO_SCORE_TEMPLATES[item["email"]]
        for category, value in zip(SCORE_CATEGORIES, values, strict=True):
            score = session.exec(
                select(Score).where(
                    Score.candidate_id == candidate.id,
                    Score.reviewer_id == reviewer.id,
                    Score.category == category,
                )
            ).first()

            note = _score_note(item["status"], category, value)
            if score is None:
                session.add(
                    Score(
                        candidate_id=candidate.id,
                        reviewer_id=reviewer.id,
                        category=category,
                        score=value,
                        note=note,
                    )
                )
                created_or_updated += 1
                continue

            score.score = value
            score.note = note
            session.add(score)
            created_or_updated += 1

    return created_or_updated


def seed() -> None:
    with Session(engine) as session:
        users_count = seed_users(session)
        candidates_count = seed_candidates(session)
        scores_count = seed_scores(session)
        session.commit()
        print(
            "Seed complete: "
            f"{users_count} demo users created/updated, "
            f"{candidates_count} demo candidates created/updated, "
            f"{scores_count} demo scores created/updated."
        )


if __name__ == "__main__":
    seed()
