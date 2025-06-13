import json, os, sys
from app.core.plan_parsers import auto_parse


def main():
    dialect = os.getenv("IAC_DIALECT", "terraform")
    plan = json.load(sys.stdin)
    actions = auto_parse(plan, dialect)
    print(actions)  # placeholder for estimate + PR logic

if __name__ == "__main__":
    main()
