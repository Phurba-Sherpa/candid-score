from sqlmodel import Field, SQLModel


class UserBase(SQLModel):
    id: int | None = Field(default=None, primary_key=True)
    pass


class CandidateBase(SQLModel):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    email: str
    role_applied: str
    status: str
    skills: list[str]
    internal_note: str | None = None


class CandidateRead(CandidateBase, table=True):
    pass
