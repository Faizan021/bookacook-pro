import { describe, it, expect } from "vitest";
import { PROMO_CODES_ENABLED, calculatePromoDiscount } from "@/lib/restaurant/public.functions";

describe("Speisely Promo Codes Engine & Financial Integrity", () => {
  it("enforces disabled state during pre-commercial phase", () => {
    expect(PROMO_CODES_ENABLED).toBe(false);
  });

  it("safely rejects discount calculation when promo codes are disabled", async () => {
    const mockSupabase = {};
    const result = await calculatePromoDiscount(
      mockSupabase,
      "owner-123",
      "SUMMER50",
      5000,
      [{ name: "Pizza", price_cents: 2500, quantity: 2 }],
      "restaurants",
    );

    expect(result.discountCents).toBe(0);
    expect(result.freeDelivery).toBe(false);
    expect(result.error).toContain("deaktiviert");
  });

  it("returns zero discount for null/empty promo codes", async () => {
    const mockSupabase = {};
    const result = await calculatePromoDiscount(
      mockSupabase,
      "owner-123",
      null,
      5000,
      [],
      "restaurants",
    );

    expect(result.discountCents).toBe(0);
    expect(result.freeDelivery).toBe(false);
    expect(result.error).toBeUndefined();
  });
});
