// Clerk v5 (≥5.0) + Next 14
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// public pages that should NOT trigger auth
const isPublicRoute = createRouteMatcher(["/", "/pricing"]);

export default clerkMiddleware(async (auth, req) => {
  /* 1) Skip our own API proxies ---------------------------------------- */
  if (req.nextUrl.pathname.startsWith("/api/")) return;

  /* 2) Allow public pages ---------------------------------------------- */
  if (isPublicRoute(req)) return;

  /* 3) Protect everything else ---------------------------------------- */
  const { userId, redirectToSignIn } = await auth(); // <-- callback arg!
  if (!userId) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }
});

/* Tell Next which paths run through the middleware */
export const config = {
  matcher: ["/((?!_next|favicon.ico|_static).*)"],
};
