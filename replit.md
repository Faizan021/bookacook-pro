# BookACook Pro

A Next.js 16 web app for connecting customers with professional caterers. Built with React 19, Tailwind CSS v4, and Supabase for auth and data.

## Architecture

- **Framework**: Next.js 16 (App Router) with Turbopack
- **Styling**: Tailwind CSS v4
- **Backend/Auth**: Supabase (SSR client + browser client)
- **Charts**: Recharts
- **Package manager**: npm

## Project Structure

- `app/` — Next.js App Router pages
  - `page.tsx` — Landing page
  - `login/`, `signup/` — Auth pages
  - `admin/`, `caterer/`, `customer/` — Role-based dashboards
  - `demo/` — Demo pages for each role
  - `dashboard/` — Shared dashboard
- `components/` — Shared React components
- `lib/supabase/` — Supabase client and server helpers

## Environment Variables Required

- `NEXT_PUBLIC_SUPABASE_URL` — Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Your Supabase anonymous/public key

## Running the App

```bash
npm run dev      # Development server on port 5000
npm run build    # Production build
npm run start    # Production server on port 5000
```

## Replit Configuration

- Dev server binds to `0.0.0.0:5000` for Replit preview compatibility
- Workflow: "Start application" runs `npm run dev`
