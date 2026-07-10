import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { SessionTimeoutManager } from "@/components/SessionTimeoutManager";
import { SESSION_CONFIG } from "@/lib/auth/session.config";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      if (error) console.error("Supabase auth error, clearing session:", error);
      await supabase.auth.signOut();
      throw redirect({
        to: "/auth",
        search: { signup: undefined, message: "Please sign in to continue.", logout: undefined } as any,
      });
    }

    // Enforce Absolute Maximum Session Lifetime
    if (data.user.last_sign_in_at) {
      const lastSignIn = new Date(data.user.last_sign_in_at).getTime();
      const now = Date.now();
      const hoursSinceSignIn = (now - lastSignIn) / (1000 * 60 * 60);

      if (hoursSinceSignIn > SESSION_CONFIG.ABSOLUTE_MAX_SESSION_HOURS) {
        await supabase.auth.signOut();
        throw redirect({
          to: "/auth",
          search: {
            signup: undefined,
            message: "Your session has expired. Please sign in again.",
            logout: undefined,
          } as any,
        });
      }
    }

    return { user: data.user };
  },
  component: () => (
    <SessionTimeoutManager>
      <Outlet />
    </SessionTimeoutManager>
  ),
});
