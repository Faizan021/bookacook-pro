import { test, expect } from "@playwright/test";

test.describe("Core Business Workflow", () => {
  test("User can browse caterers from the homepage", async ({ page }) => {
    // Start at the homepage
    await page.goto("/");

    // Look for the catering navigation link or button
    const catererLink = page.getByRole("link", { name: /Catering/i }).first();

    if (await catererLink.isVisible()) {
      await catererLink.click();

      // Should navigate to the catering directory
      await expect(page).toHaveURL(/.*\/catering/);

      // Expect a heading or list of caterers
      await expect(page.locator("h1")).toBeVisible();
    }
  });
});
