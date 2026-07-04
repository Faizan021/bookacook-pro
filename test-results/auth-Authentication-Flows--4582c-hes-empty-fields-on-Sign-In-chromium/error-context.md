# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Authentication Flows >> Form validation catches empty fields on Sign In
- Location: tests\e2e\auth.spec.ts:28:3

# Error details

```
Error: locator.click: Error: strict mode violation: getByRole('button', { name: /Anmelden|Sign in/i }) resolved to 2 elements:
    1) <button type="submit" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow hover:bg-primary/90 h-9 px-4 py-2 w-full bg-[#b28a3c] hover:opacity-90 text-[#16372f] font-semibold">Anmelden</button> aka getByRole('button', { name: 'Anmelden', exact: true })
    2) <button type="button" class="whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-background shadow-sm hover:text-accent-foreground h-9 px-4 py-2 w-full flex items-center justify-center gap-2 border-[#eadfce] text-forest hover:bg-forest/5">…</button> aka getByRole('button', { name: 'Mit Google anmelden' })

Call log:
  - waiting for getByRole('button', { name: /Anmelden|Sign in/i })
    - waiting for" http://127.0.0.1:5173/auth" navigation to finish...
    - navigated to "http://127.0.0.1:5173/auth"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - link "← Speisely" [ref=e5] [cursor=pointer]:
        - /url: /
      - group "Language" [ref=e6]:
        - button "DE" [ref=e7]
        - button "EN" [ref=e8]
    - heading "Willkommen zurück" [level=1] [ref=e9]
    - paragraph [ref=e10]: Melde dich in deinem Dashboard an.
    - generic [ref=e11]:
      - generic [ref=e12]:
        - generic [ref=e13]: E-Mail *
        - textbox "E-Mail *" [ref=e14]
      - generic [ref=e15]:
        - generic [ref=e16]: Passwort *
        - generic [ref=e17]:
          - textbox "Passwort *" [ref=e18]
          - button [ref=e19]:
            - img [ref=e20]
      - button "Passwort vergessen?" [ref=e24]
      - button "Anmelden" [ref=e25] [cursor=pointer]
    - generic [ref=e30]: Oder
    - button "Mit Google anmelden" [ref=e31] [cursor=pointer]:
      - img
      - text: Mit Google anmelden
    - button "Neu bei Speisely? Konto erstellen" [ref=e32]
  - generic [ref=e34]:
    - generic [ref=e35]:
      - text: We use cookies to improve our website and provide you with a better experience.
      - link "Privacy Policy" [ref=e36] [cursor=pointer]:
        - /url: /privacy-policy
    - generic [ref=e37]:
      - button "Customize" [ref=e38] [cursor=pointer]
      - button "Accept all" [ref=e39] [cursor=pointer]
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
  9  |     await expect(page.getByRole('heading', { name: /Willkommen zurück|Welcome back/i })).toBeVisible();
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
> 32 |     await page.getByRole('button', { name: /Anmelden|Sign in/i }).click();
     |                                                                   ^ Error: locator.click: Error: strict mode violation: getByRole('button', { name: /Anmelden|Sign in/i }) resolved to 2 elements:
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