"use server";
import { createMiddleware } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/database.types";
import { SESSION_CONFIG } from "./session.config";
import type { UserRole } from "./get-user-profile.functions";

const SELF_HEALABLE_ROLES: UserRole[] = [
  "customer",
  "restaurant_owner",
  "caterer",
  "planner",
  "partner",
];

export const requireSupabaseAuth = () =>
  createMiddleware({ type: "function" }).server(async ({ next }) => {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
      const missing = [
        ...(!SUPABASE_URL ? ["SUPABASE_URL"] : []),
        ...(!SUPABASE_PUBLISHABLE_KEY ? ["SUPABASE_PUBLISHABLE_KEY"] : []),
      ];
      const message = `Missing Supabase environment variable(s): ${missing.join(", ")}. Connect Supabase in Lovable Cloud.`;
      console.error(`[Supabase] ${message}`);
      throw new Error(message);
    }

    const { getRequest } = await import("@tanstack/react-start/server");
    const request = getRequest();

    if (!request?.headers) {
      throw new Error("Unauthorized: No request headers available");
    }

    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      throw new Error("Unauthorized: No authorization header provided");
    }

    if (!authHeader.startsWith("Bearer ")) {
      throw new Error("Unauthorized: Only Bearer tokens are supported");
    }

    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      throw new Error("Unauthorized: No token provided");
    }

    const supabaseClient = createClient<Database>(SUPABASE_URL!, SUPABASE_PUBLISHABLE_KEY!, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      auth: {
        storage: undefined,
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data, error } = await supabaseClient.auth.getClaims(token);
    if (error || !data?.claims) {
      throw new Error("Unauthorized: Invalid token");
    }

    if (!data.claims.sub) {
      throw new Error("Unauthorized: No user ID found in token");
    }

    return next({
      context: {
        supabase: supabaseClient,
        userId: data.claims.sub,
        claims: data.claims,
      },
    });
  });

type OptionalAuthContext = { supabase: SupabaseClient<Database> | null; userId: string | null };

export const optionalSupabaseAuth = () =>
  createMiddleware({ type: "function" }).server(async ({ next }) => {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;

    const makeNext = (supabase: SupabaseClient<Database> | null, userId: string | null) =>
      next({ context: { supabase, userId } as OptionalAuthContext });

    if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
      return makeNext(null, null);
    }

    const { getRequest } = await import("@tanstack/react-start/server");
    const request = getRequest();
    if (!request?.headers) {
      return makeNext(null, null);
    }

    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return makeNext(null, null);
    }

    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return makeNext(null, null);
    }

    const supabaseClient = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      global: {
        headers: { Authorization: `Bearer ${token}` },
      },
    });

    try {
      const {
        data: { user },
        error,
      } = await supabaseClient.auth.getUser();
      return makeNext(supabaseClient, error || !user ? null : user.id);
    } catch {
      return makeNext(supabaseClient, null);
    }
  });

export const requireRole = (role: UserRole) =>
  createMiddleware({ type: "function" })
    .middleware([requireSupabaseAuth()])
    .server(async ({ next, context }) => {
      const {
        supabase: supabaseCtx,
        userId,
        claims,
      } = context as {
        supabase: typeof supabase;
        userId: string;
        claims: Record<string, unknown>;
      };

      // Fallback if supabase context is missing
      const dbClient = supabaseCtx || supabase;

      // Session lifetime check using JWT's iat claim — no extra network call needed
      const iat = claims?.iat as number | undefined;
      if (iat) {
        const issuedAtMs = iat * 1000;
        const hoursSinceIssued = (Date.now() - issuedAtMs) / (1000 * 60 * 60);
        if (hoursSinceIssued > SESSION_CONFIG.ABSOLUTE_MAX_SESSION_HOURS) {
          throw new Error(
            "Unauthorized: Absolute session lifetime exceeded. Please sign in again.",
          );
        }
      }

      const { data: roles } = await dbClient
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);

      let roleList = (roles ?? []).map((r) => r.role as unknown as UserRole);

      // Platform Owner Auto-Grant
      const email = (claims as Record<string, unknown>)?.email;
      if (typeof email === "string" && email.toLowerCase() === "faizan.ahmed01213@gmail.com") {
        if (!roleList.includes("admin")) {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          await supabaseAdmin
            .from("user_roles")
            .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });
          roleList.push("admin");
        }
      }

      // Self-heal from JWT user_metadata if no roles found in DB
      const userMeta = claims?.user_metadata as Record<string, unknown> | undefined;
      const metaRole = userMeta?.role as string | undefined;
      if (roleList.length === 0 && metaRole) {
        if (SELF_HEALABLE_ROLES.includes(metaRole as UserRole)) {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          await supabaseAdmin.from("user_roles").insert({
            user_id: userId,
            role: metaRole as unknown as Database["public"]["Enums"]["app_role"],
          });
          roleList = [metaRole as UserRole];

          console.log(
            `[Role] Self-healed user_roles from metadata for user=${userId} role=${metaRole}`,
          );
        } else {
          console.warn(
            `[Role] Rejected metadata role "${metaRole}" for user=${userId}: not in SELF_HEALABLE_ROLES`,
          );
        }
      }

      if (roleList.length === 0) {
        roleList = ["customer"];
      }

      // Map legacy roles to unified partner role
      if (
        roleList.some((r: string) => ["restaurant_owner", "caterer", "planner"].includes(r)) &&
        !roleList.includes("partner")
      ) {
        roleList.push("partner");
      }

      // ⚠️ ARCHITECTURE REVIEW REQUIRED (follow-up ticket: ARCH-001)
      // This block expands the unified `partner` role into all three vertical roles
      // (restaurant_owner, caterer, planner) for backward compatibility with server
      // functions that check for a specific vertical role.
      //
      // RISK: Any feature that uses requireRole("restaurant_owner") is silently
      // accessible to Caterers and Planners unless a vertical-specific guard is also
      // applied at the handler level (see assertRestaurantOwnerPrimary() in
      // surplus.functions.ts as the current compensating control pattern).
      //
      // RECOMMENDED FIX: Replace this blanket expansion with a per-feature permission
      // map keyed by user_roles.role. Each vertical should only expand to the roles
      // it genuinely needs. Review scheduled in auth-model refactor sprint.
      if (roleList.includes("partner")) {
        if (!roleList.includes("restaurant_owner")) roleList.push("restaurant_owner" as UserRole);
        if (!roleList.includes("caterer")) roleList.push("caterer" as UserRole);
        if (!roleList.includes("planner")) roleList.push("planner" as UserRole);
      }

      if (!roleList.includes(role)) {
        throw new Error(`Unauthorized: Missing required role '${role}'`);
      }

      return next({
        context: {
          ...context,
          supabase: dbClient,
          roles: roleList,
        },
      });
    });
