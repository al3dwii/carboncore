# backend/app/database.py   ← exact path required
"""
Shim kept only for backward-compatibility.

New code should import from `app.core.deps`, but some plugins still do
`from app.database import …`.
"""
from app.core.deps import *   # re-export everything the old code needs
