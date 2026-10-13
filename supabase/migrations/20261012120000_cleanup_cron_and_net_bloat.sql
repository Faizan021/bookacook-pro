-- =============================================================================
-- Migration: Reclaim Supabase Disk Space & Prevent pg_cron / pg_net Bloat
-- Root Cause:
--   20260715005000_schedule_print_watchdog.sql scheduled 'print-watchdog' every
--   1 minute ('* * * * *'), inserting ~1,440 rows/day into cron.job_run_details
--   and net._http_response without retention cleanup, exhausting the 8 GB disk.
-- =============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.unschedule(jobid) FROM cron.job WHERE jobname = 'print-watchdog';
    PERFORM cron.unschedule(jobid) FROM cron.job WHERE jobname = 'cleanup-cron-and-net-logs';

    TRUNCATE TABLE cron.job_run_details;

    PERFORM cron.schedule(
      'cleanup-cron-and-net-logs',
      '0 4 * * *',
      $cleanup$
        DELETE FROM cron.job_run_details WHERE end_time < now() - interval '24 hours';
        DELETE FROM net._http_response WHERE created < now() - interval '1 hour';
      $cleanup$
    );
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'net' AND table_name = '_http_response'
  ) THEN
    TRUNCATE TABLE net._http_response;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'net' AND table_name = 'http_request_queue'
  ) THEN
    TRUNCATE TABLE net.http_request_queue;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Disk bloat cleanup skipped: %', SQLERRM;
END $$;
