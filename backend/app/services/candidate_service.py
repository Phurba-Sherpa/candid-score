import asyncio

from sqlmodel import Session, col, func, or_, select

from app.models import Candidate, CandidateStatus, Role, Score, User
from app.schemas import ScoreCreate


def list_candidates(
    session: Session,
    *,
    status: CandidateStatus | None = None,
    role_applied: str | None = None,
    skill: str | None = None,
    keyword: str | None = None,
    offset: int = 0,
    limit: int = 20,
) -> tuple[list[Candidate], int]:
    """Return a page of candidates matching the filters plus the total count."""
    conditions = []
    if status is not None:
        conditions.append(Candidate.status == status)
    if role_applied:
        conditions.append(Candidate.role_applied == role_applied)
    if skill:
        # Postgres ARRAY containment: skills @> ARRAY[skill]
        conditions.append(col(Candidate.skills).contains([skill]))
    if keyword:
        like = f"%{keyword}%"
        conditions.append(
            or_(col(Candidate.name).ilike(like), col(Candidate.email).ilike(like))
        )

    query = select(Candidate)
    count_query = select(func.count()).select_from(Candidate)
    for condition in conditions:
        query = query.where(condition)
        count_query = count_query.where(condition)

    total = session.exec(count_query).one()
    items = session.exec(
        query.order_by(Candidate.id).offset(offset).limit(limit)
    ).all()
    return list(items), total


def get_candidate(session: Session, candidate_id: int) -> Candidate | None:
    return session.get(Candidate, candidate_id)


def get_scores(session: Session, candidate_id: int, viewer: User) -> list[Score]:
    """Scores for a candidate, scoped by role: admins see all scores,
    reviewers see only their own."""
    query = select(Score).where(Score.candidate_id == candidate_id)
    if viewer.role != Role.admin:
        query = query.where(Score.reviewer_id == viewer.id)
    return list(session.exec(query.order_by(Score.created_at)).all())


def add_score(
    session: Session, candidate_id: int, reviewer_id: int, payload: ScoreCreate
) -> Score:
    score = Score(
        candidate_id=candidate_id,
        reviewer_id=reviewer_id,
        category=payload.category,
        score=payload.score,
        note=payload.note,
    )
    session.add(score)
    session.commit()
    session.refresh(score)
    return score


async def generate_summary(session: Session, candidate: Candidate) -> str:
    """Simulate an async LLM call that produces and persists a candidate summary."""
    await asyncio.sleep(2)  # mock latency of an LLM request

    scores = session.exec(
        select(Score).where(Score.candidate_id == candidate.id)
    ).all()
    if scores:
        avg = sum(s.score for s in scores) / len(scores)
        score_line = f"averaging {avg:.1f}/5 across {len(scores)} review(s)"
    else:
        score_line = "not yet scored by any reviewer"

    skills = ", ".join(candidate.skills) if candidate.skills else "no listed skills"
    summary = (
        f"{candidate.name} applied for the {candidate.role_applied} role and is "
        f"currently '{candidate.status.value}'. Key skills: {skills}. "
        f"The candidate is {score_line}."
    )

    candidate.summary = summary
    session.add(candidate)
    session.commit()
    session.refresh(candidate)
    return summary
