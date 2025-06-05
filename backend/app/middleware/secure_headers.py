import os
from secure import Secure
from starlette.types import ASGIApp, Receive, Scope, Send

# CSP that lets Swagger/ReDoc pull assets from the CDN **and** run inline <script>/<style>.
DEV_CSP = (
    "default-src 'self' https://cdn.jsdelivr.net https://fastapi.tiangolo.com; "
    "script-src 'self' https://cdn.jsdelivr.net 'unsafe-inline'; "
    "style-src  'self' https://cdn.jsdelivr.net 'unsafe-inline'; "
    "img-src    'self' https://fastapi.tiangolo.com data:;"
)

class SecureHeadersMiddleware:
    def __init__(self, app: ASGIApp) -> None:
        self.app = app

        # ---------- 1. Decide whether to send any security headers ----------
        disable = os.getenv("DISABLE_SECURE_HEADERS") == "1" or os.getenv("ENV") == "local"
        if disable:                      # local dev --> no headers at all
            self.secure = Secure()       # empty instance
            self.secure.headers.clear()
            return

        # ---------- 2. Start with the sane defaults you already had ----------
        self.secure = Secure.with_default_headers()

        # ---------- 3. Relax the CSP only when running inside Codespaces/Gitpod ----------
        if os.getenv("IN_IDE") == "codespaces":      # optional marker you can set in devcontainer.json
            self.secure.headers["Content-Security-Policy"] = DEV_CSP
        # else: keep the original locked-down CSP for production

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        async def send_wrapper(message: dict) -> None:
            if message["type"] == "http.response.start":
                # inject our headers
                headers = message.setdefault("headers", [])
                headers.extend(
                    (name.encode(), value.encode())
                    for name, value in self.secure.headers.items()
                )
            await send(message)

        await self.app(scope, receive, send_wrapper)
