import asyncio
import json

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import StreamingResponse
from sqlmodel import Session, select

from app.auth import get_current_user
from app.core.database import engine, get_session
from app.models import Candidate, CandidateStatus, Role, Score, User
from app.schemas import (
    CandidateDetail,
    CandidateListResponse,
    CandidateSummary,
    ScoreCreate,
    ScoreRead,
    SummaryResponse,
)
from app.services import candidate_service

router = APIRouter(prefix="/candidates", tags=["candidates"])


def _serialize(candidate: Candidate, viewer: User) -> CandidateSummary:
    data = CandidateSummary.model_validate(candidate)
    if viewer.role != Role.admin:
        data.internal_notes = None  # reviewers cannot view internal notes
    return data


@router.get("", response_model=CandidateListResponse)
def list_candidates(
    status: CandidateStatus | None = None,
    role_applied: str | None = None,
    skill: str | None = None,
    keyword: str | None = None,
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=50),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> CandidateListResponse:
    items, total = candidate_service.list_candidates(
        session,
        status=status,
        role_applied=role_applied,
        skill=skill,
        keyword=keyword,
        offset=offset,
        limit=limit,
    )
    return CandidateListResponse(
        items=[_serialize(c, current_user) for c in items],
        total=total,
        offset=offset,
        limit=limit,
    )


@router.get("/{candidate_id}", response_model=CandidateDetail)
def get_candidate(
    candidate_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> CandidateDetail:
    candidate = candidate_service.get_candidate(session, candidate_id)
    if candidate is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate not found")

    detail = CandidateDetail.model_validate(candidate)
    if current_user.role != Role.admin:
        detail.internal_notes = None
    detail.scores = [
        ScoreRead.model_validate(s)
        for s in candidate_service.get_scores(session, candidate_id, current_user)
    ]
    return detail


@router.post(
    "/{candidate_id}/scores",
    response_model=ScoreRead,
    status_code=status.HTTP_201_CREATED,
)
def create_score(
    candidate_id: int,
    payload: ScoreCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> Score:
    if candidate_service.get_candidate(session, candidate_id) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate not found")
    return candidate_service.add_score(
        session, candidate_id, current_user.id, payload
    )


@router.post("/{candidate_id}/summary", response_model=SummaryResponse)
async def generate_summary(
    candidate_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> SummaryResponse:
    candidate = candidate_service.get_candidate(session, candidate_id)
    if candidate is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate not found")
    summary = await candidate_service.generate_summary(session, candidate)
    return SummaryResponse(candidate_id=candidate_id, summary=summary)


async def _score_event_stream(candidate_id: int, viewer: User):
    """Yield newly-created scores as Server-Sent Events. Starts from the
    current max score id so only real-time updates are streamed."""
    with Session(engine) as session:
        query = select(Score.id).where(Score.candidate_id == candidate_id)
        if viewer.role != Role.admin:
            query = query.where(Score.reviewer_id == viewer.id)
        existing = session.exec(query.order_by(Score.id.desc())).first()
        last_id = existing or 0

    while True:
        with Session(engine) as session:
            query = select(Score).where(
                Score.candidate_id == candidate_id, Score.id > last_id
            )
            if viewer.role != Role.admin:
                query = query.where(Score.reviewer_id == viewer.id)
            new_scores = session.exec(query.order_by(Score.id)).all()
            payloads = [ScoreRead.model_validate(s).model_dump(mode="json") for s in new_scores]

        for payload in payloads:
            last_id = payload["id"]
            yield f"data: {json.dumps(payload)}\n\n"

        await asyncio.sleep(1)


@router.get("/{candidate_id}/stream")
async def stream_scores(
    candidate_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> StreamingResponse:
    if candidate_service.get_candidate(session, candidate_id) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate not found")
    return StreamingResponse(
        _score_event_stream(candidate_id, current_user),
        media_type="text/event-stream",
    )
