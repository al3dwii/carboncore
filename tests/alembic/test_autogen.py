import subprocess, pathlib, re

def test_models_match_migrations(tmp_path):
    out = subprocess.check_output(
        ["alembic","revision","--autogenerate","-m","check","--stdout"])
    assert re.search(r"^\s*op\.", out.decode()) is None, "Uncreated migration!"
