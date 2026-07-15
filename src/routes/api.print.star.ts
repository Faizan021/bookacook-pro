/**
 * /api/print/star — Star CloudPRNT Server Endpoint
 *
 * Implements the verified 3-step CloudPRNT poll-and-retrieve protocol:
 *
 *   Step 1  POST   Printer polls every N seconds.
 *                  Server responds with { jobReady: false } or { jobReady: true, jobToken, mediaTypes }.
 *                  Print data is NEVER returned in this response.
 *
 *   Step 2  GET    Printer GETs actual ESC/POS data using ?jobToken=<uuid>.
 *                  Must be idempotent — repeated GETs return the same data without advancing state.
 *
 *   Step 3  DELETE Printer confirms successful print. Server sets job to 'printed'.
 *           POST   Printer reports a hardware failure (non-zero statusCode). Server increments attempts.
 *
 * Scope guardrail: This file only queries restaurant_orders and restaurant_print_jobs.
 * It must never reference catering_bookings or event_bookings.
 *
 * Print failure rule: No error in this file must ever block or reverse a confirmed order.
 */

import { createFileRoute } from "@tanstack/react-router";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Format a restaurant order into a plain-text ESC/POS receipt string. */
function formatEscPosReceipt(order: {
  id: string;
  customer_name: string;
  order_type: string;
  items: Array<{ name: string; quantity: number; price_cents: number; line_total_cents: number }>;
  notes: string | null;
  delivery_address: string | null;
  total_cents: number;
  created_at: string;
}): string {
  const line = "--------------------------------";
  const shortId = order.id.slice(0, 8).toUpperCase();
  const time = new Date(order.created_at).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const orderTypeLabel =
    order.order_type === "pickup"
      ? "ABHOLUNG"
      : order.order_type === "dine_in"
        ? "VOR ORT"
        : "LIEFERUNG";

  const itemLines = order.items
    .map((item) => {
      const itemTotal = `€${(item.line_total_cents / 100).toFixed(2)}`;
      const name =
        item.quantity > 1 ? `${item.quantity}x ${item.name}` : item.name;
      // Pad name and price on the same line up to 32 chars
      const padLen = Math.max(0, 32 - name.length - itemTotal.length);
      return `${name}${" ".repeat(padLen)}${itemTotal}`;
    })
    .join("\n");

  const totalStr = `€${(order.total_cents / 100).toFixed(2)}`;

  let receipt = `\x1B\x40`; // ESC @ — initialize printer
  receipt += `\x1B\x61\x01`; // ESC a 1 — center alignment
  receipt += `\x1B\x21\x10`; // ESC ! — double height
  receipt += `SPEISELY\n`;
  receipt += `\x1B\x21\x00`; // reset font
  receipt += `${orderTypeLabel}\n`;
  receipt += `Bestellung #${shortId}  ${time}\n`;
  receipt += `${line}\n`;
  receipt += `\x1B\x61\x00`; // left align
  receipt += `Kunde: ${order.customer_name}\n`;
  if (order.order_type === "delivery" && order.delivery_address) {
    receipt += `Adresse: ${order.delivery_address}\n`;
  }
  receipt += `${line}\n`;
  receipt += `${itemLines}\n`;
  receipt += `${line}\n`;
  receipt += `\x1B\x61\x02`; // right align
  const totalPad = 32 - 8 - totalStr.length;
  receipt += `${" ".repeat(Math.max(0, totalPad))}GESAMT: ${totalStr}\n`;
  receipt += `\x1B\x61\x01`; // center
  if (order.notes) {
    receipt += `${line}\n`;
    receipt += `Hinweis: ${order.notes}\n`;
  }
  receipt += `${line}\n`;
  receipt += `\n\n\n`; // feed before cut
  receipt += `\x1D\x56\x42\x00`; // GS V B 0 — full cut
  return receipt;
}

// ---------------------------------------------------------------------------
// Route
// ---------------------------------------------------------------------------

export const Route = createFileRoute("/api/print/star")({
  server: {
    handlers: {
      // -----------------------------------------------------------------------
      // STEP 1 — POST: Printer heartbeat + job availability check
      // Printer sends: { printerMAC, statusCode, printingInProgress? }
      // Server responds: { jobReady: boolean, mediaTypes?, jobToken? }
      // -----------------------------------------------------------------------
      POST: async ({ request }) => {
        const { supabaseAdmin } = await import(
          "@/integrations/supabase/client.server"
        );

        let body: {
          printerMAC?: string;
          statusCode?: number;
          printingInProgress?: boolean;
        } = {};

        try {
          const contentType = request.headers.get("content-type") ?? "";
          if (contentType.includes("application/json")) {
            body = await request.json();
          } else {
            // CloudPRNT may send application/x-www-form-urlencoded
            const text = await request.text();
            const params = new URLSearchParams(text);
            body = {
              printerMAC: params.get("printerMAC") ?? undefined,
              statusCode: params.has("statusCode")
                ? Number(params.get("statusCode"))
                : undefined,
              printingInProgress: params.get("printingInProgress") === "true",
            };
          }
        } catch (parseErr) {
          console.error("[CloudPRNT POST] Failed to parse body:", parseErr);
          return new Response(JSON.stringify({ jobReady: false }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        const { printerMAC, statusCode, printingInProgress } = body;

        if (!printerMAC) {
          console.warn("[CloudPRNT POST] Missing printerMAC");
          return new Response(JSON.stringify({ jobReady: false }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        // 1. Look up printer and update heartbeat
        const { data: printer } = await (supabaseAdmin as any)
          .from("restaurant_printers")
          .update({
            last_heartbeat_at: new Date().toISOString(),
            status: "online",
          })
          .eq("mac_address", printerMAC)
          .select("id, restaurant_id, poll_interval_seconds")
          .maybeSingle();

        if (!printer) {
          console.warn(`[CloudPRNT POST] Unknown printer MAC: ${printerMAC}`);
          // Return jobReady: false — do not error, allows unconfigured printers to poll safely
          return new Response(JSON.stringify({ jobReady: false }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        // 2. If the printer is reporting a hardware error (non-zero statusCode),
        //    increment attempts on any pending job for this restaurant.
        //    Explicit check: undefined (not sent) and 0 (success) are both excluded.
        if (statusCode !== undefined && statusCode !== 0) {
          console.warn(
            `[CloudPRNT POST] Printer ${printerMAC} reported error statusCode=${statusCode}`,
          );
          const { data: failingJob } = await (supabaseAdmin as any)
            .from("restaurant_print_jobs")
            .select("id, attempts")
            .eq("restaurant_id", printer.restaurant_id)
            .eq("status", "pending")
            .order("created_at", { ascending: true })
            .limit(1)
            .maybeSingle();

          if (failingJob) {
            const newAttempts = (failingJob.attempts ?? 0) + 1;
            await (supabaseAdmin as any)
              .from("restaurant_print_jobs")
              .update({
                attempts: newAttempts,
                error_log: `statusCode=${statusCode}`,
                // Permanently fail after 3 hardware-reported errors on the same job
                ...(newAttempts >= 3 ? { status: "failed" } : {}),
              })
              .eq("id", failingJob.id);
          }

          return new Response(JSON.stringify({ jobReady: false }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        // 3. If the printer says it is currently printing, skip new job lookup
        if (printingInProgress === true) {
          return new Response(JSON.stringify({ jobReady: false }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        // 4. Find the oldest pending job for this restaurant
        const { data: job, error: updateErr } = await (supabaseAdmin as any)
          .from("restaurant_print_jobs")
          .select("id")
          .eq("restaurant_id", printer.restaurant_id)
          .eq("status", "pending")
          .order("created_at", { ascending: true })
          .limit(1)
          .maybeSingle();

        if (!job) {
          return new Response(JSON.stringify({ jobReady: false }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        // 5. Job found — tell the printer to GET it. Do NOT change status yet.
        console.log(
          `[CloudPRNT POST] Job ready for printer ${printerMAC}, jobToken=${job.id}`,
        );
        return new Response(
          JSON.stringify({
            jobReady: true,
            mediaTypes: ["application/vnd.star.starprnt"],
            jobToken: job.id,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      },

      // -----------------------------------------------------------------------
      // STEP 2 — GET: Printer fetches the actual ESC/POS print data
      // Query param: ?jobToken=<print_job_uuid>
      // Must be idempotent: repeated GETs return same data, status stays 'pending'
      // -----------------------------------------------------------------------
      GET: async ({ request }) => {
        const { supabaseAdmin } = await import(
          "@/integrations/supabase/client.server"
        );

        const url = new URL(request.url);
        const jobToken = url.searchParams.get("jobToken");

        if (!jobToken) {
          return new Response("Missing jobToken", { status: 400 });
        }

        // Fetch print job — serve data for ANY status, not just 'pending'.
        // Rationale: if the watchdog marked the job 'failed' while the printer was mid-transaction,
        // a subsequent GET retry must still receive data so the printer can complete and DELETE.
        const { data: job } = await (supabaseAdmin as any)
          .from("restaurant_print_jobs")
          .select("id, order_id, restaurant_id, status")
          .eq("id", jobToken)
          .maybeSingle();

        if (!job) {
          console.warn(`[CloudPRNT GET] Job not found: ${jobToken}`);
          return new Response("Job not found", { status: 404 });
        }

        // Fetch full order data for receipt formatting
        const { data: order } = await supabaseAdmin
          .from("restaurant_orders")
          .select(
            "id, customer_name, order_type, items, notes, delivery_address, total_cents, created_at",
          )
          .eq("id", job.order_id)
          .single();

        if (!order) {
          console.error(
            `[CloudPRNT GET] Order ${job.order_id} not found for job ${jobToken}`,
          );
          return new Response("Order not found", { status: 404 });
        }

        const escPosData = formatEscPosReceipt(order as any);

        console.log(
          `[CloudPRNT GET] Serving ESC/POS data for job ${jobToken}, order ${job.order_id} (status=${job.status})`,
        );

        // Return ESC/POS binary — idempotent, status remains unchanged until DELETE confirms
        return new Response(escPosData, {
          status: 200,
          headers: {
            "Content-Type": "application/vnd.star.starprnt",
            "Content-Length": String(Buffer.byteLength(escPosData, "binary")),
          },
        });
      },

      // -----------------------------------------------------------------------
      // STEP 3 — DELETE: Printer confirms successful print
      // Query param: ?jobToken=<print_job_uuid>
      // -----------------------------------------------------------------------
      DELETE: async ({ request }) => {
        const { supabaseAdmin } = await import(
          "@/integrations/supabase/client.server"
        );

        const url = new URL(request.url);
        const jobToken = url.searchParams.get("jobToken");

        if (!jobToken) {
          return new Response("Missing jobToken", { status: 400 });
        }

        const { error } = await (supabaseAdmin as any)
          .from("restaurant_print_jobs")
          .update({ status: "printed" })
          .eq("id", jobToken)
          // Only advance state forward — never re-print a job already confirmed
          .in("status", ["pending"]);

        if (error) {
          console.error(
            `[CloudPRNT DELETE] Failed to mark job ${jobToken} as printed:`,
            error.message,
          );
          // Still return 200 — do not cause the printer to loop on a deletion error
          return new Response("OK", { status: 200 });
        }

        console.log(`[CloudPRNT DELETE] Job ${jobToken} marked as printed`);
        return new Response("OK", { status: 200 });
      },
    },
  },
});
