-- =============================================================================
-- Migration: Schedule print-watchdog edge function via pg_cron
--
-- SCHEDULE DECISION: This deployment runs the watchdog every 1 minute.
-- Newer pg_cron versions (1.4+) support second-level scheduling via the
-- '30 seconds' interval syntax. We use the standard '* * * * *' cron expression
-- here for maximum compatibility across Supabase-managed pg_cron versions.
-- If your project has pg_cron ≥ 1.4 and you need sub-minute watchdog frequency,
-- replace '* * * * *' with an interval string like '30 seconds'.
--
-- Rationale for 1-minute frequency in this deployment:
--   - At 5s default polling, 1-minute watchdog still detects 12 missed polls
--     before firing — well above the 6-poll offline threshold.
--   - The watchdog offline threshold is 6× poll_interval_seconds per printer,
--     evaluated in application code, not by cron timing.
--   - The 5-minute stale job threshold is unaffected by cron frequency.
-- =============================================================================

-- Enable pg_cron extension (safe if already enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net extension (required for HTTP calls from pg_cron)
CREATE EXTENSION IF NOT EXISTS pg_net;

-- ---------------------------------------------------------------------------
-- Schedule: run print-watchdog every minute
--
-- Replace the placeholder values with your actual Supabase project values:
--   <PROJECT_REF>     → your project ID (e.g. athwccvgdovglcpluwnu)
--   <SERVICE_ROLE_KEY> → from Supabase Dashboard → Settings → API
--
-- In production, store these in Vault secrets rather than plain SQL.
-- ---------------------------------------------------------------------------
SELECT cron.schedule(
  'print-watchdog',         -- job name (unique, used for cron.unschedule())
  '* * * * *',              -- every minute
  $$
    SELECT net.http_post(
      url     := 'https://athwccvgdovglcpluwnu.supabase.co/functions/v1/print-watchdog',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer ' || current_setting('app.service_role_key', true)
      ),
      body    := '{}'::jsonb
    );
  $$
);
