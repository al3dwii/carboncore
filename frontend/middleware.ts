// middleware.ts  – Clerk v5, Next 14
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/pricing"]);

export default clerkMiddleware(async (auth, req) => {
 // 1) skip internal API proxies
 if (req.nextUrl.pathname.startsWith("/api/")) return;

 // 2) allow public pages without auth
 if (isPublicRoute(req)) return;

 // 3) protect everything else
 const { userId, redirectToSignIn } = await auth();   // ⬅️ await here
 if (!userId) {
   return redirectToSignIn({ returnBackUrl: req.url });
 }
});

export const config = {
 matcher: ["/((?!_next|favicon.ico|_static).*)"],
};