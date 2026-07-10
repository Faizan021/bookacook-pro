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
  .validator((d: {
    listingType: "restaurant" | "caterer" | "planner";
    listingId: string;
    status: "pending" | "approved" | "rejected" | "suspended";
    rejectionReason?: string;
  }) => d)
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
    } else if (oldStatus === "approved" && (newStatus === "suspended" || newStatus === "rejected")) {
      allowed = true;
    } else if (oldStatus === "suspended" && (newStatus === "approved" || newStatus === "rejected")) {
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
      `[Audit Log] [Partner Approval] Status changed for ${listingType} (id: ${listingId}) by admin ${userId}: ${oldStatus} -> ${newStatus}. Rejection reason: ${rejectionReason || "None"}`
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
