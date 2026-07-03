"""Create or promote an admin user for local/bootstrap use.

Usage:
    uv run python -m app.create_admin --email admin@example.com --password secret
"""

from argparse import ArgumentParser

from sqlmodel import Session, select

from app.auth import hash_password
from app.core.database import engine
from app.models import Role, User


def create_admin(email: str, password: str) -> None:
    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == email)).first()

        if user is None:
            user = User(
                email=email,
                hashed_password=hash_password(password),
                role=Role.admin,
            )
            session.add(user)
            session.commit()
            print(f"Created admin user {email}.")
            return

        was_admin = user.role == Role.admin
        user.role = Role.admin
        user.hashed_password = hash_password(password)
        session.add(user)
        session.commit()

        if was_admin:
            print(f"Updated password for existing admin {email}.")
            return

        print(f"Promoted existing user {email} to admin and updated password.")


def main() -> None:
    parser = ArgumentParser(description="Create or promote an admin user")
    parser.add_argument("--email", required=True)
    parser.add_argument("--password", required=True)
    args = parser.parse_args()
    create_admin(email=args.email, password=args.password)


if __name__ == "__main__":
    main()
