import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/pricing"],
  ignoredRoutes: ["/api/(.*)"],
});

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
