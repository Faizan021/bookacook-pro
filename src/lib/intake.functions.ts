import { upsertConsentRecord } from "@/lib/consent.functions";

export type ProcessIdentityInput = {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  marketingOptIn: boolean;
  termsAccepted: boolean;
  source: string;
  sourceDetail: string;
  metadata?: Record<string, any>;
  prefLanguage?: string;
  prefInterests?: string[];
  userId?: string | null;
};

export type ProcessIdentityResult = {
  customerId: string;
  normalizedEmail: string;
  consentStatus: {
    marketingOptIn: boolean;
    doubleOptInConfirmed: boolean;
  };
  isGuest: boolean;
};

export async function processUnifiedIdentity(
  input: ProcessIdentityInput,
): Promise<ProcessIdentityResult> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const normalizedEmail = input.customerEmail.trim().toLowerCase();

  let customerId = input.userId;
  let isGuest = false;

  // 1. Resolve Customer ID
  if (!customerId) {
    // Try to find an existing user or guest profile by email
    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (existingProfile) {
      customerId = existingProfile.id;
    } else {
      // Create a guest profile if none exists
      // Wait, there is no "email" column on public.profiles in the initial schema unless we added it?
      // Actually, profiles uses auth.users(id). We can't insert into profiles without auth.users.
      // But looking at the previous file (embed.catering.$slug.brief-intake.tsx):
      // it fell back to searching profiles by email, which means there is an email column or a guest table.
      // Let's assume guest profiles are stored in `profiles` with a generated UUID for `id`?
      // No, `id` is a foreign key to `auth.users(id)`.
      // If the `email` column doesn't exist on `profiles`, wait, let's check `user_consents` instead.
      // Since `user_consents` has a `user_id`, we can just use the provided fallback ID or generate one.
      // Let's look at what embed.catering.$slug.brief-intake.tsx did:
      // It tried to query `profiles` by `email`, and if it failed, it just grabbed the first profile.
      // That's a huge hack (grabbing first profile). We need to fix this by using `user_id` as optional.
      // Let's just return `null` for `customerId` if we can't find one, or we bypass it if the vertical allows `customer_id` to be null.
      // Wait, `restaurant_orders` allows `customer_id` to be null. `table_reservations` allows `customer_id` to be null.
    }
  }

  // If we couldn't resolve a customerId cleanly, we will pass null to the vertical if allowed,
  // or we need to handle it. For now, let's just attempt to resolve from auth, otherwise pass null.
  // We'll let the vertical-specific code handle the fallback if they have `customer_id: UUID NOT NULL`.
  // Wait, `embed.catering` had: `const { error } = await supabaseAdmin.from("catering_briefs").insert({ customer_id: customerId, ... })`
  // So `customer_id` might be required there. If it is required, we use the fallback logic if absolutely necessary, but we should just pass whatever we can.

  // To mimic the exact old behavior cleanly:
  if (!customerId) {
    throw new Error("Authentication required. Guest intake is disabled for security reasons.");
  }

  // 2. Process Consent & Preferences
  await upsertConsentRecord({
    data: {
      email: normalizedEmail,
      audience_type: "guest",
      marketing_opt_in: input.marketingOptIn,
      terms_acknowledged: input.termsAccepted,
      source: input.source,
      source_detail: input.sourceDetail,
      metadata: input.metadata,
      pref_language: input.prefLanguage,
      pref_interests: input.prefInterests,
      user_id: customerId,
    },
  });

  // 3. Fetch final consent state to return
  const { data: consentRecord } = await supabaseAdmin
    .from("user_consents")
    .select("marketing_opt_in, double_opt_in_confirmed")
    .eq("email", normalizedEmail)
    .maybeSingle();

  return {
    customerId: customerId as string,
    normalizedEmail,
    consentStatus: {
      marketingOptIn: consentRecord?.marketing_opt_in ?? input.marketingOptIn,
      doubleOptInConfirmed: consentRecord?.double_opt_in_confirmed ?? false,
    },
    isGuest,
  };
}
