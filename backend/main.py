from fastapi import Depends, FastAPI
from sqlmodel import Session, text

from app.core.database import get_session

app = FastAPI()


@app.get("/")
def root():
    return {"message": "Recruitment API"}


@app.get("/health")
def health(session: Session = Depends(get_session)):
    session.exec(text("SELECT 1"))
    return {"status": "ok"}
