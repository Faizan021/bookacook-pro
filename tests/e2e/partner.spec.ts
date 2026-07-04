import { test, expect } from "@playwright/test";

test.describe("Partner Workspace Access", () => {
  test("Unauthenticated user is redirected to auth when accessing partner pages", async ({
    page,
  }) => {
    // Attempt to access a protected partner page directly
    await page.goto("/dashboard");

    // Should be redirected to the auth screen because of no session
    await expect(page).toHaveURL(/.*\/auth/);
    await expect(
      page.getByRole("heading", { name: /Willkommen zurück|Welcome back/i }),
    ).toBeVisible();
  });

  // Note: To test the actual workspace switcher, we would need to mock Supabase auth
  // or log in with a test seed user. For V1 lightweight testing, we focus on route protection.
});
