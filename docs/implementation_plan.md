# Comprehensive Project Documentation Plan

The goal is to establish a **long-term project memory** by documenting the real, current state of the codebase, free of assumptions. I will trace the codebase (routes, database types, server functions) and generate 6 definitive artifacts.

Any gaps or assumed functionality will be explicitly tagged as **missing / partial / assumed**.

## User Review Required

Please review the proposed structure for the 6 documentation artifacts below. If this looks correct, I will proceed to generate all 6 artifacts with the exact details from your codebase.

## 1. PROJECT_ROLES.md

Will document the 5 main roles based on `src/routes/_authenticated/*` and `src/lib/auth/role-middleware.ts`:

1. **Admin** (`src/routes/admin.tsx`)
2. **Customer** (`src/routes/_authenticated/customer.tsx`)
3. **Caterer** (`src/routes/_authenticated/caterer.tsx`)
4. **Restaurant** (`src/routes/_authenticated/restaurant.tsx`)
5. **Event Manager** (`src/routes/_authenticated/dashboard/planner.tsx`)

For each, I will detail:

- Role purpose & Auth flow
- Dashboard structure & Actions
- Booking/Ordering flows & Promo logic
- Data dependencies & Implementation status

## 2. STORE_FRONT.md

Will document the public discovery experience based on `src/routes/*` (e.g., `index.tsx`, `instant-order.tsx`, `catering.index.tsx`, `restaurant.$slug.tsx`):

- Listing & Search experience
- Partner profile pages (Restaurant, Caterer, Planner)
- Menus, packages, promos, and reviews
- Checkout and booking entry points
- Status of UI/UX elements (implemented vs missing)

## 3. SEO_GEO.md

Will map out the organic growth strategy based on `seo_content_pages`, `german_locations`, and SSR route head configurations:

- Title/meta tag patterns and heading structures
- Local landing pages (cities / services)
- SEO opportunities for each partner type
- Sitemap / indexing logic (`sitemap.xml.ts`)
- Implemented vs missing SEO features

## 4. SHARED_RULES.md

Will document the global business logic:

- Unified identity vs operational workspaces
- Anti-fraud rules (e.g., blackout dates, past-date prevention)
- Promo engine logic
- Stripe checkout & payment flows
- Notification patterns

## 5. DATA_MAP.md

Will list and define the purpose of every table found in `src/integrations/supabase/types.ts`:

- Core tables (e.g., `restaurants`, `caterers`, `planners`)
- Transactions (e.g., `orders`, `table_reservations`, `catering_bookings`)
- System (e.g., `user_roles`, `seo_content_pages`)
- Explicit tags for active vs legacy/duplicate

## 6. DECISIONS.md

Will act as the immutable record of approved architecture choices:

- Tech stack (TanStack Router, Supabase, Vite)
- Subdomain / Custom Domain routing logic (`src/server.ts`)
- Auth and Checkout decisions
- Rules I must not revisit without explicit approval

## Verification Plan

After generating the files, I will review them against the actual codebase files (like `types.ts`, `role-middleware.ts`, and the router tree) to ensure zero hallucinations.
