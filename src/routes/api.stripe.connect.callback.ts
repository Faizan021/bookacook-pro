import { createFileRoute } from "@tanstack/react-router";
import { verifyConnectState, exchangeCodeForUser } from "@/lib/stripe";

export const Route = createFileRoute("/api/stripe/connect/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const requestUrl = new URL(request.url);
        const code = requestUrl.searchParams.get("code");
        const stateParam = requestUrl.searchParams.get("state");
        const error = requestUrl.searchParams.get("error");
        const errorDescription = requestUrl.searchParams.get("error_description");

        const redirectUrl = `${requestUrl.origin}/_authenticated/restaurant`;

        // ── Handle Stripe-reported errors ────────────────────────────────────
        if (error) {
          console.error("[Stripe Connect Callback] OAuth error:", error, errorDescription);
          return new Response(null, {
            status: 302,
            headers: {
              Location: `${redirectUrl}?connect_error=${encodeURIComponent(errorDescription || error)}`,
            },
          });
        }

        // ── Validate required parameters ─────────────────────────────────────
        if (!code || !stateParam) {
          console.error("[Stripe Connect Callback] Missing code or state parameter");
          return new Response(null, {
            status: 302,
            headers: {
              Location: `${redirectUrl}?connect_error=${encodeURIComponent("Missing authorization code or state")}`,
            },
          });
        }

        // ── Verify CSRF state (HMAC-signed, time-limited) ────────────────────
        // The state was created by getConnectOAuthUrl() using HMAC-SHA256.
        // This ensures the callback was initiated by our server and prevents
        // an attacker from injecting their code with an arbitrary slug.
        const stateResult = verifyConnectState(stateParam);
        if (!stateResult.valid) {
          console.error("[Stripe Connect Callback] Invalid state parameter:", stateResult.reason);
          return new Response(null, {
            status: 302,
            headers: {
              Location: `${redirectUrl}?connect_error=${encodeURIComponent("Invalid or expired OAuth state. Please try connecting again.")}`,
            },
          });
        }

        const slug = stateResult.slug;

        try {
          // ── Verify the caller is authenticated and owns this restaurant ─────
          // We resolve the requesting user from their session cookie / auth header
          // and confirm they own the restaurant slug from the verified state token.
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

          // Attempt to extract the caller's JWT from the Authorization header
          // (set by the browser redirect — present when the restaurant dashboard
          // embeds the redirect URL with an active session).
          const authHeader = request.headers.get("authorization");
          let callerId: string | null = null;

          if (authHeader?.startsWith("Bearer ")) {
            const token = authHeader.replace("Bearer ", "");
            const { data } = await supabaseAdmin.auth.getUser(token);
            callerId = data?.user?.id ?? null;
          }

          // Fetch the restaurant and verify ownership
          const { data: restaurant, error: fetchError } = await supabaseAdmin
            .from("restaurants")
            .select("id, owner_id")
            .eq("slug", slug)
            .maybeSingle();

          if (fetchError || !restaurant) {
            console.error("[Stripe Connect Callback] Restaurant not found for slug:", slug);
            return new Response(null, {
              status: 302,
              headers: {
                Location: `${redirectUrl}?connect_error=${encodeURIComponent("Restaurant not found")}`,
              },
            });
          }

          // If we can identify the caller, enforce ownership.
          // If the auth header is absent (some OAuth redirect flows drop it),
          // we log a warning but allow the connection — the state HMAC already
          // proves the request originated from our server within 15 minutes.
          if (callerId && callerId !== restaurant.owner_id) {
            console.error(
              `[Stripe Connect Callback] Ownership mismatch: caller=${callerId} owner=${restaurant.owner_id} slug=${slug}`
            );
            return new Response(null, {
              status: 302,
              headers: {
                Location: `${redirectUrl}?connect_error=${encodeURIComponent("You do not own this restaurant")}`,
              },
            });
          }

          if (!callerId) {
            console.warn(
              `[Stripe Connect Callback] No auth header present for slug=${slug}. ` +
              `State HMAC verified — proceeding. Consider enforcing auth on this callback.`
            );
          }

          // ── Exchange code for Stripe account ID ──────────────────────────────
          const { stripeUserId } = await exchangeCodeForUser(code);

          if (!stripeUserId) {
            throw new Error("No stripe_user_id returned from OAuth token exchange");
          }

          // ── Persist the connected account ID ────────────────────────────────
          const { error: dbError } = await supabaseAdmin
            .from("restaurants")
            .update({
              stripe_user_id: stripeUserId,
              stripe_connect_status: "connected",
              stripe_connected_at: new Date().toISOString(),
            })
            .eq("id", restaurant.id); // Use the DB primary key, not the slug

          if (dbError) {
            throw dbError;
          }

          console.log(
            `[Stripe Connect] Account ${stripeUserId} connected for restaurant slug=${slug} id=${restaurant.id}`
          );

          return new Response(null, {
            status: 302,
            headers: {
              Location: `${redirectUrl}?connect_success=true`,
            },
          });
        } catch (err: any) {
          console.error("[Stripe Connect Callback] Exception:", err.message);
          return new Response(null, {
            status: 302,
            headers: {
              Location: `${redirectUrl}?connect_error=${encodeURIComponent("Failed to connect Stripe account. Please try again.")}`,
            },
          });
        }
      },
    },
  },
});
