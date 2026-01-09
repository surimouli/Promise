import { authMiddleware } from "@clerk/nextjs";

/**
 * Protect everything by default, but allow Next internal files and public routes.
 * We'll keep it simple for now: user must be signed in to use the app.
 */
export default authMiddleware({
  publicRoutes: ["/sign-in(.*)", "/sign-up(.*)"],
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};