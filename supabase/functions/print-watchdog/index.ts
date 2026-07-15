// =============================================================================
// Supabase Edge Function: print-watchdog
//
// Purpose: Detect offline printers and expire stale print jobs.
//
// Scheduling: Deploy as a pg_cron job running every 30 seconds.
//   SELECT cron.schedule(
//     'print-watchdog',
//     '30 seconds',
//     $$SELECT net.http_post(
//       url := current_setting('app.supabase_functions_url') || '/print-watchdog',
//       headers := '{"Authorization": "Bearer ' || current_setting('app.service_role_key') || '"}'::jsonb
//     )$$
//   );
//
// Alternatively, invoke via Supabase Dashboard → Edge Functions → Schedules.
//
// Scope: Restaurant product ONLY.
//   - Reads restaurant_printers and restaurant_print_jobs
//   - Notifies via the existing realtime channel used by KDS
//   - Never references catering_bookings or event_bookings
//
// Watchdog thresholds (from task.md Phase 1D):
//   - Printer offline: last_heartbeat_at < now() - (poll_interval_seconds * 6)
//     Rationale: 6 missed polls at any configured interval = definitively offline
//   - Stale job: status = 'pending' AND created_at < now() - interval '5 minutes'
//     Rationale: 60+ missed polls at default 5s = printer genuinely unreachable
// =============================================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PrinterRow {
  id: string;
  restaurant_id: string;
  mac_address: string;
  poll_interval_seconds: number;
  last_heartbeat_at: string | null;
  status: "online" | "offline";
}

interface PrintJobRow {
  id: string;
  order_id: string;
  restaurant_id: string;
  status: "pending" | "printed" | "failed";
  created_at: string;
  attempts: number;
}

interface WatchdogResult {
  printers_marked_offline: string[];
  jobs_marked_failed: string[];
  errors: string[];
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

Deno.serve(async (_req: Request): Promise<Response> => {
  const result: WatchdogResult = {
    printers_marked_offline: [],
    jobs_marked_failed: [],
    errors: [],
  };

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    const msg = "[Watchdog] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY";
    console.error(msg);
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const now = new Date();

  // -------------------------------------------------------------------------
  // 1. Mark printers offline
  //
  // Each printer configures its own poll_interval_seconds (default: 5).
  // Offline threshold = 6 × poll_interval_seconds.
  // We cannot express a per-row interval in a single UPDATE WHERE clause,
  // so we fetch candidates and filter in application code.
  //
  // Candidate window: any printer that has not heartbeated in the last 10
  // minutes (generous upper bound). We then apply the per-row threshold.
  // -------------------------------------------------------------------------
  const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000).toISOString();

  const { data: stalePrinters, error: printerFetchErr } = await supabase
    .from("restaurant_printers")
    .select("id, restaurant_id, mac_address, poll_interval_seconds, last_heartbeat_at, status")
    .eq("status", "online")
    .or(`last_heartbeat_at.lt.${tenMinutesAgo},last_heartbeat_at.is.null`);

  if (printerFetchErr) {
    const msg = `[Watchdog] Failed to fetch stale printers: ${printerFetchErr.message}`;
    console.error(msg);
    result.errors.push(msg);
  } else if (stalePrinters && stalePrinters.length > 0) {
    const offlinePrinterIds: string[] = [];

    for (const printer of stalePrinters as PrinterRow[]) {
      // Per-row offline threshold in milliseconds
      const offlineThresholdMs = printer.poll_interval_seconds * 6 * 1000;
      const cutoff = new Date(now.getTime() - offlineThresholdMs);

      const isOffline =
        printer.last_heartbeat_at === null ||
        new Date(printer.last_heartbeat_at) < cutoff;

      if (isOffline) {
        offlinePrinterIds.push(printer.id);
        console.log(
          `[Watchdog] Printer ${printer.mac_address} (restaurant=${printer.restaurant_id}) ` +
            `offline: last heartbeat=${printer.last_heartbeat_at ?? "never"}, ` +
            `threshold=${printer.poll_interval_seconds * 6}s`,
        );
      }
    }

    if (offlinePrinterIds.length > 0) {
      const { error: offlineUpdateErr } = await supabase
        .from("restaurant_printers")
        .update({ status: "offline" })
        .in("id", offlinePrinterIds);

      if (offlineUpdateErr) {
        const msg = `[Watchdog] Failed to mark printers offline: ${offlineUpdateErr.message}`;
        console.error(msg);
        result.errors.push(msg);
      } else {
        result.printers_marked_offline = offlinePrinterIds;
      }
    }
  }

  // -------------------------------------------------------------------------
  // 2. Expire stale print jobs
  //
  // A job is stale if it has been pending for > 5 minutes.
  // 5 minutes = 60+ missed polls at the default 5s interval.
  // At this point the printer is definitively unreachable.
  // -------------------------------------------------------------------------
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000).toISOString();

  const { data: staleJobs, error: jobFetchErr } = await supabase
    .from("restaurant_print_jobs")
    .select("id, order_id, restaurant_id, created_at, attempts")
    .eq("status", "pending")
    .lt("created_at", fiveMinutesAgo);

  if (jobFetchErr) {
    const msg = `[Watchdog] Failed to fetch stale jobs: ${jobFetchErr.message}`;
    console.error(msg);
    result.errors.push(msg);
  } else if (staleJobs && staleJobs.length > 0) {
    const staleJobIds = (staleJobs as PrintJobRow[]).map((j) => j.id);

    const { error: jobUpdateErr } = await supabase
      .from("restaurant_print_jobs")
      .update({
        status: "failed",
        error_log: "watchdog_timeout: no printer heartbeat within 5 minutes",
      })
      .in("id", staleJobIds)
      // Safety: only fail jobs that are still pending
      // (another process could have printed in the window between fetch and update)
      .eq("status", "pending");

    if (jobUpdateErr) {
      const msg = `[Watchdog] Failed to expire stale jobs: ${jobUpdateErr.message}`;
      console.error(msg);
      result.errors.push(msg);
    } else {
      result.jobs_marked_failed = staleJobIds;

      for (const job of staleJobs as PrintJobRow[]) {
        console.log(
          `[Watchdog] Job ${job.id} (order=${job.order_id}, restaurant=${job.restaurant_id}) ` +
            `expired after ${Math.round((now.getTime() - new Date(job.created_at).getTime()) / 1000)}s`,
        );
      }
    }
  }

  // -------------------------------------------------------------------------
  // 3. Emit realtime notifications for affected restaurants
  //
  // Uses the Supabase Broadcast channel. KDS dashboard subscribes to
  // channel="kitchen:{restaurant_id}" and flashes a red alert on failure events.
  //
  // We send one notification per affected restaurant, not one per job/printer,
  // to avoid flooding the channel.
  // -------------------------------------------------------------------------
  const affectedRestaurantIds = new Set<string>();

  // Collect from failed jobs
  if (staleJobs) {
    for (const job of staleJobs as PrintJobRow[]) {
      affectedRestaurantIds.add(job.restaurant_id);
    }
  }

  // Collect from offline printers (re-derive from stalePrinters list)
  if (stalePrinters && result.printers_marked_offline.length > 0) {
    const offlineSet = new Set(result.printers_marked_offline);
    for (const printer of stalePrinters as PrinterRow[]) {
      if (offlineSet.has(printer.id)) {
        affectedRestaurantIds.add(printer.restaurant_id);
      }
    }
  }

  for (const restaurantId of affectedRestaurantIds) {
    const failedJobsForRestaurant = staleJobs
      ? (staleJobs as PrintJobRow[]).filter((j) => j.restaurant_id === restaurantId)
      : [];

    const printerOffline = stalePrinters
      ? (stalePrinters as PrinterRow[]).some(
          (p) => p.restaurant_id === restaurantId && result.printers_marked_offline.includes(p.id),
        )
      : false;

    // Broadcast to kitchen channel for this restaurant
    const channel = supabase.channel(`kitchen:${restaurantId}`);
    await channel.send({
      type: "broadcast",
      event: "print_alert",
      payload: {
        restaurant_id: restaurantId,
        printer_offline: printerOffline,
        failed_job_count: failedJobsForRestaurant.length,
        failed_job_ids: failedJobsForRestaurant.map((j) => j.id),
        timestamp: now.toISOString(),
      },
    });
    await supabase.removeChannel(channel);

    console.log(
      `[Watchdog] Notified kitchen channel for restaurant ${restaurantId}: ` +
        `printer_offline=${printerOffline}, failed_jobs=${failedJobsForRestaurant.length}`,
    );
  }

  // -------------------------------------------------------------------------
  // 4. Summary log
  // -------------------------------------------------------------------------
  console.log(
    `[Watchdog] Complete. ` +
      `Printers marked offline: ${result.printers_marked_offline.length}. ` +
      `Jobs expired: ${result.jobs_marked_failed.length}. ` +
      `Errors: ${result.errors.length}.`,
  );

  const status = result.errors.length > 0 ? 207 : 200;
  return new Response(JSON.stringify(result), {
    status,
    headers: { "Content-Type": "application/json" },
  });
});
