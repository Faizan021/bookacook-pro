import { describe, it, expect } from "vitest";
import { fallbackCaterers } from "../../src/data/caterers";

describe("VeeDo's Kitchen Storefront & Enquiry Tests", () => {
  it("verifies phone number is completely absent from VeeDo's Kitchen profile", () => {
    const veedo = fallbackCaterers.find((c) => c.slug === "veedos-kitchen");
    expect(veedo).toBeDefined();
    expect(veedo?.phone).toBe("");
    expect(JSON.stringify(veedo)).not.toContain("43218282");
    expect(JSON.stringify(veedo)).not.toContain("12345678");
  });

  it("verifies non-binding enquiry announcement and zero prices on sample dishes", () => {
    const veedo = fallbackCaterers.find((c) => c.slug === "veedos-kitchen")!;
    expect(veedo.announcement_text).toContain("Ihre Anfrage ist unverbindlich");
    veedo.menu.forEach((item) => {
      expect(item.price_cents).toBe(0);
    });
  });

  it('verifies getCaterer("veedos-kitchen") runtime resolution', async () => {
    const { getCaterer } = await import("../../src/data/caterers");
    const result = await getCaterer("veedos-kitchen");
    expect(result).toBeDefined();
    expect(result?.name).toBe("VeeDo's Kitchen");
    expect(result?.slug).toBe("veedos-kitchen");
    expect(result?.area).toBe("Region NRW");
    expect(result?.menu.length).toBe(7);
    expect(result?.isShowcase).toBe(true);
  });
});
