/**
 * Restaurant Order Notification & WhatsApp Dispatch Engine
 *
 * Dispatches structured order alerts to the restaurant manager's phone:
 * - Generates human-readable, WhatsApp-formatted order tickets
 * - Provides 1-Click 80mm Thermal Receipt Print URLs (?auto=true)
 * - Supports automated outbound webhooks (e.g. Twilio / Whapi / UltraMsg)
 * - Fallbacks gracefully to transactional email
 */

import { sendPartnerNotificationEmail } from "@/lib/email.functions";

export interface OrderNotificationPayload {
  orderId: string;
  restaurantId: string;
  restaurantName: string;
  restaurantPhone?: string | null;
  customerName: string;
  customerPhone: string;
  orderType: "pickup" | "delivery" | "dine_in";
  deliveryAddress?: string | null;
  paymentMethod: "cash" | "paypal" | "stripe";
  totalCents: number;
  deliveryFeeCents?: number;
  items: Array<{
    name: string;
    quantity: number;
    price_cents: number;
    line_total_cents: number;
  }>;
  notes?: string | null;
  origin: string;
}

/**
 * Builds an optimized, high-readability WhatsApp ticket for the restaurant manager.
 */
export function buildWhatsAppOrderMessage(payload: OrderNotificationPayload): string {
  const shortId = payload.orderId.slice(0, 8).toUpperCase();
  const time = new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });

  const orderTypeLabel =
    payload.orderType === "delivery"
      ? "🚗 LIEFERUNG"
      : payload.orderType === "pickup"
        ? "🛍️ ABHOLUNG"
        : "🍽️ VOR ORT";

  const paymentLabel =
    payload.paymentMethod === "cash"
      ? "💶 Barzahlung / EC an Haustür"
      : payload.paymentMethod === "paypal"
        ? "🅿️ PayPal (Direkt an Restaurant)"
        : "💳 Kreditkarte (Stripe)";

  const itemsList = payload.items
    .map((item) => {
      const price = `€${(item.line_total_cents / 100).toFixed(2)}`;
      return `• ${item.quantity}x ${item.name} (${price})`;
    })
    .join("\n");

  const totalStr = `€${(payload.totalCents / 100).toFixed(2)}`;
  const printUrl = `${payload.origin}/receipt/${payload.orderId}?auto=true`;

  return (
    `🔔 NEUE BESTELLUNG #${shortId} — SPEISELY (${time})\n` +
    `────────────────────────────────────\n` +
    `Restaurant: ${payload.restaurantName}\n` +
    `Kunde: ${payload.customerName}\n` +
    `Telefon: ${payload.customerPhone}\n` +
    `Typ: ${orderTypeLabel}\n` +
    (payload.deliveryAddress ? `Adresse: ${payload.deliveryAddress}\n` : "") +
    (payload.notes ? `Hinweis: ${payload.notes}\n` : "") +
    `\nBESTELLUNG:\n` +
    `${itemsList}\n` +
    `\nGESAMTBETRAG: ${totalStr}\n` +
    `ZAHLUNG: ${paymentLabel}\n` +
    `────────────────────────────────────\n` +
    `🖨️ 1-KLICK-BONDRUCK (80mm):\n` +
    `${printUrl}\n` +
    `────────────────────────────────────\n` +
    `Status: Bitte jetzt zubereiten!`
  );
}

/**
 * Dispatches notifications across WhatsApp gateway & backup email.
 */
export async function dispatchOrderNotifications(
  payload: OrderNotificationPayload,
  ownerEmail?: string | null,
): Promise<{ success: boolean; whatsappSent: boolean; message: string }> {
  const message = buildWhatsAppOrderMessage(payload);
  let whatsappSent = false;

  // 1. WhatsApp Dispatch via Webhook if configured
  const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL;
  if (webhookUrl && payload.restaurantPhone) {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: payload.restaurantPhone,
          message: message,
          orderId: payload.orderId,
          restaurant: payload.restaurantName,
        }),
      });
      whatsappSent = res.ok;
      if (!res.ok) {
        console.warn(`[WhatsApp Dispatch] Webhook returned status ${res.status}`);
      }
    } catch (err: any) {
      console.error("[WhatsApp Dispatch] Webhook error:", err.message);
    }
  } else {
    // Log formatted message to server console for auditing and dev inspection
    console.log(
      `[WhatsApp Dispatch Ready] To: ${payload.restaurantPhone || "NO_PHONE_SET"}\n${message}`,
    );
  }

  // 2. Transactional Email Backup
  if (ownerEmail) {
    const totalStr = `€${(payload.totalCents / 100).toFixed(2)}`;
    const printUrl = `${payload.origin}/receipt/${payload.orderId}?auto=true`;

    await sendPartnerNotificationEmail({
      data: {
        to: ownerEmail,
        subject: `Neue Bestellung (${payload.paymentMethod}) von ${payload.customerName}`,
        text: message,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; rounded: 12px;">
            <h2 style="color: #0c3823; margin-top: 0;">Neue Speisely Bestellung!</h2>
            <p>Hallo ${payload.restaurantName},</p>
            <p>Sie haben eine neue Bestellung über <strong>${totalStr}</strong> erhalten.</p>
            <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
              <tr><td style="padding: 6px 0; color: #6b7280;">Kunde:</td><td><strong>${payload.customerName}</strong> (${payload.customerPhone})</td></tr>
              <tr><td style="padding: 6px 0; color: #6b7280;">Typ:</td><td><strong>${payload.orderType}</strong></td></tr>
              ${payload.deliveryAddress ? `<tr><td style="padding: 6px 0; color: #6b7280;">Adresse:</td><td><strong>${payload.deliveryAddress}</strong></td></tr>` : ""}
              <tr><td style="padding: 6px 0; color: #6b7280;">Zahlung:</td><td><strong>${payload.paymentMethod}</strong></td></tr>
            </table>
            <div style="margin: 24px 0;">
              <a href="${printUrl}" target="_blank" style="display: inline-block; background-color: #0c3823; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 9999px; font-weight: bold;">
                🖨️ 1-Klick-Beleg drucken (80mm)
              </a>
            </div>
            <p style="font-size: 12px; color: #9ca3af;">Speisely — 0% Provision für Gastronomen.</p>
          </div>
        `,
      },
    }).catch((err) => console.error("[Order Email] Failed to send email:", err));
  }

  return { success: true, whatsappSent, message };
}
