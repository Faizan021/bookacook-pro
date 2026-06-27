import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export type UserRole = "customer" | "restaurant_owner" | "caterer" | "planner";

// SEC-2: Roles that may be restored from signup metadata during self-healing.
// "admin" is intentionally excluded — it can never be granted via metadata.
const SELF_HEALABLE_ROLES: UserRole[] = [
  "customer",
  "restaurant_owner",
  "caterer",
  "planner",
];

export const getUserProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth()])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    // 1. Fetch profile, roles, and auth user in parallel
    const [{ data: profile }, { data: roles }, { data: authData }] =
      await Promise.all([
        supabase
          .from("profiles")
          .select("id, full_name")
          .eq("id", userId)
          .maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", userId),
        supabase.auth.getUser(),
      ]);

    let roleList = (roles ?? []).map((r) => r.role as UserRole);

    const metaRole = authData?.user?.user_metadata?.role as string | undefined;
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    // 2. Check partner_profiles table as the source of truth
    const { data: partnerProfile } = await supabaseAdmin
      .from("partner_profiles")
      .select("partner_type")
      .eq("user_id", userId)
      .maybeSingle();

    if (partnerProfile) {
      const partnerRole = partnerProfile.partner_type as UserRole;
      if (!roleList.includes(partnerRole)) {
        await supabaseAdmin
          .from("user_roles")
          .insert({ user_id: userId, role: partnerRole as any });
        roleList.push(partnerRole);
        console.log(`[Role] Self-healed missing partner role "${partnerRole}" from partner_profiles for user=${userId}`);
      }
    } else if (metaRole && metaRole !== "customer" && !roleList.includes(metaRole as UserRole)) {
      // Fallback to metadata role if no partner profile exists yet (e.g. during fresh signup)
      if (SELF_HEALABLE_ROLES.includes(metaRole as UserRole)) {
        await supabaseAdmin
          .from("user_roles")
          .insert({ user_id: userId, role: metaRole as any });
        roleList.push(metaRole as UserRole);
        console.log(`[Role] Self-healed missing role "${metaRole}" from metadata for user=${userId}`);
      }
    }

    // 3. Default: no roles in DB and no valid metadata → customer
    if (roleList.length === 0) {
      roleList = ["customer"];
    }

    const priority: UserRole[] = [
      "restaurant_owner",
      "caterer",
      "planner",
      "customer",
    ];
    const primary = priority.find((r) => roleList.includes(r)) ?? "customer";

    return {
      userId,
      fullName: profile?.full_name ?? null,
      roles: roleList,
      primaryRole: primary as UserRole,
    };
  });

export const checkEmailRole = createServerFn({ method: "POST" })
  .inputValidator((input: { email: string }) =>
    z.object({ email: z.string().email() }).parse(input)
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const emailLower = data.email.toLowerCase();

    // Find user profile by email
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", emailLower)
      .maybeSingle();

    if (profileError || !profile) {
      // Check partner_profiles table as backup
      const { data: partnerProfile } = await supabaseAdmin
        .from("partner_profiles")
        .select("partner_type")
        .eq("email", emailLower)
        .maybeSingle();

      if (partnerProfile) {
        return {
          exists: true,
          roles: [partnerProfile.partner_type as UserRole],
          primaryRole: partnerProfile.partner_type as UserRole,
        };
      }

      return { exists: false, roles: [] as UserRole[], primaryRole: null };
    }

    // Get user roles
    const { data: roles } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", profile.id);

    const roleList = (roles ?? []).map((r) => r.role as UserRole);
    if (roleList.length === 0) {
      roleList.push("customer");
    }

    const priority: UserRole[] = [
      "restaurant_owner",
      "caterer",
      "planner",
      "customer",
    ];
    const primary = priority.find((r) => roleList.includes(r)) ?? "customer";

    return {
      exists: true,
      roles: roleList,
      primaryRole: primary as UserRole,
    };
  });


