from sqlmodel import Session, create_engine

from app.core.config import settings

engine = create_engine(
    settings.database_url,
    echo=True,
    pool_pre_ping=True,
    connect_args={"options": "-c timezone=UTC"},
)


def get_session():
    with Session(engine) as session:
        yield session
