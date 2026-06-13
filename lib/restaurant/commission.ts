/**
 * Speisely Restaurant Commission Rate
 *
 * Restaurants are charged a 2% platform fee on every order.
 * Caterers use a separate 10% rate (see lib/storefront/ or platform config).
 *
 * This value is intentionally hardcoded per the Option B architecture.
 * When dynamic commission tiers are introduced, replace this constant
 * with a DB lookup keyed on the merchant type / tier.
 */
export const RESTAURANT_COMMISSION_RATE = 0.02;

/** Convenience helper – returns the platform fee for a given subtotal. */
export function calculateRestaurantPlatformFee(subtotal: number): number {
  return Math.round(subtotal * RESTAURANT_COMMISSION_RATE * 100) / 100;
}
