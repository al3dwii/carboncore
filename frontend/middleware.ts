// @ts-ignore - types missing in stub
import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({
  publicRoutes: ["/", "/pricing"],
  ignoredRoutes: ["/api/(.*)"],
});

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
