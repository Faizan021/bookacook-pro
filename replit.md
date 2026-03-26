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
/demo/caterer/availability → Calendar availability module
/demo/caterer/payments     → Earnings & payout history

/demo/customer             → Customer overview (orders, spending)
/demo/customer/bookings    → Order history table
```

### Protected Dashboards (auth-gated, real Supabase data)
```
/admin          → Admin dashboard (role: admin only)
/caterer        → Caterer dashboard (role: caterer or admin)
/customer       → Customer dashboard (role: customer or admin)
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
| `payments-module.tsx` | Revenue summary cards + transactions table |

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
