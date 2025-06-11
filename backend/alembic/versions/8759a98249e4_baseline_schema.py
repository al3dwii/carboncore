"""baseline schema

Revision ID: 8759a98249e4
Revises: 
Create Date: 2025-06-04 21:11:42.078560

"""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa

revision = '8759a98249e4'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'sku',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('provider', sa.String(), nullable=False),
        sa.Column('vcpu', sa.Integer(), nullable=False),
        sa.Column('ram_gb', sa.Float(), nullable=False),
        sa.Column('watts_per_vcpu', sa.Float(), nullable=False),
        sa.Column('price_hour_usd', sa.Numeric(10, 4), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    )

    op.create_table(
        'carbonsnapshot',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('region', sa.String(), nullable=False),
        sa.Column('gco2_per_kwh', sa.Float(), nullable=False),
        sa.Column('captured_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
    )

    op.create_table(
        'savingevent',
        sa.Column('id', sa.String(length=32), primary_key=True),
        sa.Column('project_id', sa.String(length=32), nullable=False, index=True),
        sa.Column('feature', sa.String(), nullable=False),
        sa.Column('kwh', sa.Float(), nullable=False),
        sa.Column('co2', sa.Float(), nullable=False),
        sa.Column('usd', sa.Numeric(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
    )
    op.create_index('ix_savingevent_project_id', 'savingevent', ['project_id'])
    op.create_index('ix_savingevent_created_at', 'savingevent', ['created_at'])

    op.create_table(
        'projecttoken',
        sa.Column('id', sa.String(length=32), primary_key=True),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('token_hash', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
    )
    op.create_index('ix_projecttoken_created_at', 'projecttoken', ['created_at'])


def downgrade() -> None:
    op.drop_index('ix_projecttoken_created_at', table_name='projecttoken')
    op.drop_table('projecttoken')
    op.drop_index('ix_savingevent_created_at', table_name='savingevent')
    op.drop_index('ix_savingevent_project_id', table_name='savingevent')
    op.drop_table('savingevent')
    op.drop_table('carbonsnapshot')
    op.drop_table('sku')
