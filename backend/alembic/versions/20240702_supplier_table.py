"""supplier table"""
from alembic import op
import sqlalchemy as sa
revision = '20240702_supplier_table'
down_revision = '20240701_event_log'

def upgrade() -> None:
    op.create_table(
        'supplier',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('url', sa.String(), nullable=False),
        sa.Column('sla_gco2', sa.Float(), nullable=False),
    )

def downgrade() -> None:
    op.drop_table('supplier')
