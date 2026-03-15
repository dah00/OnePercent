"""Initial migration - current state

Revision ID: e75846600fb5
Revises: 
Create Date: 2025-12-07 15:08:52.777480

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e75846600fb5'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # SQLite doesn't support ALTER for constraints - use batch mode
    with op.batch_alter_table('messages', schema=None) as batch_op:
        batch_op.create_foreign_key('fk_messages_user_id', 'users', ['user_id'], ['id'])


def downgrade() -> None:
    """Downgrade schema."""
    with op.batch_alter_table('messages', schema=None) as batch_op:
        batch_op.drop_constraint('fk_messages_user_id', type_='foreignkey')
