/**
 * Global Feature Flags for Speisely Platform.
 *
 * Speisely is currently an early-stage public preview.
 * We are not accepting orders, payments, paid registrations, promo-code redemptions,
 * or commercial contracts.
 *
 * COMMERCIAL_TRANSACTIONS_ENABLED:
 * Server-side enforcement is authoritative across all checkout, deposit,
 * subscription, and promo paths.
 */
export const COMMERCIAL_TRANSACTIONS_ENABLED = false;
export const PROMO_CODES_ENABLED = false;
