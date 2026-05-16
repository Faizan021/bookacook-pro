/**
 * Centralized Commission Service
 * 
 * Standardizes platform fee calculations across the application.
 * Default commission: 10%
 */

export const PLATFORM_COMMISSION_RATE = 0.10;

export type CommissionResult = {
  grossAmount: number;
  commissionAmount: number;
  netAmount: number;
};

/**
 * Calculates the platform commission and net amount for a given gross total.
 * @param grossAmount The total amount paid by the customer
 * @returns CommissionResult containing gross, commission, and net amounts
 */
export function calculateCommission(grossAmount: number): CommissionResult {
  const commissionAmount = Number((grossAmount * PLATFORM_COMMISSION_RATE).toFixed(2));
  const netAmount = Number((grossAmount - commissionAmount).toFixed(2));

  return {
    grossAmount,
    commissionAmount,
    netAmount
  };
}

/**
 * Formats a currency amount for display.
 */
export function formatCurrency(amount: number, locale = "de-DE"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}
