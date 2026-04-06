import { createClient } from "@/lib/supabase/server";

export async function getUserProfile() {
  try {
    const supabase = await createClient();

    // Primary: getSession() reads the JWT from cookies locally — no network
    // call, works even when Supabase's auth endpoint is slow or unreachable.
    const { data: { session } } = await supabase.auth.getSession();

    // Secondary: getUser() validates the token with Supabase's auth server.
    // We call it regardless so fresh tokens are written back to cookies.
    const { data: { user } } = await supabase.auth.getUser();

    // Use whichever returned a user — session user is acceptable for role-
    // resolution; actual DB queries still enforce RLS.
    const resolvedUser = user ?? session?.user ?? null;

    if (!resolvedUser) {
      return { user: null, profile: null };
    }

    // Try profiles table (requires migration 004 RLS policy to be applied)
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", resolvedUser.id)
      .maybeSingle();

    if (profile) {
      return { user: resolvedUser, profile };
    }

    // Fallback: build a minimal profile from JWT user_metadata / app_metadata
    const meta    = (resolvedUser.user_metadata  ?? {}) as Record<string, unknown>;
    const appMeta = (resolvedUser.app_metadata   ?? {}) as Record<string, unknown>;
    const role    = (meta.role as string | undefined) || (appMeta.role as string | undefined) || null;

    if (role) {
      return {
        user: resolvedUser,
        profile: {
          id:         resolvedUser.id,
          role,
          full_name:  (meta.full_name  as string | undefined) ?? null,
          first_name: (meta.first_name as string | undefined) ?? null,
          phone:      (meta.phone      as string | undefined) ?? null,
        },
      };
    }

    return { user: resolvedUser, profile: null };

  } catch {
    return { user: null, profile: null };
  }
}
