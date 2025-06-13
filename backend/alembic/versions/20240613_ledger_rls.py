from alembic import op
import sqlalchemy as sa

revision = "20240613_ledger_rls"
down_revision = "9d42b6ef8b3e"

def upgrade() -> None:
    op.add_column("ledger", sa.Column("checksum", sa.LargeBinary(32), nullable=True))
    op.execute(
        """
        -- 1) row-level security
        ALTER TABLE ledger ENABLE ROW LEVEL SECURITY;
        CREATE POLICY ledger_ro
            ON ledger FOR SELECT USING (true);
        CREATE POLICY ledger_no_update
            ON ledger FOR UPDATE USING (false);
        CREATE POLICY ledger_no_delete
            ON ledger FOR DELETE USING (false);
        -- 2) write-once checksum trigger
        CREATE EXTENSION IF NOT EXISTS "pgcrypto";
        CREATE OR REPLACE FUNCTION set_checksum() RETURNS trigger AS $$
        BEGIN
            NEW.checksum := digest(
                concat_ws('|', NEW.project_id, NEW.ts, NEW.delta_co2, NEW.delta_cost),
                'sha256'
            );
            RETURN NEW;
        END; $$ LANGUAGE plpgsql;
        CREATE TRIGGER trg_set_checksum
            BEFORE INSERT ON ledger
            FOR EACH ROW EXECUTE FUNCTION set_checksum();
        """
    )

def downgrade() -> None:
    op.execute("DROP TRIGGER IF EXISTS trg_set_checksum ON ledger;")
    op.drop_column("ledger", "checksum")
