"use server";
import { createMiddleware } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { SESSION_CONFIG } from "./session.config";
import type { UserRole } from "./get-user-profile.functions";

const SELF_HEALABLE_ROLES: UserRole[] = [
  "customer",
  "restaurant_owner",
  "caterer",
  "planner",
];

export const requireSupabaseAuth = () => createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
      const missing = [
        ...(!SUPABASE_URL ? ['SUPABASE_URL'] : []),
        ...(!SUPABASE_PUBLISHABLE_KEY ? ['SUPABASE_PUBLISHABLE_KEY'] : []),
      ];
      const message = `Missing Supabase environment variable(s): ${missing.join(', ')}. Connect Supabase in Lovable Cloud.`;
      console.error(`[Supabase] ${message}`);
      throw new Error(message);
    }
    
    const { getRequest } = await import('@tanstack/react-start/server');
    const request = getRequest();

    if (!request?.headers) {
      throw new Error('Unauthorized: No request headers available');
    }

    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      throw new Error('Unauthorized: No authorization header provided');
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new Error('Unauthorized: Only Bearer tokens are supported');
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      throw new Error('Unauthorized: No token provided');
    }

    const supabaseClient = createClient<Database>(
      SUPABASE_URL!,
      SUPABASE_PUBLISHABLE_KEY!,
      {
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
      }
    );

    const { data, error } = await supabaseClient.auth.getClaims(token);
    if (error || !data?.claims) {
      throw new Error('Unauthorized: Invalid token');
    }

    if (!data.claims.sub) {
      throw new Error('Unauthorized: No user ID found in token');
    }

    return next({
      context: {
        supabase: supabaseClient,
        userId: data.claims.sub,
        claims: data.claims,
      },
    });
  },
);

export const optionalSupabaseAuth = () => createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
      return next({ context: { supabase: null, userId: null } });
    }
    
    const { getRequest } = await import('@tanstack/react-start/server');
    const request = getRequest();
    if (!request?.headers) {
      return next({ context: { supabase: null, userId: null } });
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next({ context: { supabase: null, userId: null } });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return next({ context: { supabase: null, userId: null } });
    }

    const supabaseClient = createClient<Database>(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    );

    try {
      const { data: { user }, error } = await supabaseClient.auth.getUser();
      if (error || !user) {
        return next({ context: { supabase: supabaseClient, userId: null } });
      }
      return next({ context: { supabase: supabaseClient, userId: user.id } });
    } catch {
      return next({ context: { supabase: supabaseClient, userId: null } });
    }
  }
);

export const requireRole = (role: UserRole) =>
  createMiddleware({ type: "function" })
    .middleware([requireSupabaseAuth()])
    .server(async ({ next, context }) => {
      const { supabase: supabaseCtx, userId } = context as any;

      // Fallback if supabase context is missing
      const dbClient = supabaseCtx || supabase;

      const [{ data: roles }, { data: authData }] = await Promise.all([
        dbClient.from("user_roles").select("role").eq("user_id", userId),
        dbClient.auth.getUser(),
      ]);

      if (authData?.user?.last_sign_in_at) {
        const lastSignIn = new Date(authData.user.last_sign_in_at).getTime();
        const hoursSinceSignIn = (Date.now() - lastSignIn) / (1000 * 60 * 60);
        if (hoursSinceSignIn > SESSION_CONFIG.ABSOLUTE_MAX_SESSION_HOURS) {
          throw new Error("Unauthorized: Absolute session lifetime exceeded. Please sign in again.");
        }
      }

      let roleList = (roles ?? []).map((r: any) => r.role as UserRole);

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
          console.warn(
            `[Role] Rejected metadata role "${metaRole}" for user=${userId}: not in SELF_HEALABLE_ROLES`
          );
        }
      }

      if (roleList.length === 0) {
        roleList = ["customer"];
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
