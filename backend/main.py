from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, text

from app.core.database import get_session
from app.routers import auth, candidates

origins = [
    "http://localhost:5173",
]

app = FastAPI(title="Recruitment API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(candidates.router)


@app.get("/")
def root():
    return {"message": "Recruitment API"}


@app.get("/health")
def health(session: Session = Depends(get_session)):
    session.exec(text("SELECT 1"))
    return {"status": "ok"}
