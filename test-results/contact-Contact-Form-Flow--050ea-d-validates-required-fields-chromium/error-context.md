# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: contact.spec.ts >> Contact Form Flow >> Contact form loads and validates required fields
- Location: tests\e2e\contact.spec.ts:4:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /Kontakt|Contact/i }).first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: /Kontakt|Contact/i }).first()
    - waiting for" http://127.0.0.1:5173/contact" navigation to finish...

```

```yaml
- banner:
    - link "Speisely":
        - /url: /
        - img
        - text: Speisely
    - navigation:
        - link "Essen sofort bestellen":
            - /url: /instant-order
        - link "Catering":
            - /url: /catering
        - link "Event Planner":
            - /url: /planner
        - link "Für Partner":
            - /url: /partners
        - link "Über uns":
            - /url: /about
        - link "Kontakt":
            - /url: /contact
        - link "Blog":
            - /url: /blog
    - group "Language":
        - button "DE"
        - button "EN"
    - link "Anmelden":
        - /url: /auth
    - link "Registrieren":
        - /url: /auth?signup=partner
- main:
    - heading "Lassen Sie uns reden" [level=1]
    - paragraph: Haben Sie Fragen zu unseren Partnerprogrammen für Restaurants, Caterer oder Event-Planer? Schreiben Sie uns eine Nachricht.
    - text: Betreff / Grund
    - combobox "Betreff / Grund":
        - option "Bitte wählen..." [selected]
        - option "Speisely beitreten (Restaurants, Caterer, Planer)"
        - option "Support oder Beschwerde"
        - option "Partnerschaft oder Promotion"
    - text: Name
    - textbox "Name":
        - /placeholder: Ihr Name
    - text: E-Mail Adresse
    - textbox "E-Mail Adresse":
        - /placeholder: ihre@email.de
    - text: Unternehmen (optional)
    - textbox "Unternehmen (optional)":
        - /placeholder: Ihr Unternehmen
    - text: Telefonnummer (optional)
    - textbox "Telefonnummer (optional)":
        - /placeholder: +49 123 456789
    - text: Ihre Nachricht
    - textbox "Ihre Nachricht":
        - /placeholder: Wie können wir Ihnen helfen?
    - button "Nachricht senden"
- contentinfo:
    - img
    - text: Speisely
    - paragraph: Ein Marktplatz für spontane Restaurantbestellungen, kuratierte Catering-Momente und professionelle Event-Planung. Made in Deutschland.
    - heading "Entdecken" [level=4]
    - list:
        - listitem:
            - link "Essen sofort bestellen":
                - /url: /instant-order
        - listitem:
            - link "Catering":
                - /url: /catering
        - listitem:
            - link "Event-Planer":
                - /url: /planner
        - listitem:
            - link "FAQ":
                - /url: /faq
        - listitem:
            - link "Blog":
                - /url: /blog
    - heading "Business" [level=4]
    - list:
        - listitem:
            - link "Für Partner":
                - /url: /partners
        - listitem:
            - link "Was ist Speisely?":
                - /url: /speisely
        - listitem:
            - link "Über uns":
                - /url: /about
        - listitem:
            - link "Success Stories":
                - /url: /
        - listitem:
            - link "Careers":
                - /url: /
        - listitem:
            - link "Contact / Help":
                - /url: /
    - link "LinkedIn":
        - /url: https://www.linkedin.com/company/speisely
    - link "Instagram":
        - /url: https://instagram.com
    - link "Facebook":
        - /url: https://facebook.com
        - img
    - heading "Rechtliches" [level=4]
    - list:
        - listitem:
            - link "Kontakt":
                - /url: /contact
        - listitem:
            - link "Impressum":
                - /url: /impressum
        - listitem:
            - link "Datenschutz":
                - /url: /impressum
        - listitem:
            - link "AGB":
                - /url: /impressum
    - heading "Stay updated" [level=5]
    - textbox "Email address":
        - /placeholder: your@email.com
    - button "Subscribe"
    - text: © 2026 Speisely Berlin · Hamburg · München
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  |
  3  | test.describe('Contact Form Flow', () => {
  4  |   test('Contact form loads and validates required fields', async ({ page }) => {
  5  |     // Assuming there is a /contact route or a contact form in the footer/modal
  6  |     // Since /contact is a standard route, let's test its presence
  7  |     await page.goto('/contact');
  8  |
  9  |     // Verify the page loaded
> 10 |     await expect(page.getByRole('heading', { name: /Kontakt|Contact/i }).first()).toBeVisible();
     |                                                                                   ^ Error: expect(locator).toBeVisible() failed
  11 |
  12 |     // Find the submit button
  13 |     const submitButton = page.getByRole('button', { name: /Senden|Send/i });
  14 |
  15 |     if (await submitButton.isVisible()) {
  16 |       // Trigger validation
  17 |       await submitButton.click();
  18 |
  19 |       // Expect some form of validation message (e.g. "Required" or HTML5 validation)
  20 |       // Playwright will fail if the button doesn't exist, which is a good baseline test.
  21 |     }
  22 |   });
  23 | });
  24 |
```
