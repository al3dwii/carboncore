"""event log table"""
from alembic import op
import sqlalchemy as sa
revision = '20240701_event_log'
down_revision = '20240613_ledger_rls'

def upgrade() -> None:
    op.create_table(
        'event',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('event_type_id', sa.String(length=32), nullable=False),
        sa.Column('meta', sa.JSON(), nullable=False, server_default='{}'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_event_type', 'event', ['event_type_id'])

def downgrade() -> None:
    op.drop_index('ix_event_type', table_name='event')
    op.drop_table('event')
