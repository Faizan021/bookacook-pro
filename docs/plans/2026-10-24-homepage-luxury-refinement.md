# PRD: Speisely Homepage Luxury & Eye-Catching Refinement
*Date: 2026-10-24 | Author: Lead Orchestrator & Panel of Subagents*
*Document Path: `docs/plans/2026-10-24-homepage-luxury-refinement.md`*

---

## 1. Objective & Scope
Refine the Speisely Homepage (`src/routes/index.tsx`) to elevate it from a functional directory to an **eye-catching, authoritative luxury culinary marketplace**, adhering to `docs/DESIGN.md` and the Google Immersion multi-agent standards.

### Non-Goals:
- No database migrations or schema alterations.
- No changes to routing or payment logic.
- Zero disturbance to existing SEO structured data (`head()` metadata and JSON-LD).

---

## 2. Proposed Refinements (The 3 Polish Pillars)

### Pillar 1: Hero Typography & Copywriting Elevation
- **Current H1:** *"Essen bestellen, Tische reservieren & Catering buchen."*
- **Refined Luxury H1:**
  ```tsx
  {audienceMode === "foodie" ? (
    <>
      {tt("Kuratiertes Catering &", "Curated Catering &")}
      <br />
      {tt("außergewöhnliche", "Exceptional")}
      <br />
      <span className="text-[#E6B84A]">
        {tt("Gastronomie.", "Gastronomy.")}
      </span>
    </>
  ) : (
    <>
      {tt("Dein Restaurant.", "Your restaurant.")}
      <br />
      {tt("Dein Webshop.", "Your webshop.")}
      <br />
      <span className="text-[#E6B84A]">{tt("0 % Provision.", "0% Commission.")}</span>
    </>
  )}
  ```
- **Refined Subline:**
  ```tsx
  {audienceMode === "foodie"
    ? tt(
        "Finde handverlesene Caterer für Firmenfeiern, Hochzeiten und besondere Anlässe in ganz Deutschland — transparent, persönlich und ohne Mittelsmänner.",
        "Discover hand-picked caterers for corporate galas, weddings, and private events across Germany — transparent, personal, and without middlemen."
      )
    : tt(
        "Schluss mit 30 % Lieferando-Gebühren. Unbegrenzte Bestellungen, Live-KDS Küchenmonitor und 100 % Gastdaten für faire 34,99 €/Monat.",
        "Stop giving 30% to delivery portals. Unlimited orders, Live KDS kitchen monitor, and 100% customer data for fair 34.99 €/month."
      )}
  ```

### Pillar 2: Visual Hierarchy & Omnibar Breathing Room
- Give the AI Search Omnibar a distinct luxury presence with a subtle Warm Gold glow (`focus-within:border-[#E6B84A] focus-within:ring-2 focus-within:ring-[#E6B84A]/30`).
- Ensure the 3 vertical pills (`Restaurants`, `Catering`, `Event-Planung`) sit cleanly with ample spacing on mobile (no clipping).

### Pillar 3: Floating Passe-Partout Food Card (The Appetite Hook)
- On desktop viewports (`lg:block`), embed a floating glassmorphic spotlight badge on the right image container showcasing:
  - *Speisely Curation Seal* (`#E6B84A`)
  - *Featured Event Platter*
  - Rating: `★ 4.9 · Verifizierte Partner in Berlin & DACH`

---

## 3. Verification & Acceptance Criteria
1. `npm run verify:graph` passes with 0 errors across all 15 rules.
2. Build passes (`npm run build`).
3. Mobile touch targets maintain `≥ 44px`.
4. Contrast ratio remains above `7:1` (WCAG AAA).
