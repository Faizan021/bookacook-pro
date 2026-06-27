/**
 * Session Timeout Configuration
 * 
 * Note on ABSOLUTE_MAX_SESSION_HOURS:
 * We use `user.last_sign_in_at` to track absolute session lifetime.
 * CAVEAT: `last_sign_in_at` is a user-level timestamp, not a per-device or per-session timestamp.
 * This means logging in on another device can extend the effective absolute limit on an already 
 * logged-in device.
 * 
 * Future note: If we later need strict per-device absolute session lifetime, device-specific 
 * revocation, or stronger admin security, we will replace this with a dedicated server-validated 
 * per-session start mechanism (such as a secure HTTP-only cookie or device session record).
 */

export const SESSION_CONFIG = {
  // Idle Timeouts
  WARNING_THRESHOLD_MS: 25 * 60 * 1000, // 25 minutes
  LOGOUT_THRESHOLD_MS: 30 * 60 * 1000,  // 30 minutes
  
  // Absolute Lifetime
  ABSOLUTE_MAX_SESSION_HOURS: 12,
  
  // LocalStorage Key for cross-tab idle sync
  STORAGE_KEY: "speisely_last_activity",
};
