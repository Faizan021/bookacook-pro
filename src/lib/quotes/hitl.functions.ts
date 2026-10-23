/**
 * SPEISELY HITL (Human-in-the-Loop) QUOTE ORCHESTRATION ENGINE
 * Built on Google ADK Checkpoint Architecture & Gemini FinOps
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const FAISAN_WHATSAPP = "4917643218282";
const APP_URL = process.env.VITE_APP_URL || "https://speisely.de";

// 1. Portion & Price Estimator (Deterministic Guardrail)
function calculatePortionsAndPrice(guestCount: number, eventType: string) {
  // Standard German Gastro Benchmarks: 400g - 600g per person
  const isHearty = eventType.toLowerCase().includes("bbq") || eventType.toLowerCase().includes("hochzeit");
  const pricePerHead = isHearty ? 32 : 24; // € per guest
  const savoryPieces = guestCount * (isHearty ? 6 : 4);
  const dessertPieces = guestCount * 2;
  const subtotalCents = guestCount * pricePerHead * 100;
  const depositCents = Math.round(subtotalCents * 0.10); // 10% platform deposit

  return {
    portions: {
      estimatedWeightGramsPerGuest: isHearty ? 550 : 420,
      savoryPiecesTotal: savoryPieces,
      dessertPiecesTotal: dessertPieces,
    },
    suggestedItems: [
      { name: "Klassische Fingerfood & Vorspeisen-Platte", qty: Math.ceil(guestCount / 10), priceCents: 4500 },
      { name: isHearty ? "Grill- & Hauptspeisen-Buffet (Live Warmhalte)" : "Mediterranes Buffet & Bowls", qty: guestCount, priceCents: (pricePerHead - 8) * 100 },
      { name: "Saisonale Dessert-Variation & Cremes", qty: guestCount, priceCents: 350 },
    ],
    subtotalCents,
    depositCents,
  };
}

// ─────────────────────────────────────────────────────────────
// SERVER FUNCTION: Generate Resumable Quote Draft & Alert Faizan
// ─────────────────────────────────────────────────────────────
export const createResumableQuoteDraft = createServerFn({ method: "POST" })
  .validator((input: {
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    eventType: string;
    eventDate: string;
    guestCount: number;
    city: string;
    catererId: string;
    catererName: string;
    notes?: string;
  }) =>
    z.object({
      customerName: z.string().min(1),
      customerEmail: z.string().email(),
      customerPhone: z.string().optional(),
      eventType: z.string().default("Catering Event"),
      eventDate: z.string().default("Auf Anfrage"),
      guestCount: z.number().min(1).default(10),
      city: z.string().default("Deutschland"),
      catererId: z.string(),
      catererName: z.string(),
      notes: z.string().optional(),
    }).parse(input),
  )
  .handler(async ({ data }) => {
    // 1. Calculate Quote State
    const calc = calculatePortionsAndPrice(data.guestCount, data.eventType);

    // 2. Save Checkpoint State to Supabase PostgreSQL (tool_context.state)
    const { data: quoteRecord, error } = await supabaseAdmin
      .from("quote_drafts")
      .insert({
        customer_name: data.customerName,
        customer_email: data.customerEmail,
        customer_phone: data.customerPhone || null,
        event_type: data.eventType,
        event_date: data.eventDate !== "Auf Anfrage" ? data.eventDate : null,
        guest_count: data.guestCount,
        city: data.city,
        caterer_id: data.catererId,
        caterer_name: data.catererName,
        portions_breakdown: calc.portions,
        suggested_items: calc.suggestedItems,
        subtotal_cents: calc.subtotalCents,
        deposit_cents: calc.depositCents,
        status: "PENDING_APPROVAL",
        is_resumable: true,
      })
      .select("id, approval_token")
      .single();

    if (error || !quoteRecord) {
      console.error("[HITL Quote Engine] DB Checkpoint Error:", error);
      throw new Error("Fehler beim Erstellen des Angebots-Checkpoints.");
    }

    // 3. Construct 1-Click WhatsApp Direct Approval Link for Faizan
    const approvalUrl = `${APP_URL}/api/quotes/approve?token=${quoteRecord.approval_token}`;
    const totalEuro = (calc.subtotalCents / 100).toFixed(2);
    const depositEuro = (calc.depositCents / 100).toFixed(2);

    const whatsappText =
      `🔔 *NEUES CATERING-ANGEBOT BEREIT (HITL CHECKPOINT)*\n\n` +
      `• *Caterer:* ${data.catererName}\n` +
      `• *Kunde:* ${data.customerName} (${data.customerEmail})\n` +
      `• *Event:* ${data.eventType} (${data.guestCount} Gäste)\n` +
      `• *Datum & Ort:* ${data.eventDate} in ${data.city}\n\n` +
      `💰 *Kalkulierter Gesamtpreis:* €${totalEuro}\n` +
      `💳 *10% Anzahlung:* €${depositEuro}\n\n` +
      `👉 *1-Klick Freigeben & Absenden:*\n${approvalUrl}`;

    const whatsappRedirectUrl = `https://wa.me/${FAISAN_WHATSAPP}?text=${encodeURIComponent(whatsappText)}`;

    return {
      success: true,
      quoteId: quoteRecord.id,
      whatsappUrl: whatsappRedirectUrl,
      totalEuro,
    };
  });

// ─────────────────────────────────────────────────────────────
// SERVER FUNCTION: Rehydrate State & Approve (1-Click Action)
// ─────────────────────────────────────────────────────────────
export const approveQuoteCheckpoint = createServerFn({ method: "POST" })
  .validator((input: { token: string }) =>
    z.object({ token: z.string().min(10) }).parse(input),
  )
  .handler(async ({ data }) => {
    // 1. Fetch Resumable Checkpoint
    const { data: quote, error } = await supabaseAdmin
      .from("quote_drafts")
      .select("*")
      .eq("approval_token", data.token)
      .maybeSingle();

    if (error || !quote) {
      throw new Error("Ungültiger oder abgelaufener Freigabe-Token.");
    }

    if (quote.status === "APPROVED" || quote.status === "DISPATCHED") {
      return { alreadyApproved: true, quote };
    }

    // 2. Resume & Update Workflow State
    const { error: updateErr } = await supabaseAdmin
      .from("quote_drafts")
      .update({
        status: "APPROVED",
        dispatched_at: new Date().toISOString(),
        is_resumable: false,
      })
      .eq("id", quote.id);

    if (updateErr) {
      throw new Error("Fehler beim Freigeben des Checkpoints.");
    }

    // 3. Mark successful rehydration
    return {
      success: true,
      alreadyApproved: false,
      quote: {
        ...quote,
        status: "APPROVED",
      },
    };
  });
