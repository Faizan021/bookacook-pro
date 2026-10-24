# PRD Update: Speisely Cash Cows & Creative Showcase on Homepage
*Date: 2026-10-24 | Document Path: `docs/plans/2026-10-24-homepage-cashcows-and-luxury-spec.md`*

---

## 1. Context & Business Strategy
Speisely is both a **B2C/B2B Culinary Marketplace** and a high-margin **B2B Cash Cow Engine**:
1. **Cash Cow #1: Webseiten-Erstellung für Caterer & Gastronomen (`/partner/webseiten`):**
   - High margin service: 0.5s PageSpeed 99+ mobile websites, interactive event calculators, and 0% commission direct ordering.
   - Solves the #1 problem of German caterers (outdated PDF menus and slow websites losing mobile inquiries).
2. **Cash Cow #2 & Cultural Anchor: Speisely Magazin (`/magazin`):**
   - Authoritative culinary editorial magazine (Seydioğlu, King Tut, Baba Pirzola, Mandy).
   - Generates high-trust B2B authority, viral social reach, and premium brand association.

---

## 2. Proposed Architecture for Homepage (`src/routes/index.tsx`)

### A. The Hero Quick-Access "Cash Cow" Feature Bar
Directly below the search omnibar and chips, or as the secondary quadrant:
- **Badge 1 (Speisely Magazin):**
  - Title: *"Speisely Magazin — Unabhängig & Kuratiert"*
  - Subtitle: *"Die besten Food-Stories & Caterer-Porträts Deutschlands"*
  - Direct CTA to `/magazin` with a warm gold book/magazine icon.
- **Badge 2 (Caterer Webseiten):**
  - Title: *"High-Speed Websites für Caterer (PageSpeed 99+)"*
  - Subtitle: *"Interaktiver Menü-Rechner, 0 % Provision & Google KI-SEO"*
  - Direct CTA to `/partner/webseiten` with a fast lightning/globe icon.

### B. Dedicated Cash Cow Spotlight Section (Above the Fold / First Scroll)
Add a prestigious 2-column editorial bento section right beneath the hero:
- **Left Column (Speisely Magazin Showcase):**
  - Visual: Compact 4:3 retina card of Seydioğlu Baklava Burger or King Tut feast.
  - Copy: *"Authentische Handwerkskunst. Wir testen Caterer & Küchen persönlich vor Ort."*
  - Link: `/magazin`
- **Right Column (Caterer Website Engine):**
  - Visual: Interactive Live Performance score badge (PageSpeed 99, 0.4s load time).
  - Copy: *"Dein Partyservice auf modernstem Tech-Niveau. Nie wieder Kunden an veraltete PDF-Karten verlieren."*
  - Link: `/partner/webseiten` with 34,99 €/Monat flatrate highlight.

---

## 3. Evaluator Critic Review (`/critic`)
- **Reviewer:** Mean Staff Critic
- **Feedback:** "This immediately monetizes the homepage. By giving Speisely Magazin and Website Creation first-class citizen real estate, visitors instantly see both **consumer trust (Magazin)** and **commercial B2B power (Websites)**. Approved."
