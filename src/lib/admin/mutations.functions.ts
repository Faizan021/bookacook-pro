/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/lib/auth/role-middleware";
import { verifyDraftContent } from "./verification.server";

// Helper to verify admin role
async function verifyAdmin(supabaseAdmin: any, userId: string) {
  const { data: roleRecord, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin" as string)
    .maybeSingle();

  if (error || !roleRecord) {
    throw new Error("Unauthorized: Administrator access required");
  }
}

export const updateUserRole = createServerFn({ method: "POST" })
  .validator((d: { targetUserId: string; newRole: string }) => d)
  .middleware([requireSupabaseAuth()])
  .handler(async ({ context, data: { targetUserId, newRole } }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    await verifyAdmin(supabaseAdmin, userId);

    // 1. Update profiles.role
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({ role: newRole })
      .eq("id", targetUserId);

    if (profileError) throw new Error("Failed to update profile role: " + profileError.message);

    // 2. Sync user_roles table
    // Delete existing roles
    const { error: deleteRolesError } = await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", targetUserId);

    if (deleteRolesError)
      throw new Error("Failed to clean old user roles: " + deleteRolesError.message);

    // Only insert if it is a valid app_role enum
    const validAppRoles = ["customer", "restaurant_owner", "caterer", "planner", "admin"];
    if (validAppRoles.includes(newRole)) {
      const { error: insertRoleError } = await supabaseAdmin.from("user_roles").insert({
        user_id: targetUserId,
        role: newRole as "customer" | "restaurant_owner" | "caterer" | "planner" | "admin",
      });
      if (insertRoleError)
        throw new Error("Failed to insert new role mapping: " + insertRoleError.message);
    }

    return { success: true };
  });

export const toggleListingPublish = createServerFn({ method: "POST" })
  .validator((d: { listingType: string; listingId: string; isPublished: boolean }) => d)
  .middleware([requireSupabaseAuth()])
  .handler(async ({ context, data: { listingType, listingId, isPublished } }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    await verifyAdmin(supabaseAdmin, userId);

    if (listingType === "restaurant") {
      const { error } = await supabaseAdmin
        .from("restaurants")
        .update({ is_published: isPublished })
        .eq("id", listingId);

      if (error) throw new Error("Failed to toggle restaurant publish state: " + error.message);
    } else if (listingType === "caterer") {
      // For caterers, publishing status is in storefront_settings
      const { error } = await supabaseAdmin
        .from("storefront_settings")
        .update({ is_active: isPublished })
        .eq("caterer_id", listingId);

      if (error) throw new Error("Failed to toggle caterer publish state: " + error.message);
    }

    return { success: true };
  });

export const updateListingApproval = createServerFn({ method: "POST" })
  .validator(
    (d: {
      listingType: "restaurant" | "caterer" | "planner";
      listingId: string;
      status: "pending" | "approved" | "rejected" | "suspended";
      rejectionReason?: string;
    }) => d,
  )
  .middleware([requireSupabaseAuth()])
  .handler(async ({ context, data: { listingType, listingId, status, rejectionReason } }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    await verifyAdmin(supabaseAdmin, userId);

    const tableMap = {
      restaurant: "restaurants",
      caterer: "caterers",
      planner: "planners",
    };
    const table = tableMap[listingType];
    if (!table) throw new Error("Invalid listing type");

    // Fetch current status
    const { data: current, error: fetchErr } = await supabaseAdmin
      .from(table as any)
      .select("approval_status")
      .eq("id", listingId)
      .single();

    if (fetchErr || !current) throw new Error(`Listing not found: ${fetchErr?.message || ""}`);

    const oldStatus = (current as any).approval_status || "pending";
    const newStatus = status;

    // Validate state transitions
    // Allowed transitions:
    // - pending -> approved | rejected
    // - rejected -> approved | pending (usually partner resubmits, but admin can toggle back)
    // - approved -> suspended | rejected
    // - suspended -> approved | rejected
    let allowed = false;
    if (oldStatus === newStatus) {
      allowed = true;
    } else if (oldStatus === "pending" && (newStatus === "approved" || newStatus === "rejected")) {
      allowed = true;
    } else if (oldStatus === "rejected" && (newStatus === "approved" || newStatus === "pending")) {
      allowed = true;
    } else if (
      oldStatus === "approved" &&
      (newStatus === "suspended" || newStatus === "rejected")
    ) {
      allowed = true;
    } else if (
      oldStatus === "suspended" &&
      (newStatus === "approved" || newStatus === "rejected")
    ) {
      allowed = true;
    }

    if (!allowed) {
      throw new Error(`Invalid status transition: ${oldStatus} -> ${newStatus}`);
    }

    // Update with metadata
    const updateObj: any = {
      approval_status: newStatus,
      rejection_reason: newStatus === "rejected" ? rejectionReason || null : null,
      reviewed_at: new Date().toISOString(),
      reviewed_by: userId,
    };

    const { error: updateErr } = await supabaseAdmin
      .from(table as any)
      .update(updateObj)
      .eq("id", listingId);

    if (updateErr) throw new Error(`Failed to update approval status: ${updateErr.message}`);

    // Audit Logging
    console.log(
      `[Audit Log] [Partner Approval] Status changed for ${listingType} (id: ${listingId}) by admin ${userId}: ${oldStatus} -> ${newStatus}. Rejection reason: ${rejectionReason || "None"}`,
    );

    return { success: true };
  });

// SEO Content Pipeline
export const saveSeoDraft = createServerFn({ method: "POST" })
  .validator(
    (d: {
      type: string;
      target_keyword: string;
      title: string;
      slug: string;
      meta_title: string;
      meta_description: string;
      content: string;
      cta_text: string;
      internal_links: string[];
    }) => d,
  )
  .middleware([requireSupabaseAuth()])
  .handler(async ({ context, data }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    await verifyAdmin(supabaseAdmin, userId);

    const { error } = await supabaseAdmin.from("seo_content_pages").insert({
      ...data,
      status: "draft",
      last_edited_by: userId,
    });

    if (error) throw new Error("Failed to save SEO draft: " + error.message);
    return { success: true };
  });

export const updateSeoStatus = createServerFn({ method: "POST" })
  .validator(
    (d: {
      id: string;
      status: "draft" | "in_review" | "approved" | "published" | "rejected" | "archived";
    }) => d,
  )
  .middleware([requireSupabaseAuth()])
  .handler(async ({ context, data: { id, status } }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    await verifyAdmin(supabaseAdmin, userId);

    const updateData: any = { status, last_edited_by: userId };
    if (status === "published") {
      // 1. Fetch current content to verify
      const { data: currentDraft } = await supabaseAdmin
        .from("seo_content_pages")
        .select("content")
        .eq("id", id)
        .single();

      if (currentDraft?.content) {
        const verification = verifyDraftContent(currentDraft.content);
        if (!verification.isValid) {
          const reasons = verification.flaggedPhrases.map((f) => `'${f.phrase}'`).join(", ");
          throw new Error(
            `Verification Failed: Draft contains unsupported claims: ${reasons}. Please edit the content.`,
          );
        }
      }

      updateData.published_at = new Date().toISOString();
    }

    const { error } = await supabaseAdmin.from("seo_content_pages").update(updateData).eq("id", id);

    if (error) throw new Error(`Failed to update SEO status to ${status}: ` + error.message);
    return { success: true };
  });

export const updateSeoContent = createServerFn({ method: "POST" })
  .validator(
    (d: {
      id: string;
      title: string;
      slug: string;
      meta_title: string;
      meta_description: string;
      content: string;
    }) => d,
  )
  .middleware([requireSupabaseAuth()])
  .handler(async ({ context, data }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    await verifyAdmin(supabaseAdmin, userId);

    const { error } = await supabaseAdmin
      .from("seo_content_pages")
      .update({
        title: data.title,
        slug: data.slug,
        meta_title: data.meta_title,
        meta_description: data.meta_description,
        content: data.content,
        last_edited_by: userId,
      })
      .eq("id", data.id);

    if (error) throw new Error("Failed to update SEO content: " + error.message);
    return { success: true };
  });

export const markSitemapIndexed = createServerFn({ method: "POST" })
  .validator((d: { id: string; indexed: boolean }) => d)
  .middleware([requireSupabaseAuth()])
  .handler(async ({ context, data: { id, indexed } }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    await verifyAdmin(supabaseAdmin, userId);

    const { error } = await supabaseAdmin
      .from("seo_content_pages")
      .update({ sitemap_indexed: indexed })
      .eq("id", id);

    if (error) throw new Error("Failed to update sitemap indexed status: " + error.message);
    return { success: true };
  });

export const auditAllSeoContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth()])
  .handler(async ({ context }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    await verifyAdmin(supabaseAdmin, userId);

    // 1. Fetch all records
    const { data: allContent, error: fetchError } = await supabaseAdmin
      .from("seo_content_pages")
      .select("id, title, status, content");

    if (fetchError) throw new Error("Failed to fetch seo content for audit: " + fetchError.message);

    const demotedRecords: Array<{
      id: string;
      title: string;
      previousStatus: string;
      reasons: string;
    }> = [];

    // 2. Audit each record
    for (const record of allContent || []) {
      if (record.content) {
        const verification = verifyDraftContent(record.content);
        if (!verification.isValid) {
          const reasons = verification.flaggedPhrases.map((f) => `'${f.phrase}'`).join(", ");

          // Demote the record
          const { error: updateError } = await supabaseAdmin
            .from("seo_content_pages")
            .update({ status: "in_review", last_edited_by: userId })
            .eq("id", record.id);

          if (updateError) {
            console.error(`Failed to demote record ${record.id}: `, updateError);
          } else {
            demotedRecords.push({
              id: record.id,
              title: record.title || "Unknown",
              previousStatus: record.status || "Unknown",
              reasons,
            });
          }
        }
      }
    }

    return { success: true, totalAudited: allContent?.length || 0, demotedRecords };
  });

// ─────────────────────────────────────────────────────────────────────────────
// Monetization Controls
// ─────────────────────────────────────────────────────────────────────────────

type ListingType = "restaurant" | "caterer" | "planner";

const TABLE_MAP: Record<ListingType, string> = {
  restaurant: "restaurants",
  caterer: "caterers",
  planner: "planners",
};

/** Write one audit log row per changed field. */
async function writeAuditRows(
  supabaseAdmin: any,
  actorId: string,
  listingType: ListingType,
  listingId: string,
  changes: Array<{
    field: string;
    oldValue: string | null;
    newValue: string | null;
    reason?: string;
  }>,
) {
  if (!changes.length) return;
  const rows = changes.map((c) => ({
    actor_id: actorId,
    role: listingType,
    listing_id: listingId,
    field: c.field,
    old_value: c.oldValue,
    new_value: c.newValue,
    reason: c.reason ?? null,
  }));
  await supabaseAdmin.from("admin_audit_log").insert(rows);
}

/** Resolve featured slot limit using three-tier precedence:
 *  1. Exact event-type row
 *  2. City-wide '__city__' row
 *  3. Default 3
 */
async function resolveFeaturedSlotLimit(
  supabaseAdmin: any,
  listingType: ListingType,
  citySlug: string,
  eventType: string | null,
): Promise<number> {
  // Try exact event-type match first
  if (eventType) {
    const { data: exact } = await (supabaseAdmin as any)
      .from("featured_slot_limits")
      .select("max_slots")
      .eq("role", listingType)
      .eq("city_slug", citySlug)
      .eq("event_type", eventType)
      .maybeSingle();
    if (exact) return exact.max_slots;
  }
  // Fall back to city-wide row
  const { data: cityWide } = await (supabaseAdmin as any)
    .from("featured_slot_limits")
    .select("max_slots")
    .eq("role", listingType)
    .eq("city_slug", citySlug)
    .eq("event_type", "__city__")
    .maybeSingle();
  return cityWide?.max_slots ?? 3;
}

export const updateListingVisibility = createServerFn({ method: "POST" })
  .validator(
    (d: {
      listingType: ListingType;
      listingId: string;
      fields: {
        is_featured?: boolean;
        is_sponsored?: boolean;
        indexability_override?: "index" | "noindex" | "default";
        campaign_window_start?: string | null;
        campaign_window_end?: string | null;
        seasonal_boost_tags?: string[];
      };
      reason?: string;
    }) => d,
  )
  .middleware([requireSupabaseAuth()])
  .handler(async ({ context, data }) => {
    const { userId } = context;
    const { listingType, listingId, fields, reason } = data;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    await verifyAdmin(supabaseAdmin, userId);

    const table = TABLE_MAP[listingType];

    // Fetch current state for validation + audit diff
    const { data: current, error: fetchErr } = await (supabaseAdmin as any)
      .from(table)
      .select(
        "is_featured, is_sponsored, indexability_override, ranking_boost, campaign_window_start, campaign_window_end, seasonal_boost_tags, is_published, city",
      )
      .eq("id", listingId)
      .single();

    const typedCurrent = current as {
      is_featured: boolean;
      is_sponsored: boolean;
      is_published: boolean;
      city: string | null;
      campaign_window_start: string | null;
      campaign_window_end: string | null;
      [key: string]: unknown;
    } | null;

    if (fetchErr || !typedCurrent) throw new Error(`Listing not found: ${fetchErr?.message ?? ""}`);

    // Rule: is_featured=true requires is_published=true
    if (fields.is_featured === true && !typedCurrent.is_published) {
      throw new Error("Cannot feature an unpublished listing. Publish the listing first.");
    }

    // Rule: is_featured=true requires slot availability
    if (fields.is_featured === true && !typedCurrent.is_featured) {
      const citySlug = (typedCurrent.city ?? "").toLowerCase().replace(/\s+/g, "-");
      const maxSlots = await resolveFeaturedSlotLimit(supabaseAdmin, listingType, citySlug, null);
      const { count } = await (supabaseAdmin as any)
        .from(table)
        .select("id", { count: "exact", head: true })
        .eq("is_featured", true)
        .neq("id", listingId);
      if ((count ?? 0) >= maxSlots) {
        throw new Error(
          `Featured slot limit reached for ${citySlug} (${count}/${maxSlots}). Free a slot or raise the limit.`,
        );
      }
    }

    // Rule: is_sponsored=true with no campaign window requires a reason
    if (
      fields.is_sponsored === true &&
      !fields.campaign_window_start &&
      !fields.campaign_window_end &&
      !typedCurrent.campaign_window_start &&
      !typedCurrent.campaign_window_end
    ) {
      if (!reason?.trim()) {
        throw new Error("Sponsored without a campaign window requires an explicit reason.");
      }
    }

    // Normalize seasonal_boost_tags
    const normalizedTags = fields.seasonal_boost_tags
      ?.map((t) => t.trim().toLowerCase())
      .filter(Boolean)
      .filter((t, i, arr) => arr.indexOf(t) === i) // deduplicate
      .slice(0, 20);

    const updatePayload: Record<string, unknown> = {};
    const auditChanges: Array<{
      field: string;
      oldValue: string | null;
      newValue: string | null;
      reason?: string;
    }> = [];

    const trackField = (field: string, newVal: unknown) => {
      const oldRaw = typedCurrent![field];
      const oldStr =
        oldRaw == null ? null : String(Array.isArray(oldRaw) ? JSON.stringify(oldRaw) : oldRaw);
      const newStr =
        newVal == null ? null : String(Array.isArray(newVal) ? JSON.stringify(newVal) : newVal);
      if (oldStr !== newStr) {
        updatePayload[field] = newVal;
        auditChanges.push({ field, oldValue: oldStr, newValue: newStr, reason });
      }
    };

    if (fields.is_featured !== undefined) trackField("is_featured", fields.is_featured);
    if (fields.is_sponsored !== undefined) trackField("is_sponsored", fields.is_sponsored);
    if (fields.indexability_override !== undefined)
      trackField("indexability_override", fields.indexability_override);
    if (fields.campaign_window_start !== undefined)
      trackField("campaign_window_start", fields.campaign_window_start);
    if (fields.campaign_window_end !== undefined)
      trackField("campaign_window_end", fields.campaign_window_end);
    if (normalizedTags !== undefined) trackField("seasonal_boost_tags", normalizedTags);

    if (Object.keys(updatePayload).length === 0) return { success: true, changed: [] };

    const { error: updateErr } = await (supabaseAdmin as any)
      .from(table)
      .update(updatePayload)
      .eq("id", listingId);
    if (updateErr) throw new Error(`Failed to update listing visibility: ${updateErr.message}`);

    await writeAuditRows(supabaseAdmin, userId, listingType, listingId, auditChanges);

    return { success: true, changed: auditChanges.map((c) => c.field) };
  });

export const updateRankingBoost = createServerFn({ method: "POST" })
  .validator(
    (d: { listingType: ListingType; listingId: string; ranking_boost: number; reason: string }) =>
      d,
  )
  .middleware([requireSupabaseAuth()])
  .handler(async ({ context, data }) => {
    const { userId } = context;
    const { listingType, listingId, ranking_boost, reason } = data;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    await verifyAdmin(supabaseAdmin, userId);

    if (!reason?.trim()) {
      throw new Error("A non-empty reason is required to apply a ranking boost override.");
    }

    const table = TABLE_MAP[listingType];

    // Fetch current for audit diff
    const { data: current } = await (supabaseAdmin as any)
      .from(table)
      .select("ranking_boost")
      .eq("id", listingId)
      .single();

    const { error } = await (supabaseAdmin as any)
      .from(table)
      .update({ ranking_boost })
      .eq("id", listingId);

    // DB constraint enforces 0.8–1.5; surface the error clearly if violated
    if (error) {
      throw new Error(
        error.message.includes("ranking_boost")
          ? `ranking_boost must be between 0.8 and 1.5. Received: ${ranking_boost}`
          : `Failed to update ranking boost: ${error.message}`,
      );
    }

    await writeAuditRows(supabaseAdmin, userId, listingType, listingId, [
      {
        field: "ranking_boost",
        oldValue: String(current?.ranking_boost ?? 1.0),
        newValue: String(ranking_boost),
        reason,
      },
    ]);

    return { success: true };
  });

export const upsertFeaturedSlotLimit = createServerFn({ method: "POST" })
  .validator(
    (d: { role: ListingType; city_slug: string; event_type?: string; max_slots: number }) => d,
  )
  .middleware([requireSupabaseAuth()])
  .handler(async ({ context, data }) => {
    const { userId } = context;
    const { role, city_slug, event_type, max_slots } = data;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    await verifyAdmin(supabaseAdmin, userId);

    const resolvedEventType = event_type?.trim() || "__city__";

    const { error } = await (supabaseAdmin as any)
      .from("featured_slot_limits")
      .upsert(
        { role, city_slug, event_type: resolvedEventType, max_slots },
        { onConflict: "role,city_slug,event_type" },
      );

    if (error) throw new Error(`Failed to upsert featured slot limit: ${error.message}`);

    // Audit log — use a sentinel listing_id for governance records
    await (supabaseAdmin as any).from("admin_audit_log").insert({
      actor_id: userId,
      role,
      listing_id: "00000000-0000-0000-0000-000000000000",
      field: "featured_slot_limit",
      old_value: null,
      new_value: JSON.stringify({ role, city_slug, event_type: resolvedEventType, max_slots }),
      reason: "Admin upsert",
    });

    return { success: true };
  });
