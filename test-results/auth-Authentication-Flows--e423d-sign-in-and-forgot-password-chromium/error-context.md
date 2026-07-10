# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Authentication Flows >> User can switch between sign up, sign in, and forgot password
- Location: tests\e2e\auth.spec.ts:4:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /Willkommen zurück|Welcome back/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: /Willkommen zurück|Welcome back/i })
    - waiting for" http://127.0.0.1:5173/auth" navigation to finish...

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  |
  3  | test.describe('Authentication Flows', () => {
  4  |   test('User can switch between sign up, sign in, and forgot password', async ({ page }) => {
  5  |     // 1. Navigate to auth page
  6  |     await page.goto('/auth');
  7  |
  8  |     // Default should be sign in
> 9  |     await expect(page.getByRole('heading', { name: /Willkommen zurück|Welcome back/i })).toBeVisible();
     |                                                                                          ^ Error: expect(locator).toBeVisible() failed
  10 |
  11 |     // 2. Switch to Sign Up
  12 |     await page.getByRole('button', { name: /Neu bei Speisely|New to Speisely/i }).click();
  13 |     await expect(page.getByRole('heading', { name: /Konto erstellen|Create an account/i })).toBeVisible();
  14 |
  15 |     // 3. Switch back to Sign In
  16 |     await page.getByRole('button', { name: /Du hast bereits ein Konto|Already have an account/i }).click();
  17 |     await expect(page.getByRole('heading', { name: /Willkommen zurück|Welcome back/i })).toBeVisible();
  18 |
  19 |     // 4. Switch to Forgot Password
  20 |     await page.getByRole('button', { name: /Passwort vergessen\?|Forgot Password\?/i }).click();
  21 |     await expect(page.getByRole('heading', { name: /Passwort zurücksetzen|Reset Password/i })).toBeVisible();
  22 |
  23 |     // 5. Check if back button works from forgot password
  24 |     await page.getByRole('button', { name: /Zurück|Back/i }).click();
  25 |     await expect(page.getByRole('heading', { name: /Willkommen zurück|Welcome back/i })).toBeVisible();
  26 |   });
  27 |
  28 |   test('Form validation catches empty fields on Sign In', async ({ page }) => {
  29 |     await page.goto('/auth');
  30 |
  31 |     // Click submit without entering data
  32 |     await page.getByRole('button', { name: /Anmelden|Sign in/i }).click();
  33 |
  34 |     // Expect error messages to appear for required fields
  35 |     await expect(page.locator('text=/Gültige E-Mail|Valid email/i')).toBeVisible();
  36 |     await expect(page.locator('text=/Passwort erforderlich|Password required/i')).toBeVisible();
  37 |   });
  38 |
  39 |   test('Form validation catches bad passwords on Sign Up', async ({ page }) => {
  40 |     await page.goto('/auth?signup=true');
  41 |
  42 |     // Fill out bad password
  43 |     await page.getByLabel(/Passwort \*/).first().fill('weak');
  44 |     await page.getByRole('button', { name: /Konto erstellen|Create account/i }).click();
  45 |
  46 |     // Expect Zod schema error
  47 |     await expect(page.locator('text=/mindestens 8 Zeichen|at least 8 characters/i').first()).toBeVisible();
  48 |   });
  49 | });
  50 |
```
