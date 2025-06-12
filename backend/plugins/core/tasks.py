"""Example Celery task used for integration tests."""

def echo(msg: str) -> str:
    print("ECHO", msg)
    return msg
