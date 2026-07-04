import { test, expect } from "@playwright/test";

test.describe("Authentication Flows", () => {
  test("User can switch between sign up, sign in, and forgot password", async ({ page }) => {
    // 1. Navigate to auth page
    await page.goto("/auth");

    // Default should be sign in
    await expect(
      page.getByRole("heading", { name: /Willkommen zurück|Welcome back/i }),
    ).toBeVisible();

    // 2. Switch to Sign Up
    await page.getByRole("button", { name: /Neu bei Speisely|New to Speisely/i }).click();
    await expect(
      page.getByRole("heading", { name: /Konto erstellen|Create an account/i }),
    ).toBeVisible();

    // 3. Switch back to Sign In
    await page
      .getByRole("button", { name: /Du hast bereits ein Konto|Already have an account/i })
      .click();
    await expect(
      page.getByRole("heading", { name: /Willkommen zurück|Welcome back/i }),
    ).toBeVisible();

    // 4. Switch to Forgot Password
    await page.getByRole("button", { name: /Passwort vergessen\?|Forgot Password\?/i }).click();
    await expect(
      page.getByRole("heading", { name: /Passwort zurücksetzen|Reset Password/i }),
    ).toBeVisible();

    // 5. Check if back button works from forgot password
    await page.getByRole("button", { name: /Zurück|Back/i }).click();
    await expect(
      page.getByRole("heading", { name: /Willkommen zurück|Welcome back/i }),
    ).toBeVisible();
  });

  test("Form validation catches empty fields on Sign In", async ({ page }) => {
    await page.goto("/auth");

    // Click submit without entering data
    await page.getByRole("button", { name: "Anmelden", exact: true }).click();

    // Expect error messages to appear for required fields
    await expect(page.locator("text=/Gültige E-Mail|Valid email/i")).toBeVisible();
    await expect(page.locator("text=/Passwort erforderlich|Password required/i")).toBeVisible();
  });

  test("Form validation catches bad passwords on Sign Up", async ({ page }) => {
    await page.goto("/auth?signup=true");

    // Fill out bad password
    await page
      .getByLabel(/Passwort \*/)
      .first()
      .fill("weak");
    await page.getByRole("button", { name: /Konto erstellen|Create account/i }).click();

    // Expect Zod schema error
    await expect(
      page.locator("text=/mindestens 8 Zeichen|at least 8 characters/i").first(),
    ).toBeVisible();
  });
});
