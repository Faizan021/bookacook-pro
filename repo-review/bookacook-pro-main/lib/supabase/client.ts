import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // SameSite=None + Secure so cookies are sent even from inside
      // cross-site iframes (e.g. the Replit preview pane embedded in replit.com).
      // Without this, SameSite=Lax blocks the cookies on server requests
      // that originate from within the iframe navigation.
      cookieOptions: {
        sameSite: "none",
        secure: true,
      },
    }
  );
}
