import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  if (url.pathname.startsWith("/org/")) return;

  const orgId = req.cookies.get("cc-org")?.value;
  if (orgId) {
    url.pathname = `/org/${orgId}${url.pathname}`;
    return NextResponse.redirect(url);
  }
}
export const config = { matcher: ["/((?!_next|api|favicon.ico).*)"] };
