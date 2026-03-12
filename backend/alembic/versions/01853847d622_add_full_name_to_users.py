"""add full_name to users

Revision ID: 01853847d622
Revises: e75846600fb5
Create Date: 2026-03-12 00:11:26.722568

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '01853847d622'
down_revision: Union[str, Sequence[str], None] = 'e75846600fb5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Add full_name to users. server_default is required for SQLite when adding
    # NOT NULL to a table that may have existing rows.
    op.add_column(
        "users",
        sa.Column("full_name", sa.String(length=255), nullable=False, server_default="User"),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("users", "full_name")
