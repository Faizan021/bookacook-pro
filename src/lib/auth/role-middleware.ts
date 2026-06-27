import { createMiddleware } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { UserRole } from "./get-user-profile.functions";
import { SESSION_CONFIG } from "./session.config";

// ---------------------------------------------------------------------------
// Roles that can be restored from user_metadata during self-healing.
//
// SEC-2: "admin" is intentionally absent. Any user can call
// supabase.auth.updateUser({ data: { role: "admin" } }) client-side to set
// their own metadata. If user_roles is ever emptied (migration bug, etc.) and
// we trusted metadata blindly, they would self-escalate to admin.
//
// The correct fix: admin is only ever granted via the admin panel or a
// controlled migration — never from metadata during self-healing.
// ---------------------------------------------------------------------------
const SELF_HEALABLE_ROLES: UserRole[] = [
  "customer",
  "restaurant_owner",
  "caterer",
  "planner",
];

export const requireRole = (role: UserRole) =>
  createMiddleware({ type: "function" })
    .middleware([requireSupabaseAuth])
    .server(async ({ next, context }) => {
      const { supabase, userId } = context as any;

      const [{ data: roles }, { data: authData }] = await Promise.all([
        supabase.from("user_roles").select("role").eq("user_id", userId),
        supabase.auth.getUser(),
      ]);

      if (authData?.user?.last_sign_in_at) {
        const lastSignIn = new Date(authData.user.last_sign_in_at).getTime();
        const hoursSinceSignIn = (Date.now() - lastSignIn) / (1000 * 60 * 60);
        if (hoursSinceSignIn > SESSION_CONFIG.ABSOLUTE_MAX_SESSION_HOURS) {
          throw new Error("Unauthorized: Absolute session lifetime exceeded. Please sign in again.");
        }
      }

      let roleList = (roles ?? []).map((r: any) => r.role as UserRole);

      // Self-healing: if user_roles is empty, try to restore from signup metadata.
      // Restricted to SELF_HEALABLE_ROLES — privileged roles (admin etc.) are
      // never restorable via metadata (see SEC-2 note above).
      if (roleList.length === 0 && authData?.user?.user_metadata?.role) {
        const metaRole = authData.user.user_metadata.role as string;

        if (SELF_HEALABLE_ROLES.includes(metaRole as UserRole)) {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          await supabaseAdmin
            .from("user_roles")
            .insert({ user_id: userId, role: metaRole as any });
          roleList = [metaRole as UserRole];

          console.log(
            `[Role] Self-healed user_roles from metadata for user=${userId} role=${metaRole}`
          );
        } else {
          // Metadata contains an unknown or privileged role — ignore it and fall
          // through to the default "customer" assignment. Log for monitoring.
          console.warn(
            `[Role] Rejected metadata role "${metaRole}" for user=${userId}: not in SELF_HEALABLE_ROLES`
          );
        }
      }

      // Final fallback: no roles in DB and no valid metadata role → treat as customer
      if (roleList.length === 0) {
        roleList = ["customer"];
      }

      if (!roleList.includes(role)) {
        throw new Error(`Unauthorized: Missing required role '${role}'`);
      }

      return next({
        context: {
          ...context,
          roles: roleList,
        },
      });
    });
