-- Enable Row-Level Security for multi-tenant isolation
-- Sprint-5 security hardening

ALTER TABLE savingevent ENABLE ROW LEVEL SECURITY;
ALTER TABLE sku          ENABLE ROW LEVEL SECURITY;

-- Policy: only allow rows that match current_project()
CREATE OR REPLACE FUNCTION current_project() RETURNS uuid
    LANGUAGE sql STABLE AS $$ SELECT current_setting('carbon.project_id', true)::uuid $$;

CREATE POLICY savingevent_isolation
    ON savingevent FOR ALL USING (project_id = current_project());

CREATE POLICY sku_read_all             -- SKUs are global read
    ON sku       FOR SELECT USING (true);

GRANT USAGE ON SCHEMA public TO PUBLIC;        -- needed for RLS functions
