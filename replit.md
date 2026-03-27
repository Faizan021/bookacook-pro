# BookACook Pro

A Next.js 16 dashboard-first web app connecting customers with professional caterers. Built with React 19, Tailwind CSS v4, and Supabase for auth and data.

## Architecture

- **Framework**: Next.js 16 (App Router) with Turbopack
- **Styling**: Tailwind CSS v4
- **Backend/Auth**: Supabase (SSR client + browser client)
- **Charts**: Recharts
- **Package manager**: npm

## Build Order

1. **Dashboard** ← current phase
2. Website (later)
3. Mobile app (later)

## Route Structure

### Demo Dashboards (presentation-ready, sample data)
```
/demo/admin                → Admin overview (metrics, chart, activity)
/demo/admin/bookings       → Platform bookings table
/demo/admin/caterers       → Caterer management & approvals
/demo/admin/payments       → Platform revenue & transactions

/demo/caterer              → Caterer overview (sales, orders, packages)
/demo/caterer/bookings     → Booking requests table
/demo/caterer/packages     → Package management cards
/demo/caterer/verification → Verification status (demo: pending + payout blocked)
/demo/caterer/availability → Calendar availability module
/demo/caterer/payments     → Earnings & payout history

/demo/customer             → Customer overview (orders, spending)
/demo/customer/bookings    → Order history table
```

### Protected Dashboards (auth-gated, real Supabase data)
```
/admin                  → Admin dashboard (role: admin only)
/admin/bookings         → Admin bookings view
/admin/caterers         → Caterer review + verification actions (real data, Supabase)
/admin/payments         → Platform-wide GMV, commission, held/released/blocked summary

/caterer                → Caterer dashboard (role: caterer or admin)
/caterer/bookings       → Caterer bookings
/caterer/packages       → Package management
/caterer/availability   → Availability calendar
/caterer/verification   → Verification status + payout eligibility (real data, Supabase)
/caterer/payments       → Extended payment view: gross/commission/net/held/released

/customer               → Customer dashboard (role: customer or admin)
```

### Auth Routes
```
/login    → Login page
/signup   → Signup page
/dashboard → Role-based redirect hub
```

## Dashboard Modules (components/dashboard/)

| File | Purpose |
|------|---------|
| `sidebar.tsx` | Role-aware sidebar navigation (client, uses usePathname) |
| `shell.tsx` | Dashboard shell layout — wraps sidebar + content |
| `metric-card.tsx` | KPI metric card |
| `sales-chart.tsx` | Recharts line chart |
| `recent-activity.tsx` | Activity/event feed |
| `bookings-module.tsx` | Bookings table (role-aware: admin/caterer/customer) |
| `packages-module.tsx` | Catering package cards grid |
| `availability-module.tsx` | Interactive month calendar with availability states |
| `payments-module.tsx` | Summary cards + transactions table; supports extended caterer view (gross/commission/net/held/released) and admin summary view (GMV/commission/held/released/blocked) |
| `verification-module.tsx` | Caterer verification status: profile fields, status badge (5 states), payout eligibility card, warning banners |
| `admin-caterers-module.tsx` | Admin caterer review table with optimistic action buttons (under_review/verified/rejected/suspended) updating Supabase via browser client |

## Package Creation Studio (components/packages/)

The Package Studio is a shared content model — caterers enter data once in the dashboard, and the website reads the same records later.

| File | Purpose |
|---|---|
| `lib/packages/types.ts` | Package type definitions + constants (no server imports, safe for client) |
| `lib/packages/schema.ts` | Supabase read functions: `getCatererPackages`, `getPackageById`, `getPublicPackages`, `getFeaturedPackages` |
| `lib/packages/actions.ts` | Server actions: `createPackage`, `updatePackage`, `duplicatePackage`, `deletePackage` |
| `components/packages/package-form.tsx` | Guided package creation/edit form (client component) |

### Package routes

| Route | Description |
|---|---|
| `/caterer/packages` | List view — now uses `getCatererPackages` from shared model; cards link to edit |
| `/caterer/packages/new` | Create new package (auth-protected) |
| `/caterer/packages/[id]/edit` | Edit package, verifies ownership |
| `/demo/caterer/packages/new` | Demo form (no auth needed) |
| `/api/packages/ai-assist` | POST endpoint: suggest title / improve description / suggest keywords; falls back to smart demo suggestions if no OPENAI_API_KEY |

### Package form sections

1. **Grunddaten** (required) — title (with AI suggest + tips), summary, category, cuisine type
2. **Preis & Kapazität** (required) — price per person, min/max guests
3. **Veranstaltungsarten** — 10 event type checkboxes
4. **Beschreibung** — rich textarea with tips + AI improve button
5. **Leistungsumfang** — included items (tag input) + add-ons (name+price list)
6. **Ernährungsoptionen** — 8 dietary option checkboxes
7. **Logistik** (collapsible) — service area, setup time, booking notice
8. **Bilder** (collapsible) — cover image + gallery URL inputs with live preview
9. **Auffindbarkeit** (collapsible) — tags (with AI suggest), featured toggle

### Website reuse pattern (for later)

The website phase can import directly:
```ts
import { getPublicPackages, getFeaturedPackages } from "@/lib/packages/schema";
// or for a single listing:
import { getPublicPackageById } from "@/lib/packages/schema";
```
No second setup flow required — same `packages` table, filtered by `status = "active"`.

## Signup / Onboarding Routes

```
/signup             → Role chooser (Caterer card → /signup/caterer, Customer card → /signup/customer)
/signup/caterer     → Full caterer registration (7 required fields incl. license number, live validation, Supabase auth)
/signup/customer    → Simple customer registration (name, email, password, Supabase auth)
```

**Business rule:** Caterer signup is blocked client-side and server-side if `license_number` is empty.
After successful caterer registration the `verification_status` is set to `"pending"`.

### Supabase schema additions (migration file: supabase/migrations/001_add_caterer_fields.sql)

```
caterers table: + contact_person TEXT, + phone TEXT, + business_address TEXT, + license_number TEXT
profiles table: + full_name TEXT, + phone TEXT
```

## Data Layer (lib/)

- `lib/supabase/client.ts` — Browser Supabase client
- `lib/supabase/server.ts` — Server-side Supabase client (uses cookies)
- `lib/auth/get-user-profile.ts` — Fetch authenticated user + profile
- `lib/dashboard/admin.ts` — Admin dashboard data (Supabase, with fallback)
- `lib/dashboard/caterer.ts` — Caterer dashboard data
- `lib/dashboard/customer.ts` — Customer dashboard data

## Environment Variables Required

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous/public key (stored as secret)

## Running the App

```bash
npm run dev      # Development server on port 5000
npm run build    # Production build
npm run start    # Production server on port 5000
```

## Replit Configuration

- Dev server binds to `0.0.0.0:5000` for Replit preview compatibility
- `next.config.ts` sets `allowedDevOrigins` from `REPLIT_DEV_DOMAIN`
- Workflow: "Start application" runs `npm run dev`
