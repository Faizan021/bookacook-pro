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

- **Zero Render-Blocking Font Preloads:**
  - Never use `<link rel="preload" as="style">` for external Google Fonts stylesheets. External font preloads compete with critical CSS on mobile 4G and delay First Contentful Paint (FCP) by 800ms+.
  - Always load Google Fonts asynchronously via the non-blocking print stylesheet pattern (`media="print" onload="this.media='all'"`) with `<noscript>` fallback.
  - Allow browsers to immediately render system fallback fonts with zero FOIT (flash of invisible text) and swap fonts smoothly once loaded.

- **Mandatory LCP Image Sync Decoding & Preloading:**
  - The Largest Contentful Paint (LCP) hero image (`fetchPriority="high"`) MUST use `decoding="sync"`.
  - `decoding="async"` on LCP images creates a >1,800 ms Element Render Delay in Lighthouse mobile audits because the browser thread delays decoding until layout work finishes.
  - Preload the LCP image in `Route.head` with explicit `type="image/webp"` and `media` queries.
  - When a mobile hero exists (e.g. `hero-cinematic-mobile.webp`), isolate desktop master assets using `<picture>` and media queries so phones never download the desktop image.

- **Responsive & Next-Gen Images (<350 KB Budget):**
  - All public imagery must be encoded as WebP (or AVIF).
  - Maximum size budget: **350 KB** for high-res retina master hero banners; **<75 KB** for cards, menu items, and thumbnails.
  - Commit zero uncompressed PNGs or JPEGs (>250 KB) on public storefront, catering, restaurant, planner, case study, or magazine routes.
  - Wrap card images in responsive `<picture>` tags to serve 480px WebP images to mobile viewports instead of 1200px desktop assets.

- **Layout Shift Prevention (CLS):**
  - Always specify aspect ratios or fixed dimension skeletons for dynamic media, hero banners, and menu item cards.

- **Query & Data Fetching:**
  - Avoid redundant refetches and overfetching. Use TanStack Query stale-time configurations (`staleTime: 5 * 60 * 1000`) for non-volatile public data.

---

## 3. Performance Budgets & Production Verification

- **Target Metrics (Mobile & Desktop):**
  - Performance: **90+** (LCP < 2.5s, FCP < 1.8s, TBT < 200ms, CLS < 0.05).
  - Accessibility: **100/100** (WCAG 2 AA/AAA contrast, unique `aria-label`s on generic links, strict sequential headings `h1` ➔ `h2` ➔ `h3`).
  - Best Practices: **100/100** (HTTPS, modern image formats, clean aspect ratios).
  - SEO: **100/100** (Canonical tags, SERP-length titles/descriptions, structured schema).
  - Agentic Browsing: **3/3** (Standard Markdown link format in `/llms.txt`).

- **Automated Compiler Gate (`verify:graph` Rule 16):**
  - Every build runs `scripts/verify_agent_graph.js` (Rule 16), which validates zero render-blocking font preloads, LCP sync decoding, asset size budgets (<350 KB), and accessible link descriptions.
  - If any performance violation is detected, `npm run build` halts immediately before deployment.

---

## 4. Supabase Database & Disk Health Protection

- **No Minute-Level Cron or `pg_net` Loops:** Never schedule `* * * * *` `pg_cron` jobs or `net.http_post` / `net.http_get` cron loops. Every execution writes to `cron.job_run_details`, `net._http_response`, and 16 MB PostgreSQL WAL files (`pg_wal`), which can exhaust the 8 GB disk and cause PostgreSQL to refuse connections (`ECONNREFUSED`).
- **Daily Log Retention & Lean WAL:** Keep `cleanup-cron-and-net-logs` (`0 4 * * *`) active, `"cron.log_statement": false`, `"pg_net.batch_size": 0`, and `wal_keep_size: "1MB"`.
- **No Unthrottled Database Writes on Public Traffic:** Public routes and loaders must be strictly read-only with 60s SWR in-memory caching so traffic spikes never stress Nano compute or disk I/O.
