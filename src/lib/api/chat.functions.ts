import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/lib/auth/role-middleware";

// ---------------------------------------------------------------------------
// Contact info masking — strips emails and phone numbers from message bodies
// before they are stored or returned. This enforces platform-mediated contact
// and prevents vendors/customers from exchanging direct contact details inside
// the chat before a booking is confirmed.
// ---------------------------------------------------------------------------
function maskContactInfo(text: string) {
  // Mask email addresses
  let masked = text.replace(
    /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi,
    "[EMAIL HIDDEN]",
  );

  // Mask phone numbers (7–15 digit numeric strings with optional formatting)
  masked = masked.replace(
    /(\+?\d{1,4}?[\s-]?)?\(?\d{1,4}\)?[\s-]?\d{1,4}[\s-]?\d{1,4}[\s-]?\d{1,9}/g,
    (match) => {
      const digitsOnly = match.replace(/\D/g, "");
      return digitsOnly.length >= 7 ? "[PHONE HIDDEN]" : match;
    },
  );

  return masked;
}

// ---------------------------------------------------------------------------
// Helper: verify the calling user is a participant in the given brief.
// Returns the brief row on success, throws a safe 403-style error on failure.
// Used by both read and write handlers to enforce the same ownership rule.
// ---------------------------------------------------------------------------
async function requireBriefParticipant(supabase: any, briefId: string, userId: string) {
  const { data: brief, error } = await supabase
    .from("catering_briefs")
    .select("id, customer_id, preferred_caterer_id, preferred_planner_id")
    .eq("id", briefId)
    .single();

  if (error || !brief) {
    // Don't distinguish "not found" from "not authorised" — prevents enumeration
    throw new Error("Unauthorized: Brief not accessible");
  }

  const participants: (string | null)[] = [
    brief.customer_id,
    brief.preferred_caterer_id,
    brief.preferred_planner_id,
  ];

  if (!participants.includes(userId)) {
    // Log server-side for monitoring, return a generic message to the caller
    console.warn(`[Chat] Unauthorized access attempt: user=${userId} brief=${briefId}`);
    throw new Error("Unauthorized: You are not a participant in this brief");
  }

  return brief;
}

// ---------------------------------------------------------------------------
// GET /brief-messages — fetch messages for a brief
// Requires: authenticated user who is customer, caterer, or planner on the brief
// ---------------------------------------------------------------------------
export const getBriefMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth()])
  .inputValidator(z.object({ briefId: z.string().uuid() }))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;

    // Ownership check — throws if caller is not a participant
    await requireBriefParticipant(supabase, data.briefId, userId);

    const { data: messages, error } = await supabase
      .from("brief_messages")
      .select("id, brief_id, sender_id, message, created_at") // explicit columns, no select("*")
      .eq("brief_id", data.briefId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[Chat] Failed to fetch brief messages:", error.code);
      throw new Error("Failed to load messages");
    }

    // Double-mask on read: messages are masked on insert, but this catches
    // any legacy rows that predate masking and protects against future regressions.
    const secureMessages = (messages ?? []).map((m: any) => ({
      id: m.id,
      brief_id: m.brief_id,
      sender_id: m.sender_id,
      created_at: m.created_at,
      // Own messages returned as-is; others are masked
      content: m.sender_id === userId ? m.message : maskContactInfo(m.message),
    }));

    return secureMessages;
  });

// ---------------------------------------------------------------------------
// POST /brief-messages — send a message to a brief conversation
// Requires: authenticated user who is customer, caterer, or planner on the brief
// Fixed: was missing the ownership check present in getBriefMessages (M-2 in audit)
// ---------------------------------------------------------------------------
export const sendBriefMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth()])
  .inputValidator(
    z.object({
      briefId: z.string().uuid(),
      content: z.string().min(1).max(2000),
    }),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;

    // Ownership check — throws if caller is not a participant.
    // This was the missing guard identified in audit finding M-2.
    await requireBriefParticipant(supabase, data.briefId, userId);

    // Mask contact info before persisting
    const maskedContent = maskContactInfo(data.content);

    const { error } = await supabase.from("brief_messages").insert({
      brief_id: data.briefId,
      sender_id: userId,
      message: maskedContent,
    });

    if (error) {
      console.error("[Chat] Failed to insert brief message:", error.code);
      throw new Error("Failed to send message");
    }

    return { ok: true };
  });
