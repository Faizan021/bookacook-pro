# Speisely — Antigravity Master Instruction & Agent Rules

You are working on Speisely.
Your job is to protect system clarity, lightweight structure, runtime stability, and safe execution.

---

## 1. Core Behavior

- Do not guess.
- Do not improvise architecture when project truth already exists.
- Do not reopen approved decisions unless explicitly asked by name.
- Do not treat “code written” as “task finished”.
- Prefer the smallest safe implementation that solves the real problem.
- Keep Speisely lightweight, stable, and easy to maintain.

When permanent repo docs exist, read them first:
1. `AGENTS.md` / `.agents/AGENTS.md`
2. `docs/DESIGN.md` (Authoritative Luxury Editorial Gastronomy Design System & Token Contract)
3. `docs/PROJECT_TRUTH.md`
4. `docs/DECISIONS.md`
5. `docs/PERFORMANCE_RULES.md`
6. `docs/ACTIVE_WORK_NOTES.md`
7. Specialized Antigravity Skills in `.agents/skills/`

---

## 2. Lightweight Architecture Rule

- Public pages must not pull in dashboard-only, admin-only, or partner-only code unnecessarily.
- Large route groups must use route-level splitting or lazy loading.
- Heavy dependencies must not be added casually.
- Avoid overfetching, duplicate queries, and unnecessary refetches.
- Preserve good caching behavior (60s SWR) on safe public pages.
- Keep third-party scripts off the critical render path.

---

## 3. Second-Eye Verification & 6-Node Execution Pipeline

Every code change must execute through this 6-node graph pipeline:

```
[Node 1: Planner] -> [Node 2: Worker Code] -> [Node 3: Static Scope Reviewer] -> [Node 4: Build & Smoke Verifier]
                                                    |                                         |
                                                    v (If Scope / Build Error)               v
                                                    +------------------<----------------------+
                                                                        |
                                                                        v
                                                   [Node 4.5: Visual QA Judge (Playwright + Multimodal Vision)]
                                                                        |
                                                                        v (If Visual / Layout Flaw Detected)
                                                                        +------> (Feedback Loop back to Node 2)
```

- **Node 1 (Planner):** Map component boundaries and dependencies before touching code.
- **Node 2 (Worker):** Implement the smallest safe, low-risk change.
- **Node 3 (Static Scope Reviewer):** Execute `npm run verify:graph` to audit component scoping, route length, broken assets, and rules.
- **Node 4 (Verifier):** Execute `npx tsc --noEmit` AND `npm run build` to confirm 100% compilation and zero production crash markers.
- **Node 4.5 (Visual QA Judge):** Execute `npm run qa:visual` to capture real headless Chromium screenshots across Desktop (1440x900) and Mobile (360x780). Inspect using the **5-Point Human-Eye Rubric**:
  1. *Clipping & Cropping Check:* Ensure no header, title, or folio is clipped behind navigation or sliced horizontally.
  2. *Whitespace Balance Check:* Ensure no accidental voids (>20% vertical canvas) remain unutilized.
  3. *Typography Collision Check:* Ensure zero text collision or unreadable contrasts.
  4. *Asset Health Check:* Ensure all images are loaded, crisp, and aspect-ratio locked.
  5. *State & Translation Check:* Ensure DE/EN toggles switch cleanly without reloads.
- **Node 5 (Feedback Loop):** Automatically loop back to Node 2 to correct root causes before presenting to the user.

---

## 4. Specialized Antigravity Skills (On-Demand Activation)

To avoid context bloat and attention dilution, specialized domain rules are modularized into dedicated skills:

1. **Editorial Magazine & Food Photography:**  
   → Activate skill: `editorial-magazine` (`.agents/skills/editorial-magazine/SKILL.md`)  
   *Mandatory 4:3 retina passe-partout framing, zero in-image floating badges, anti-AI voice framework, and truth-in-editorial integrity.*

2. **Social Media & Video Creation:**  
   → Activate skill: `social-media-creator` (`.agents/skills/social-media-creator/SKILL.md`)  
   *King Tut Berlin 8-slide architecture, Slide 1 brand seal, Reel 10/10 masterclass exclusion zones (Y:0-260px & Y:1520-1920px), and clean creator SEO copywriting.*

3. **Mobile Ergonomics & Responsive UX:**  
   → Activate skill: `mobile-ergonomics` (`.agents/skills/mobile-ergonomics/SKILL.md`)  
   *360px & 375px zero-clip audits, full-width responsive action stacking, 44px touch targets.*

4. **Visual Inspection:**  
   → Activate skill: `qa-visual` (`.agents/skills/qa-visual/SKILL.md`)  
   *Headless Chromium multi-viewport visual grading.*

---

## 5. Mandatory LLMs.txt & Sitemap Synchronization (GEO / AEO)

Whenever ANY new article, blog post, partner story, or public route is added, renamed, or updated:
- You MUST immediately update and synchronize:
  1. `src/routes/llms[.]txt.ts` (Dynamic API endpoint)
  2. `public/llms.txt` and `public/llms-full.txt` (Static documentation for AI search crawlers)
  3. `src/routes/sitemap[.]xml.ts` (Dynamic XML sitemap)
- Never leave public routes or partner articles unmapped.

---

## 6. Mandatory SEO Integrity & Ahrefs Zero-Error Standard

1. **Zero Duplicate Meta Tags:** Metadata MUST be declared strictly via TanStack Router's `Route.head`. Never put hardcoded meta tags in JSX `<head>`.
2. **Zero Broken Image References:** Every image URL referenced in code MUST exist on disk in `public/`.
3. **Strict Canonical Sitemaps:** Sitemaps MUST contain only direct canonical `200 OK` HTML route URLs (no 3XX, no 4XX, no internal API routes).
4. **Zero Orphan Public Pages:** Every indexable public page MUST have incoming navigational links in the navigation, dropdowns, or footer directory.
5. **Pure Read-Only Database Queries:** Public loaders must NEVER execute mutations on read requests and must utilize in-memory TTL caching.

---

## 7. Mandatory Supabase Health & Disk Protection (Zero-Bloat Standard)

1. **Zero High-Frequency `pg_cron` or `pg_net` Polling Jobs:** Never schedule minute-level jobs or HTTP loops in postgres that write WAL bloat.
2. **Mandatory Daily Log Retention Purge:** Daily cleanup job (`cleanup-cron-and-net-logs` at `0 4 * * *`) purging logs >24h.
3. **No Base64 Media in Tables:** Never store Base64 images or PDFs in postgres columns; use `public/` or Supabase Storage.
4. **Read-Only & Cached Public Storefront Queries:** Public traffic must never overload database compute.

---

## 8. Mandatory Database & API Security (Zero-Trust RLS & RPC)

1. **100% RLS Coverage:** Every table in the `public` schema MUST have `ENABLE ROW LEVEL SECURITY` active.
2. **Strict `service_role` Isolation:** Backend webhook/archive tables MUST explicitly specify `TO service_role`. Never expose service role keys on client routes.
3. **Zero Unauthenticated `SECURITY DEFINER` RPCs:** All security definer functions MUST set `search_path = public` and revoke execute from public/anon.
4. **Security Invoker Views:** Every view MUST set `WITH (security_invoker = true)`.

---

## 9. Partner Backlink & Health Watchdog

- Run `npm run verify:backlinks` to confirm that all active partner websites (e.g. `partyservicekuepper.de`) are live (HTTP 200) and preserve active backlinks to `speisely.de`.

---

## 10. Definition of Done

A Speisely task is only “done” when all of the following are true:
- Code is implemented.
- `verify:graph` passes with 0 errors.
- `npx tsc --noEmit` and `npm run build` succeed with zero errors.
- The affected route/page renders correctly in desktop & mobile viewports.
- No major unrelated area was disturbed.
- Risk and changes are reported clearly.
