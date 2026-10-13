# Speisely — Performance & Lightweight Architecture Rules

This document defines performance standards, bundle size controls, caching guidelines, and lightweight execution rules for Speisely.

---

## 1. Lightweight Architecture Principles

- **Code Splitting & Lazy Loading:**
  - Public pages must never import or pull in heavy dashboard-only, admin-only, or partner management code.
  - Heavy components (e.g. `Recharts`, `MenuImportWizard`, `PrintOnboardingBanner`, `QrCodeGenerator`) must be dynamically imported or route-code-split.
- **Dependency Guardrails:**
  - Do not add new NPM packages casually. Always use pre-existing utilities (`date-fns`, `lucide-react`, `sonner`, `@tanstack/react-query`) whenever possible.
- **Third-Party Scripts:**
  - Keep PostHog, Sentry, and third-party scripts off the critical rendering path. Initialize asynchronously or lazy load on interaction.

---

## 2. Frontend & Asset Optimization

- **Responsive & Next-Gen Images:**
  - Use WebP image presets and optimized image URLs for banners, cards, and avatars. Avoid serving raw 5MB+ uncompressed PNGs.
- **Layout Shift Prevention (CLS):**
  - Always specify aspect ratios or fixed dimension skeletons for dynamic media, hero banners, and menu item cards.
- **Query & Data Fetching:**
  - Avoid redundant refetches and overfetching. Use TanStack Query stale-time configurations (`staleTime: 5 * 60 * 1000`) for non-volatile public data.

---

## 3. Performance Budgets & Production Verification

- Protect Core Web Vitals (LCP < 2.5s, FID/INP < 200ms, CLS < 0.1).
- Protect client JS bundle sizes.
- Every production deploy must pass `npm run smoke:test` to verify zero catastrophic render failures.

---

## 4. Supabase Database & Disk Health Protection

- **No Minute-Level Cron or `pg_net` Loops:** Never schedule `* * * * *` `pg_cron` jobs or `net.http_post` / `net.http_get` cron loops. Every execution writes to `cron.job_run_details`, `net._http_response`, and 16 MB PostgreSQL WAL files (`pg_wal`), which can exhaust the 8 GB disk and cause PostgreSQL to refuse connections (`ECONNREFUSED`).
- **Daily Log Retention & Lean WAL:** Keep `cleanup-cron-and-net-logs` (`0 4 * * *`) active, `"cron.log_statement": false`, `"pg_net.batch_size": 0`, and `wal_keep_size: "1MB"`.
- **No Unthrottled Database Writes on Public Traffic:** Public routes and loaders must be strictly read-only with 60s SWR in-memory caching so traffic spikes never stress Nano compute or disk I/O.
