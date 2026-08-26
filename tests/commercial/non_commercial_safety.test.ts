import { describe, it, expect } from "vitest";
import { COMMERCIAL_TRANSACTIONS_ENABLED, PROMO_CODES_ENABLED } from "@/lib/config/flags";
import {
  createSubscriptionCheckoutSession,
  createDepositCheckoutSession,
  createStorefrontCheckoutSession,
  createBillingPortalSession,
} from "@/lib/stripe";
import { calculatePromoDiscount, validatePromoCode } from "@/lib/restaurant/public.functions";

describe("Speisely Non-Commercial Preview Safety Gate", () => {
  it("enforces COMMERCIAL_TRANSACTIONS_ENABLED === false at platform root", () => {
    expect(COMMERCIAL_TRANSACTIONS_ENABLED).toBe(false);
    expect(PROMO_CODES_ENABLED).toBe(false);
  });

  it("blocks createSubscriptionCheckoutSession directly on the server", async () => {
    await expect(
      createSubscriptionCheckoutSession(
        "rest-1",
        "Test Rest",
        "owner@example.com",
        "https://speisely.de",
      ),
    ).rejects.toThrow(/deaktiviert/i);
  });

  it("blocks createDepositCheckoutSession directly on the server", async () => {
    await expect(
      createDepositCheckoutSession(
        "booking-1",
        5000,
        "Test Caterer",
        "client@example.com",
        "https://speisely.de",
      ),
    ).rejects.toThrow(/deaktiviert/i);
  });

  it("blocks createStorefrontCheckoutSession directly on the server", async () => {
    await expect(
      createStorefrontCheckoutSession(
        "acct_123",
        2500,
        "Test Rest",
        "https://speisely.de/success",
        "https://speisely.de/cancel",
        "order-1",
      ),
    ).rejects.toThrow(/deaktiviert/i);
  });

  it("blocks createBillingPortalSession directly on the server", async () => {
    await expect(createBillingPortalSession("cus_123", "https://speisely.de")).rejects.toThrow(
      /deaktiviert/i,
    );
  });

  it("blocks promo code discount calculation and returns non-commercial message", async () => {
    const res = await calculatePromoDiscount(
      {},
      "owner-1",
      "PROMO100",
      5000,
      [{ name: "Dish", price_cents: 2500, quantity: 2 }],
      "restaurants",
    );
    expect(res.discountCents).toBe(0);
    expect(res.freeDelivery).toBe(false);
    expect(res.error).toMatch(/deaktiviert/i);
  });
});
