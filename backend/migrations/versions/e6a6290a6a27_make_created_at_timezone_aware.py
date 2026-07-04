"""make created_at timezone aware

Revision ID: e6a6290a6a27
Revises: d8576cfd69e2
Create Date: 2026-07-04 10:20:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e6a6290a6a27'
down_revision: Union[str, Sequence[str], None] = 'd8576cfd69e2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    for table_name in ("users", "candidates", "scores"):
        op.execute(
            sa.text(
                f"ALTER TABLE {table_name} "
                "ALTER COLUMN created_at "
                "TYPE TIMESTAMP WITH TIME ZONE "
                "USING created_at AT TIME ZONE 'UTC'"
            )
        )


def downgrade() -> None:
    """Downgrade schema."""
    for table_name in ("users", "candidates", "scores"):
        op.execute(
            sa.text(
                f"ALTER TABLE {table_name} "
                "ALTER COLUMN created_at "
                "TYPE TIMESTAMP WITHOUT TIME ZONE "
                "USING created_at AT TIME ZONE 'UTC'"
            )
        )
