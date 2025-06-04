from secure import Secure
from starlette.types import ASGIApp, Receive, Scope, Send

class SecureHeadersMiddleware:
    def __init__(self, app: ASGIApp) -> None:
        self.app = app
        # use sane defaults for common security headers
        self.secure = Secure.with_default_headers()

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        async def send_wrapper(message: dict) -> None:
            if message["type"] == "http.response.start":
                for name, value in self.secure.headers.items():
                    message.setdefault("headers", []).append(
                        (name.encode(), value.encode())
                    )
            await send(message)
        await self.app(scope, receive, send_wrapper)

