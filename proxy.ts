import { NextResponse, type NextRequest } from "next/server";

/**
 * Proxy (formerly middleware) — kept as a pure pass-through.
 *
 * Auth-gating is handled inside each protected page via getUserProfile():
 *   if (!user) redirect("/login")
 *   if (!profile) redirect("/")
 *
 * Doing auth here too caused redirect loops because the Supabase session
 * cookie isn't reliably readable at the proxy layer in the Replit environment.
 */
export function proxy(request: NextRequest) {
  return NextResponse.next({ request });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
