"""event type lookup

Revision ID: 9d42b6ef8b3e
Revises: 8759a98249e4
Create Date: 2025-06-05 10:00:00

"""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa

revision = '9d42b6ef8b3e'
down_revision = '8759a98249e4'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'eventtype',
        sa.Column('id', sa.String(length=32), primary_key=True),
        sa.Column('json_schema', sa.JSON(), nullable=False, server_default='{}'),
    )

    with op.batch_alter_table('savingevent') as batch_op:
        batch_op.add_column(sa.Column('event_type_id', sa.String(length=32), nullable=False, server_default='default'))
        batch_op.create_foreign_key('fk_savingevent_event_type', 'eventtype', ['event_type_id'], ['id'])


def downgrade() -> None:
    with op.batch_alter_table('savingevent') as batch_op:
        batch_op.drop_constraint('fk_savingevent_event_type', type_='foreignkey')
        batch_op.drop_column('event_type_id')

    op.drop_table('eventtype')

