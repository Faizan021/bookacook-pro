# Speisely SEO & GEO Strategy

*Last verified against code, commit `4381605`, 2026-07-05.*

This document maps the technical SEO structure and Geographic discovery (GEO) strategy for organic growth, based on the current codebase.

## 1. GEO Definition: Geographic Discovery & Local SEO

**Concept:**
GEO in Speisely refers strictly to **location-based programmatic landing pages and local discovery**. It dictates how users find partners when searching for queries like "Catering in Berlin" or "Pizza delivery in Munich".

**Database Structure (`german_locations`):**
- Contains cities, zip codes, and geographic coordinates.
- **Implemented:** `Built`. Seeded via migrations.

**Programmatic Landing Pages:**
- **Intended structure:** `/{vertical}/{city}` (e.g., `/catering/berlin`).
- **Intended data source:** `seo_content_pages`, which allows Admin to override auto-generated content (H1s, intro text) per city + category combination.
- **Implemented: MISSING (not Partial).** `seo_content_pages` has full admin CRUD (`src/lib/admin/mutations.functions.ts`, `queries.functions.ts`) but **zero public-facing consumption was found anywhere in `src/routes/`.** No route matches a city-slug pattern; the table's content is never rendered on any public page. Treat this as backend-only tooling with no live surface area, not a partially-shipped feature — the gap is the entire public half, not a detail.

## 2. Technical SEO Structure

**Title & Meta Patterns**
- **Pattern:** Managed via TanStack Router's `head()` callback in route definitions.
- **Example (Partner Profile):** `Title: [Partner Name] - [Category] in [City] | Speisely`
- **Implemented:** `Built` for restaurant/caterer/planner profile routes — confirmed dynamic title/meta generation in `restaurant.$slug.tsx`, `catering.$slug.tsx`, `planner.$slug.tsx`.

**Heading Structure**
- H1: Partner Name or Page Category.
- H2: Menu Categories, Services, About sections.
- **Implemented:** `Built`.

**Schema Markup (JSON-LD)**
- **Implemented: BUILT (not Missing).** Confirmed dynamic `application/ld+json` injection via route `head()` on restaurant, caterer, and planner storefront profiles (`restaurant.$slug.tsx`, `catering.$slug.tsx`, `planner.$slug.tsx`), each emitting a schema.org type with name/description/address/url. A prior version of this doc calling this "completely missing" is stale.
- **Remaining gap:** No `AggregateRating` schema (ties to the reviews system, which is itself mocked — see `CONFIRMED_VS_ASSUMED.md`), and no `Product` schema for individual menu items. These specific sub-types are genuinely missing; the base `Restaurant`/equivalent schema is not.

**Canonical URLs**
- **Logic:** Must point to the primary `speisely.de` path to avoid duplicate content penalties from custom domains/subdomains.
- **Example:** `pizza.speisely.de` canonicalizes to `https://speisely.de/restaurant/pizza`.
- **Implemented: BUILT (not Missing/Partial).** Confirmed `<link rel="canonical">` tags generated via `head()` on the same three storefront route files referenced above. A prior version of this doc calling this "Missing/Partial" is stale.

## 3. SEO Opportunities by Role

**Restaurant SEO:**
- Target: "Order [Cuisine] in [City]"
- Profiles contain rich text descriptions and menu items; JSON-LD and canonical tags are live.

**Caterer SEO:**
- Target: "[Event Type] Catering [City]" (e.g., Wedding Catering Berlin)
- Packages and Minimum Order Values provide good structured data; JSON-LD and canonical tags are live.

**Event Manager SEO:**
- Target: "Event Planner [City]"
- Portfolio images (Image SEO alt tags) remain a real gap — no confirmation of systematic alt-text generation found in code.

## 4. Crawlability & Indexing

**Sitemap (`sitemap.xml.ts`)**
- **Logic:** Dynamically generated API route that queries Supabase for all active slugs across restaurants, caterers, and planners.
- **Implemented:** `Built` — route file confirmed present at `src/routes/sitemap[.]xml.ts`.

**Robots.txt**
- Allows crawling of main directories, disallows `/_authenticated/*` and `/admin/*`.
- **Implemented:** Not independently re-verified in this pass — carry forward as `Assumed / Built` until directly checked.

## Current Gaps & Content Needs (re-verified)

1. **Programmatic GEO pages** — the single biggest actual gap. Backend data model exists; zero live public routes consume it.
2. **AggregateRating / Product schema** — depends on the reviews system going live first (currently mocked).
3. **Image SEO** — partner-uploaded images (banners, portfolio, products) still likely lack descriptive `alt` tags; not directly re-verified this pass, carry forward as a probable gap.
4. **Internal Linking** — deep cross-linking (e.g., "Other Caterers in Berlin") is weak; not directly re-verified this pass, carry forward.

**What changed from the previous version of this doc:** JSON-LD schema markup and canonical URLs were previously marked "Missing" — both are actually implemented on the three main storefront profile types. The programmatic GEO landing pages were previously marked "Partial" — reclassified to "Missing" for the public-facing half, since no live route exists at all.
