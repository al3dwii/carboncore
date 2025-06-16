from alembic import op
import sqlalchemy as sa
from sqlmodel.sql.sqltypes import AutoString

# revision identifiers, used by Alembic.
revision = "20240617_plugin_table"
down_revision = "20240702_supplier_table"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "plugins",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("name", AutoString(), nullable=False),
        sa.Column("version", AutoString(), nullable=False),
        sa.Column(
            "created_at",
            sa.TIMESTAMP(timezone=True),
            server_default=sa.func.now(),
        ),
    )
    op.create_index("ix_plugins_id", "plugins", ["id"])


def downgrade() -> None:
    op.drop_index("ix_plugins_id", table_name="plugins")
    op.drop_table("plugins")
