import { createClient } from "@/lib/supabase/server";

export async function getUserProfile() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { user: null, profile: null };
    }

    // Try the profiles table (requires RLS SELECT policy — migration 004)
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle(); // maybeSingle returns null (not an error) when 0 rows found

    if (profile) {
      return { user, profile };
    }

    // Fallback: build a minimal profile from JWT metadata so authenticated
    // users are never blocked solely because the RLS SELECT policy is missing.
    const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
    const appMeta = (user.app_metadata ?? {}) as Record<string, unknown>;

    const role =
      (meta.role as string | undefined) ||
      (appMeta.role as string | undefined) ||
      null;

    if (role) {
      const syntheticProfile = {
        id: user.id,
        role,
        full_name:  (meta.full_name  as string | undefined) ?? null,
        first_name: (meta.first_name as string | undefined) ?? null,
        phone:      (meta.phone      as string | undefined) ?? null,
      };
      return { user, profile: syntheticProfile };
    }

    // User is authenticated but we truly cannot determine their role yet
    return { user, profile: null };
  } catch {
    return { user: null, profile: null };
  }
}
