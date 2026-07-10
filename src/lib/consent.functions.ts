import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const upsertConsentRecord = createServerFn({ method: "POST" })
  .validator(
    (input: {
      email: string;
      audience_type: string;
      marketing_opt_in: boolean;
      terms_acknowledged: boolean;
      source: string;
      source_detail?: string;
      metadata?: Record<string, any>;
      user_id?: string | null;
      pref_language?: string;
      pref_interests?: string[];
    }) =>
      z
        .object({
          email: z.string().email(),
          audience_type: z.enum(["customer", "restaurant", "caterer", "planner", "guest"]),
          marketing_opt_in: z.boolean(),
          terms_acknowledged: z.boolean(),
          source: z.string(),
          source_detail: z.string().optional(),
          metadata: z.record(z.any()).optional(),
          user_id: z.string().uuid().optional().nullable(),
          pref_language: z.string().optional(),
          pref_interests: z.array(z.string()).optional(),
        })
        .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Fetch existing
    const { data: existing } = await supabaseAdmin
      .from("user_consents")
      .select("id, double_opt_in_confirmed, pref_interests")
      .eq("email", data.email)
      .maybeSingle();

    let double_opt_in_token: string | undefined = undefined;
    let token_expires_at: string | undefined = undefined;
    const shouldSendEmail =
      data.marketing_opt_in && (!existing || !existing.double_opt_in_confirmed);

    if (shouldSendEmail) {
      const crypto = await import("crypto");
      double_opt_in_token = crypto.randomUUID();
      token_expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    }

    // Deduplicate interests
    const mergedInterests = Array.from(
      new Set([...(existing?.pref_interests || []), ...(data.pref_interests || [])]),
    );

    const payload: any = {
      email: data.email,
      audience_type: data.audience_type,
      user_id: data.user_id || null,
      marketing_opt_in: data.marketing_opt_in,
      terms_acknowledged: data.terms_acknowledged,
      source_detail: data.source_detail,
      pref_interests: mergedInterests,
    };

    if (data.pref_language) {
      payload.pref_language = data.pref_language;
    }

    if (shouldSendEmail) {
      payload.double_opt_in_token = double_opt_in_token;
      payload.token_expires_at = token_expires_at;
    }

    // Upsert the main consent record
    const { data: consentRecord, error: consentError } = await supabaseAdmin
      .from("user_consents")
      .upsert(payload, { onConflict: "email" } as any)
      .select("id")
      .single();

    if (consentError || !consentRecord) {
      console.error("[Consent Error] Failed to upsert user_consents:", consentError);
      throw new Error("Failed to record consent.");
    }

    // Insert an audit log for operational terms
    if (data.terms_acknowledged) {
      await supabaseAdmin.from("consent_logs").insert({
        consent_id: (consentRecord as any).id,
        email: data.email,
        action_type: "acknowledged_terms",
        source: data.source,
        source_detail: data.source_detail,
        metadata: data.metadata || {},
      } as any);
    }

    // Insert an audit log for marketing opt-in
    if (data.marketing_opt_in) {
      await supabaseAdmin.from("consent_logs").insert({
        consent_id: (consentRecord as any).id,
        email: data.email,
        action_type: "granted_marketing",
        source: data.source,
        source_detail: data.source_detail,
        metadata: data.metadata || {},
      } as any);
    }

    // Handle Double Opt-In Email
    if (shouldSendEmail && double_opt_in_token) {
      await supabaseAdmin.from("consent_logs").insert({
        consent_id: (consentRecord as any).id,
        email: data.email,
        action_type: "double_opt_in_sent",
        source: data.source,
        source_detail: data.source_detail,
        metadata: { token_generated: true },
      } as any);

      const { sendDoubleOptInEmail } = await import("@/lib/email.functions");
      sendDoubleOptInEmail({ data: { email: data.email, token: double_opt_in_token } }).catch(
        (err) => {
          console.error("Failed to trigger double opt in email:", err);
        },
      );
    }

    return { success: true };
  });

export const verifyOptInToken = createServerFn({ method: "POST" })
  .validator((input: { email: string; token: string }) =>
    z.object({ email: z.string().email(), token: z.string() }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: consentRecord, error: consentError } = await supabaseAdmin
      .from("user_consents")
      .select("id, double_opt_in_token, token_expires_at, double_opt_in_confirmed")
      .eq("email", data.email)
      .single();

    if (consentError || !consentRecord) {
      return { status: "invalid" as const, message: "Invalid verification link." };
    }

    if ((consentRecord as any).double_opt_in_confirmed) {
      return { status: "already_verified" as const, message: "Email is already verified." };
    }

    if ((consentRecord as any).double_opt_in_token !== data.token) {
      return { status: "invalid" as const, message: "Invalid verification link." };
    }

    if (
      (consentRecord as any).token_expires_at &&
      new Date((consentRecord as any).token_expires_at).getTime() < Date.now()
    ) {
      return { status: "expired" as const, message: "This verification link has expired." };
    }

    // Valid, so update
    const { error: updateError } = await supabaseAdmin
      .from("user_consents")
      .update({
        double_opt_in_confirmed: true,
        double_opt_in_token: null,
        token_expires_at: null,
      } as any)
      .eq("id", (consentRecord as any).id);

    if (updateError) {
      console.error("[Verify Error] Failed to update user_consents:", updateError);
      throw new Error("Failed to verify email.");
    }

    // Insert log
    await supabaseAdmin.from("consent_logs").insert({
      consent_id: (consentRecord as any).id,
      email: data.email,
      action_type: "double_opt_in_verified",
      source: "email_link",
    } as any);

    return { status: "success" as const, message: "Email verified successfully." };
  });

export const getMyConsent = createServerFn({ method: "GET" }).handler(async ({ context }) => {
  const { supabase, userId } = context as any;
  if (!userId) return { marketing_opt_in: false, email: "" };

  const { data, error } = await supabase
    .from("user_consents")
    .select("marketing_opt_in, email")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("[Consent Query Error]:", error.message);
    return { marketing_opt_in: false, email: "" };
  }
  return data || { marketing_opt_in: false, email: "" };
});

export const updateMyConsent = createServerFn({ method: "POST" })
  .validator((input: { marketing_opt_in: boolean; source?: string }) =>
    z
      .object({
        marketing_opt_in: z.boolean(),
        source: z.string().optional(),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context as any;
    if (!userId) throw new Error("Unauthorized");

    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();
    if (userErr || !user) throw new Error("Could not load user profile");

    const email = user.email || "";
    const source = data.source || "dashboard_settings";

    const { error } = await supabase.from("user_consents").upsert(
      {
        user_id: userId,
        email: email,
        audience_type: "customer",
        marketing_opt_in: data.marketing_opt_in,
        terms_acknowledged: true,
      },
      { onConflict: "email" },
    );

    if (error) throw new Error(error.message);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: record } = await supabaseAdmin
      .from("user_consents")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (record) {
      await supabaseAdmin.from("consent_logs").insert({
        consent_id: (record as any).id,
        email: email,
        action_type: data.marketing_opt_in ? "granted_marketing" : "revoked_marketing",
        source: source,
      } as any);
    }

    return { success: true };
  });
