# Speisely — Antigravity Master Instruction & Agent Rules

You are working on Speisely.

Your job is not only to write code.
Your job is to protect system clarity, lightweight structure, runtime stability, and safe execution.

You must follow the rules below for every task.

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
4. `docs/EDITORIAL_STYLE_GUIDE.md`
5. `docs/DECISIONS.md`
6. `docs/PERFORMANCE_RULES.md`
7. `docs/ACTIVE_WORK_NOTES.md`
8. `docs/plans/` (Product Requirement Documents & Technical Architecture Specs)

If code and docs conflict:

- trust the verified codebase over stale docs,
- then report the mismatch clearly,
- then propose the minimum safe correction.

---

## 2. Lightweight Architecture Rule

Every implementation must preserve a light structure.

### Required principles

- Public pages must not pull in dashboard-only, admin-only, or partner-only code unnecessarily.
- Large route groups must use route-level splitting or lazy loading where appropriate.
- Heavy dependencies must not be added casually.
- Prefer existing utilities and platform features before adding new packages.
- Avoid overfetching, duplicate queries, and unnecessary refetches.
- Preserve good caching behavior on safe public pages.
- Keep third-party scripts off the critical render path unless truly necessary.
- Do not add complexity just because it is technically possible.

---

## 3. Second-Eye Verification Rule

For every meaningful code change, you must do a second pass before reporting success.
Act as if a second reviewer is checking your work.

### Before saying a task is complete, verify:

#### A. Build / type safety

- Run `npm run build` (or relevant build command).
- Run type-check if available.
- Check for import/export issues.
- Check for compile-time warnings that may become runtime failures.

#### B. Runtime sanity

- Check for visible runtime errors such as:
  - `is not defined`
  - undefined property access
  - broken imports
  - route render failures
  - hydration/render mismatch
  - blank section
  - infinite loading state
  - broken dashboard shell

If these exist, the task is NOT complete.

#### C. Route and UI verification

- Open/verify the affected page or route.
- Confirm it actually renders.
- Confirm loading resolves correctly.
- Confirm major UI sections appear correctly.
- Confirm no silent crash markers or broken placeholders remain.

#### D. Scope safety

- Check that unrelated areas were not disturbed.
- Especially protect: dashboard behavior, auth/session flow, storefront rendering, role boundaries, payment/Stripe logic, production stability.

### 3.1 Enforced Graph-Style Execution Pipeline (Multi-Agent Architecture)

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
- **Node 3 (Static Scope Reviewer):** Execute `npm run verify:graph` to audit component function scoping (`t is not defined`, missing hooks, broken links) before building.
- **Node 4 (Verifier):** Execute `npm run build` AND `npm run smoke:test` to confirm 100% compilation and zero production crash markers.
- **Node 4.5 (Visual QA Judge):** Execute `npm run qa:visual` to capture real headless Chromium screenshots across Desktop (1440x900), Laptop (1280x800), and Mobile/Embedded viewports. The agent MUST inspect the resulting images using `view_file` and grade them against the **5-Point Human-Eye Rubric**:
  1. _Clipping & Cropping Check:_ Ensure no header, title, or folio is clipped or hidden behind navigation/toolbars.
  2. _Whitespace Balance Check:_ Ensure no accidental blank voids (>20% of vertical canvas) remain unutilized.
  3. _Typography Collision Check:_ Ensure no overlapping text, broken line wraps, or unreadable contrasts.
  4. _Asset Health Check:_ Ensure all images are loaded, crisp, and aspect-ratio locked (no naturalWidth === 0).
  5. _State & Translation Check:_ Ensure interactive controls (like DE/EN toggle) switch copy cleanly with zero reload.
- **Node 5 (Feedback Loop):** If Node 3, Node 4, or Node 4.5 fails ANY check, automatically loop back to Node 2 to correct the root cause _before_ presenting results to the user. Never ask the user to visually QA uninspected layouts.

#### E. Report like a reviewer

Before closing the task, return:

1. what changed,
2. what was tested,
3. what passed,
4. multimodal visual inspection findings (from Node 4.5),
5. remaining risk,
6. whether it is safe for production or needs more review.

---

## 4. Review-First Workflow

For major or non-trivial tasks:

1. Goal
2. Exact files/components likely affected
3. Risks
4. Acceptance criteria
5. Visible UI or system outcome

Then implement.
Then verify.
Then report.

---

## 5. Safe-Change Rule

Prefer low-risk changes first.
If a task touches auth, payments, routing structure, role logic, production data flow, RLS/database structure, or shared dashboard layout:

- avoid unnecessary rewrites,
- choose the smallest safe change that solves the problem.

If a structural rewrite is proposed, explain why a smaller fix is not enough, the risk introduced, how rollback works, and how behavior will be verified.

---

## 6. Documentation Discipline

Use files, not chat memory, as the source of truth.
Permanent rules belong in:

- `AGENTS.md` / `.agents/AGENTS.md`
- `docs/PROJECT_TRUTH.md`
- `docs/EDITORIAL_STYLE_GUIDE.md`
- `docs/DECISIONS.md`
- `docs/PERFORMANCE_RULES.md`

Temporary sprint state belongs in:

- `docs/ACTIVE_WORK_NOTES.md`

If you learn something important during implementation:

- update the right document,
- do not leave critical truth trapped only inside chat.

---

## 7. Lightweight Frontend Rules

When working on UI/frontend:

- Use responsive images where relevant (`picture`, `srcset`, `sizes`) instead of forcing oversized media on every device.
- Keep analytics and monitoring lazy/off critical path unless essential.
- Preserve cache headers and CDN behavior intentionally on public content.
- Avoid importing large libraries globally when route-scoped loading is enough.
- Do not create heavy UI abstraction for a simple page need.
- Prefer stable rendering over brittle implementation.
- Prevent layout shifts by reserving space for dynamic content and media.

---

## 8. Definition of Done

A Speisely task is only “done” when all of the following are true:

- Code is implemented.
- Build/type checks pass.
- The affected route/page renders correctly.
- No obvious runtime error remains.
- No major unrelated area was disturbed.
- Risk is clearly stated.
- The result is lightweight enough for the project standard.
- The report explains what changed and what was verified.

---

## 9. Mandatory LLMs.txt & Sitemap Synchronization Rule (GEO / AEO)

Whenever ANY new article, blog post, Speisely Visit, community partner story, or public route is added, renamed, or updated:

- You MUST immediately update and synchronize:
  1. `src/routes/llms[.]txt.ts` (API route serving `/llms.txt` dynamically)
  2. `public/llms.txt` and `public/llms-full.txt` (Static documentation for AI search crawlers)
  3. `src/routes/sitemap[.]xml.ts` (Dynamic XML sitemap for search engines)
- Never leave new public content, city landing pages, or partner editorial articles unmapped in `/llms.txt` or `sitemap.xml`. AI search engines (Perplexity, ChatGPT Search, Claude, Gemini) rely on these files for authoritative citations.

---

## 10. Mandatory Luxury Editorial Magazine Image Standard (Policy for All Articles)

Whenever ANY new article, Community Story, or Speisely Visit is published, modified, or audited:

1. **Zero Blurry / Wide Room Snapshots:**
   - Never use wide-angle, low-light, or soft ambient room photos.
   - Only use crisp, close-up, mouth-watering food photos, signature dishes, or sharp architectural logo details.
2. **Unified Aspect Ratio & Dimensions:**
   - ALL images in an article must share identical aspect ratios (strictly standard 4:3 ratio, e.g. 800×600 px or 1200×900 px).
   - Zero dimension mismatches allowed across an article.
3. **Luxury Passe-Partout Framing (No Giant Desktop Stretching):**
   - Never stretch small phone photos to full-width containers across desktop screens.
   - Every image MUST be enclosed in a compact, high-density retina frame (`max-w-xl mx-auto` or 2-column `max-w-2xl mx-auto grid`) with a double-layer gallery border:
     `relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-white p-3 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl`
4. **Strictly Zero In-Image Floating Badges (100% Unobstructed Food Showcase):**
   - **STRICTLY PROHIBITED:** Never place floating badge pills, tag chips, or text overlays directly over food photographs (`absolute top-...` or `absolute bottom-...` covering the image canvas). Food dishes (pastries, glazes, meats, garnishes) must remain 100% visible, crisp, and completely unobstructed.
   - **Standard Placement:**
     - For cards in grids or lists: Place badges cleanly in the card text body directly above or below the title (`<div className="inline-flex items-center gap-1.5 ...">`).
     - For standalone editorial figures: Place badges and credits in the figure caption bar beneath the photo container.
   - Always append cache-busting query strings (`?v=3`) to image paths so client browsers never display stale or unsharpened assets.

---

## 11. Mandatory SEO Integrity & Ahrefs Zero-Error Standard

Whenever modifying routes, layouts, meta tags, sitemaps, or static public assets, you MUST adhere to the following 5 strict rules:

1. **Zero Duplicate Meta Tags:**
   - NEVER place hardcoded `<meta name="description">`, `<meta property="og:title">`, or `<meta name="twitter:...">` tags directly in JSX `<head>` in `__root.tsx` or layout wrappers.
   - All metadata MUST be declared strictly via TanStack Router's `Route.head` (`head: () => ({ meta: [...] })`) so that child routes can cleanly overwrite or complement root metadata without producing duplicate tags.

2. **Zero Broken Image References:**
   - Every image URL referenced in code (`/images/...`, `/magazin/...`, `/hero...`) MUST exist on disk in `public/`.
   - Never reference speculative filenames. Run `npm run verify:graph` to validate all image paths before committing.

3. **Strict Canonical Sitemaps (No 4XX, No 3XX, No API Routes):**
   - `src/routes/sitemap[.]xml.ts` MUST contain only direct canonical `200 OK` HTML route URLs.
   - Never include internal API routes (e.g. `/api/...`).
   - Dynamic entries (caterers, restaurants, planners) MUST use URL slugs (`${item.slug || item.id}`) to avoid 301 redirects and 404 lookups.
   - Geo landing URLs MUST strictly match declared route patterns (e.g. `/catering/ort/$city`, `/restaurant/ort/$city`, `/planner/ort/$city`).

4. **Zero Orphan Public Pages:**
   - Every indexable public page MUST have incoming navigational links in the main navigation (`SiteHeader.tsx`), dropdown menus, and/or footer (`SiteFooter.tsx`).

5. **Pure Read-Only Database Queries:**
   - Public route loaders and read functions (`getRestaurants`, `getCaterers`, `getPlanners`, `getGeoPageData`) must NEVER execute destructive `DELETE` or `UPDATE` mutations on read requests.
   - All public catalog queries must implement lightweight in-memory TTL caching (60s SWR) to maintain fast TTFB (<25ms).

---

## 12. Mandatory Instagram Carousel Standard (King Tut Architecture & Layout Rule)

Whenever creating or generating an Instagram Carousel for ANY restaurant, caterer, event, or partner story:
Never improvise or change styling arbitrarily. Follow the standardized **King Tut Berlin Architecture** exactly:

1. **Strict Format & Resolution:**
   - Aspect ratio: Portrait 4:5 (`1080 x 1350 px`).
   - Slide count: 7 to 8 slides per story.
   - Outputs: Always export BOTH versions into organized folders:
     - `public/magazin/<slug>/instagram/clean/`: Pure high-res images cropped to 1080×1350 without typography.
     - `public/magazin/<slug>/instagram/with_text/`: Branded slides with standardized text overlays.

2. **Mandatory First Slide (Pure Minimalist Speisely Branding Page):**
   - **Slide 1 MUST ALWAYS BE the Pure Minimalist Speisely Brand Seal:**
     - Background: Pure Speisely Deep Forest Green (`#083822` / `rgb(8, 56, 34)`).
     - Center: ONLY the official Speisely Logo (crossed fork & spoon emblem + "Speisely" in creamy ivory `#F6F4EB`).
     - Clutter-free: Zero additional text, zero headlines, zero badges, zero slide counter on Slide 1.
     - This anchors every carousel instantly in the Instagram feed as an authoritative, prestigious Speisely curation.

3. **Standardized Typographic Hierarchy & Positioning (Slides 2 to N):**
   - **Slide Counter (Top Right):** e.g., `2/8`, `3/8` (White font with slight drop shadow, `font_size: 24px`, top offset `40px`).
   - **Top Left Brand Mark:** Speisely circular gold seal logo (`72 x 72 px`).
   - **Top Category / Spotlight Badge (Centered Top):**
     - Frosted sage/cream pill (`radius: 20px`, fill `#EBF4EC`, outline `#7FA46B`, text `#182E22`, bold uppercase, e.g., `SPEISELY COMMUNITY SPOTLIGHT`, `STREETFOOD-LIEBLING`, `DER SHOWSTOPPER`).
     - Y-position: `65px`.
   - **Main Headline (Centered Below Badge):**
     - Serif typography (Georgia Bold, `54px`), high-contrast white text with subtle drop shadow (Y-position: ~`125px`).
   - **Subtitle / Dish Description (Centered Bottom Pill):**
     - Translucent dark pill container (`fill: rgba(15, 25, 20, 0.78)`, border `#FFFFFF3C`, radius `12px`), Arial/Inter Bold `28px`, white text.
     - Y-position: ~`TARGET_H - 165px`.
   - **Footer Call-to-Action (Centered Bottom):**
     - Speisely Gold (`#E6B84A`) text (`26px`), e.g., `Swipe für den Festschmaus >>` or `Speichere diesen Post für deinen nächsten Besuch!`.
     - Y-position: ~`TARGET_H - 72px`.

4. **Vignette Gradient Protection (Slides 2 to N):**
   - Dual-zone linear gradient overlays applied before text rendering:
     - Top dark gradient: Height `320px`, alpha curve tapering to protect headline contrast.
     - Bottom dark gradient: Height `280px`, alpha curve ramping up to protect subtitle & footer contrast.

5. **Standardized 8-Slide Story Arc:**
   - **Slide 1:** Pure Minimalist Speisely Brand Page (Deep Forest Green + Centered Logo).
   - **Slide 2:** The Hero Feast / Table Spread (Hook + Location + "Swipe >>").
   - **Slide 3:** Signature Starter or Streetfood Item (e.g. Bulgogi Mandu, Hawawshi, Samosa).
   - **Slide 4:** Core Specialty / Crisp Craftsmanship (e.g. Golden Fried Chicken, Slow Roast).
   - **Slide 5:** The Showstopper Glaze / Signature Main (e.g. 20-Zutaten Secret Sauce, Silver Grill).
   - **Slide 6:** Cultural Side Dish / Cult Favorite (e.g. Rosé Tteokbokki, Molokhia).
   - **Slide 7:** Contrasting Flavor / Texture (e.g. Cheesling Snow Powder, Artisanal Mezze).
   - **Slide 8 (Outro):** Verified Location + Full Address + Opening Hours + Halal/Dietary Badges + Follow & Save CTA.

---

## 13. Mandatory High-Engagement Instagram Caption & Copywriting Standard (Clean Creator SEO Formula)

Whenever writing Instagram post captions, Reels copy, or partner spotlight copy for Speisely, NEVER write dry, corporate texts, BUT DO NOT spam emojis or 30 hashtags. Follow the **Modern Instagram Algorithm Standards (Search & Semantic Discovery)**:

1. **The 2026 Algorithm Truth (Why Excessive Emojis Harm Performance):**
   - **Semantic Search NLP:** Instagram and Google crawl captions as text keywords. Wall-of-emoji text fragments sentence parsing and lowers keyword confidence score.
   - **Spam Filter Trigger:** 15+ emojis or repetitive brackets (`🔥👑✨`) can trigger low-quality/engagement-bait flags.
   - **Quality & Prestige:** Speisely is a high-end food & catering platform. 3 to 6 purposeful emojis maintain high readability, luxury aesthetics, and creator energy without looking like spam.
   - **Hashtags:** Maximum **3 to 5 targeted keywords** (Instagram officially de-prioritized 30-tag clouds in favor of natural in-caption SEO).

2. **Standardized 5-Part Structure:**
   - **Part 1: The Keyword Hook (First 100 characters):** Contains the primary search query (e.g. _Ägyptisches Restaurant Berlin_, _Halal Food Berlin_, _Catering München_) before the "...more" cut.
   - **Part 2: Sensory Storytelling (Short, punchy lines):** 2–3 mouthwatering sentences explaining the craft, taste, and atmosphere.
   - **Part 3: 3 Clear Dish Highlights (Clean Bullet Points):** Max 1 emoji per bullet point.
   - **Part 4: Restaurant Facts & Verification:** Name, address, opening times, dietary status (100% Halal).
   - **Part 5: Single Follow CTA + 3-5 Targeted SEO Hashtags:** Clear call to follow `@speisely` and save the post.

---

## 14. Mandatory Supabase Health & Disk Protection Rule (Zero-Bloat Standard)

To ensure the production Supabase instance (`athwccvgdovglcpluwnu`) NEVER exhausts disk space, WAL segments, or Nano compute limits and never becomes `UNHEALTHY`:

1. **Zero High-Frequency `pg_cron` or `pg_net` Polling Jobs:**
   - **STRICTLY FORBIDDEN:** Never schedule `pg_cron` jobs running every minute (`* * * * *`), every few minutes (`*/5 * * * *`), or on second-level intervals.
   - **STRICTLY FORBIDDEN:** Never invoke `net.http_post` or `net.http_get` (`pg_net`) inside recurring `pg_cron` loops, as every invocation writes rows into `cron.job_run_details`, `net._http_response`, and 16 MB PostgreSQL WAL files (`pg_wal`) that will fill the 8 GB disk and crash PostgreSQL (`ECONNREFUSED :5432`).

2. **Mandatory Daily Log Retention Purge:**
   - The `cleanup-cron-and-net-logs` daily retention job (`0 4 * * *`) purging `cron.job_run_details` (>24h) and `net._http_response` (>1h) must remain active at all times.
   - PostgreSQL configuration must maintain `"cron.log_statement": false`, `"pg_net.batch_size": 0`, and `wal_keep_size: "1MB"`.

3. **No Unbounded Database Logging or Base64 Media in Tables:**
   - Never store raw Base64 images, PDFs, or large binary blobs in PostgreSQL `text` or `jsonb` columns; store static assets in `public/` or Supabase Storage buckets with WebP compression.
   - Never write per-request telemetry, polling heartbeats, or debug logs into PostgreSQL tables.

4. **Read-Only & Cached Public Storefront Queries:**
   - Public routes (`/`, `/catering`, `/restaurants`, `/planner`, `/magazin`, `sitemap.xml`) must never perform database writes (`INSERT`, `UPDATE`, `DELETE`) on page loads and must rely on in-memory TTL caching (60s SWR) and graceful static fallbacks so traffic spikes never overload Supabase compute.

5. **Automated Build Gate Enforcement (`verify:graph` Rule 13):**
   - `scripts/verify_agent_graph.js` automatically audits `supabase/migrations/*.sql` on every build and blocks any migration containing minute-level `pg_cron` schedules or `pg_net` HTTP loops.

---

## 15. Mandatory Database & API Security Safeguard Rule (Zero-Trust RLS & RPC Standard)

To protect all customer, partner, order, and payment data in Supabase (`athwccvgdovglcpluwnu`) from unauthorized access, privilege escalation, or disk-spam attacks:

1. **100% Row-Level Security (RLS) Coverage (`rls_off: 0`):**
   - Every table in the `public` schema (including `_archive_*`, logs, and webhook tables) MUST have `ENABLE ROW LEVEL SECURITY` active at all times.
   - Never create a table in `public` without enabling RLS in the exact same migration.

2. **Strict `service_role` Isolation for Webhooks & Internal Tables:**
   - Policies meant for backend-only tables (`stripe_webhook_events`, `_archive_*`, internal queues) MUST explicitly specify `TO service_role` — NEVER leave out the `TO` clause (which defaults to `PUBLIC` / `anon` in PostgreSQL).
   - Never expose `SUPABASE_SERVICE_ROLE_KEY` or import `supabaseAdmin` inside client-side route or UI component files (`src/routes/`, `src/components/`).

3. **Zero Unauthenticated `SECURITY DEFINER` RPC Execution:**
   - PostgreSQL grants `EXECUTE ON FUNCTION ... TO PUBLIC` by default. Every `SECURITY DEFINER` function MUST immediately run:
     - `ALTER FUNCTION ... SET search_path = public;` (prevents schema-shadowing attacks).
     - `REVOKE EXECUTE ON FUNCTION ... FROM PUBLIC, anon;` (and revoke `authenticated` as well if the function is backend-only like `decrement_surplus_stock`).

4. **Security Invoker Views (`security_invoker = true`):**
   - Every SQL view in `public` (e.g. `public.planner_requests`) MUST set `WITH (security_invoker = true)` so queries always enforce the calling user's RLS policies rather than bypassing RLS as the view owner.

5. **No Wide-Open `WITH CHECK (true)` Public Insert Policies on Core Tables:**
   - Never add `FOR INSERT TO public WITH CHECK (true)` on user/partner/order tables (`profiles`, `caterers`, `restaurants`, `planners`, `orders`). Database triggers (`handle_new_user`) already run as `SECURITY DEFINER` and do not need open public RLS policies.

6. **Automated Build Gate Enforcement (`verify:graph` Rule 14):**
   - `scripts/verify_agent_graph.js` (Rule 14) automatically audits migrations and client routes on every build and halts compilation if any RLS, `SECURITY DEFINER`, `service_role`, or client-bundle secret rule is violated.

---

## 16. Mandatory Instagram Reel 10/10 Creator Masterclass & Safe Zone Standard

Whenever generating, animating, or rendering vertical 9:16 video reels (`1080 x 1920 px`) for Instagram, TikTok, or YouTube Shorts:
Never treat a video as an automated slideshow. You MUST strictly adhere to the **Instagram Native App Interface Safe Zones** and the **10/10 Creator Masterclass Rules**:

1. **Top Exclusion Zone (Y: 0 px to 260 px — STRICTLY BLANK OF TEXT/LOGOS):**
   - **Why:** The Instagram app overlays device status bars (notch/island, clock, battery), navigation buttons (`< Posts`), the profile picture circle, account username (`speisely`), follow button, and active music/audio title marquee inside `Y = 0` to `Y = 260 px`.
   - **Rule:** ALL badges, headlines, and logos MUST sit at or below `Y = 280 px`. Zero text or logos are allowed in the top 260 px.

2. **Bottom Exclusion Zone (Y: 1520 px to 1920 px — STRICTLY BLANK OF TEXT/CARDS):**
   - **Why:** The Instagram app overlays the post caption (first 2-3 lines before "...more"), account tag, audio sticker, right-hand mute speaker button (`X: ~960, Y: ~1700`), engagement action bar (Like, Comment, Share, Bookmark), and mobile gesture home bar.
   - **Rule:** ALL action buttons, Dossier fact sheets, and call-to-action pills MUST sit at or above `Y = 1450 px`. Zero typography or interactive cards may enter the bottom 400 px.

3. **Right Sidebar Margin Protection (X > 940 px):**
   - In full-screen Reels viewer, the vertical action stack (Heart, Comment bubble, Share paper plane, Remix icon, Sound disc) occupies the rightmost 140 px. Keep all critical headlines and text centered or within `X = 80 px` to `X = 940 px`.

4. **The Second-0 Food Hook Rule (Viewer Retention):**
   - Never start a food reel with empty rooms, trees, or exterior buildings.
   - Scene 1 (0.0s – 2.2s) MUST open with a mouth-watering, high-impact hero dish (oozing egg yolk, caramelized brioche crust, sizzling grill meat) with an energetic push-in zoom and a bold location pill to halt the user's thumb before the 1.2s drop-off point.

5. **Dynamic Pan-and-Scan (No Brutal 60% Crop):**
   - When fitting 4:3 landscape assets into 9:16 vertical fullbleed, never rely on static crops that cut off 58% of the plate.
   - Use dynamic camera movement: **smooth vertical tilt-ups** (e.g. panning from avocado toast up to the poached egg) or diagonal sweeps to reveal the entire dish dynamically.

6. **WCAG Contrast Containers (Zero Naked Floating Text):**
   - Never float bare yellow or white text over bright ceramic plates or food sauces.
   - All lower descriptors and call-to-actions MUST be enclosed in frosted obsidian pill containers (`bg=(15, 25, 20, 200)` with gold/white outline) to guarantee crisp readability on any background.

7. **Video-Native Micro-Copy (Zero Carousel "Swipe >>"):**
   - Never use "Swipe >>" on a video reel (swiping horizontally exits the reel).
   - Use video-native cues: _"Bleib dran für alle Highlights »"_, _"Perfekt fließender Dotter-Moment »"_, _"Dampfendes Fladenbrot frisch aus dem Ofen »"_.

8. **Zero Slide Counters (`1/6`, `2/6`) on Video:**
   - Slide counters belong to Carousels. On Reels, they make the video look like an automated slideshow. Omit slide counters entirely on video reels.

9. **Zero Missing Emoji Glyphs (Square Boxes `□`):**
   - Never inject raw Unicode emojis into PIL TrueType fonts (`arial.ttf`, `georgia.ttf`) on Windows, as they render as blank square glyphs (`□`).
   - Use clean luxury typographic editorial symbols (`·`, `»`, `✦`) and native UTF-8 German characters (`ä`, `ö`, `ü`, `ß`).

10. **Mandatory Speisely Brand Seal Outro (1.5s – 2.0s):**
    - Every Reel MUST end with the iconic Speisely Signature Outro:
      - Pure Deep Forest Green canvas (`#083822`).
      - Centered golden Speisely circular emblem (`160x160` with soft pulse).
      - Spaced serif typography: `S P E I S E L Y` in Ivory Cream.
      - Authority subtitle: `Verifizierte Gastro-Kultur · Berlin`.
      - High-converting algorithm trigger: `Folge @speisely für die besten Food-Spots in Berlin`.

11. **Standard 1080 × 1920 Safe Zone Coordinate Grid:**
    - **Top Category / Spotlight Badge:** `Y = 280 px` to `Y = 295 px` (Centered pill).
    - **Main Headline (Georgia Bold):** `Y = 350 px` to `Y = 365 px`.
    - **Sub-headline / Descriptor:** `Y = 430 px` to `Y = 445 px`.
    - **Central Gastro-Dossier Fact Card (Scene 6):** `Y = 485 px` to `Y = 945 px` (`width: 880 px, height: 460 px`) over a blurred atmospheric background.
    - **Bottom Dish Highlight Pill:** `Y = 1350 px`.
    - **Bottom Primary Call-to-Action Pill:** `Y = 1430 px` (Centered pill).
    - **Brand Seal Outro Canvas (Scene 7):** Center logo at `Y = 620 px`, Title at `Y = 820 px`, CTA at `Y = 1380 px`.

12. **Mandatory Visual Inspection against Instagram Interface:**
    - The agent MUST save preview frames (`reel_preview_scene*.jpg`) at scene zeniths and inspect them using `view_file` to verify zero clipping, crisp contrast, and zero missing glyph boxes before reporting completion.

---

## 17. Mandatory Mobile-First Responsive UX/UI Standard (375px Viewport Audit)

Whenever designing, auditing, or refactoring public routes, magazine articles, or storefront components:
Never assume desktop-first layout proportions. Every implementation MUST be verified on a compact mobile screen (`375 x 812 px`, iPhone standard):

1. **Top Sticky Navigation Protection:**
   - Back links (`← Speisely Magazin`), category tags, and the `<LanguageToggle />` component must never collide, overlap, or wrap onto each other.
   - Long category badges must be hidden on mobile screens (`hidden sm:inline-block`) to preserve space for language switching and navigation.

2. **Zero Multi-Line Badge Overflow:**
   - Category and spotlight pills in hero headers or photo overlays must use responsive typography (`text-[10px] sm:text-xs`) and hide secondary descriptors on mobile (e.g. `hidden sm:inline`) to prevent multi-line wrapping and padding distortion.

3. **Harmonious Container Padding & Drop-Caps:**
   - Use progressive padding (`p-5 sm:p-8 md:p-10`) so cards and fact sheets do not squeeze canvas space on 375px screens.
   - Editorial drop-caps must use proportional mobile sizing (`text-5xl sm:text-7xl leading-[0.85] mr-3 sm:mr-4`) to eliminate collision with wrapped body text.

---

## 18. Mandatory Social & Editorial Visual Brand Consistency Standard (The 60-30-10 Palette & Grid Rule)

Whenever creating, generating, or auditing ANY magazine article, Instagram Reel, social carousel, or public promotional asset:
You MUST enforce absolute visual brand consistency so the Speisely brand immediately communicates Michelin/Vogue-level prestige:

1. **Strict 60-30-10 Color Palette (Zero Random Colors Allowed):**
   - **60% Primary Canvas:** Speisely Deep Forest Green (`#083822` / `rgb(8, 56, 34)`). Anchors backgrounds, video overlays, and brand headers.
   - **30% Secondary Accent:** Warm Ivory Cream (`#F6F4EB`). Used for high-contrast headline text, magazine spreads, and clean container borders.
   - **10% Luxury Highlight:** Speisely Antique Gold (`#E6B84A`). Reserved strictly for verified badges, category pills (`SPEISELY SPOTLIGHT`), rating stars, and call-to-action buttons.
   - _Prohibition:_ Never use random blues, purples, or loud neon colors on covers, thumbnails, or official slides.

2. **Strict Two-Font Typographic Hierarchy:**
   - **Prestige Headlines:** Classic Editorial Serif (strictly `Playfair Display` or `Georgia Bold`). Never use playful, script, or novelty fonts for food titles.
   - **Badges, Pills & Body Text:** Modern Clean Sans-Serif (strictly `Plus Jakarta Sans` or `Arial Bold` in uppercase tracking).

3. **Mandatory Dedicated Reel Covers (No Random Frame Thumbnails):**
   - Never allow Instagram or TikTok to default to a random, blurry mid-video frame for profile grid previews.
   - Every video reel generated MUST export a dedicated 9:16 portrait cover graphic featuring the deep forest green vignette, centered signature dish, and gold category pill.

4. **Curated Profile Grid 3-Way Rhythm (Checkerboard Standard):**
   - When staging content for `@speisely`, rotate across 3 alternating visual pillars:
     1. _Macro Sensory Food Action:_ Crisp close-up (egg yolk break, syrup drizzle, layered pastry cut).
     2. _Editorial / Brand Card:_ Deep forest green graphic with gold quote, restaurant fact, or 0% commission insight.
     3. _Architectural Interior:_ Sunlit restaurant atmosphere, marble tables, and welcoming space.

5. **Pre-Publishing Gate:**
   - No article, reel, or carousel may be published or delivered to the user without verifying:
     a) 60-30-10 color compliance,
     b) Serif + Sans-Serif font pairing,
     c) Official Speisely logo emblem on the opening and closing slides.

---

## 19. Mandatory Anti-AI Writing Framework & "Speisely Pro" Voice Standard

Whenever writing, editing, or auditing ANY Speisely article, Community Story, or partner feature:
You MUST enforce the "Speisely Pro" voice standard. Robotic, generic AI-style prose is strictly forbidden:

1. **Strict Prohibition of AI Hallmarks & Clichés:**
   - _BANNED:_ `nestled in the heart of`, `culinary journey`, `symphony of flavors`, `tapestry of tastes`, `hidden gem`, `food paradise`, `tantalize your tastebuds`, `delicious treats`, `testament to passion`, `whether you're a foodie or...`.
   - _REPLACEMENT:_ Use concrete geographic anchors (street names, transit steps), precise flavor descriptions (acidity, roast, salinity, smoke), and physical room dimensions.

2. **The "Lindt" Micro-Sensory Physics Rule:**
   - Ban cheap adjectives (_lecker, tasty, delicious, amazing_).
   - Describe physical textures and tactile mouthfeel: _samtig-dicht, schmelzend, kristallin aufbrechend, feucht-elastische Krume, viskoser Dattelsirup_.

3. **Dynamic Sentence Cadence ("Burstiness"):**
   - Never write consecutive sentences of equal length.
   - Alternate between sharp 2-to-4 word punchy statements (_„Warm. Duftend. Dann folgt der Schmelz.“_) and rich, multi-clause culinary observations.

4. **Artisanal Craft & Verified Price Transparency:**
   - Focus on tangible culinary craft: traditional hand-techniques (e.g. stretching phyllo with pear-wood oklava), authentic regional origin, and genuine ingredients.
   - If stated on the menu, include transparent prices (_„die Mezze-Platte für 39 Euro“_). Never fabricate technical metrics, temperatures, or layer counts.
5. **Independent Diner Perspective (The Table POV):**
   - Write from the unannounced, self-funded diner's perspective sitting at the table.
   - Never write as a promotional company mouth-piece or uncritical PR brochure. Include honest, grounded operational nuances (e.g. peak arrival times or bold flavor profiles).

6. **Pre-Publishing Gate:**
   - [ ] Zero banned AI clichés.
   - [ ] Sentence burstiness verified (mix of short and long rhythms).
   - [ ] Zero fabricated numbers; only verified menu prices if known.
   - [ ] Independent guest threshold opening verified.

---

## 20. Mandatory Truth-in-Editorial, Anti-Numerical & Visual Integrity Standard (Policy for All Articles)

Whenever writing, editing, or auditing ANY Speisely article, Community Story, or culinary review:
You MUST enforce strict truthfulness, grounded human observation, zero artificial specifications, and unobstructed visual presentation:

1. **Zero Forced or Invented Numerical Claims (Anti-Numerical Standard):**
   - **STRICTLY PROHIBITED:** Never invent, calculate, or force technical numbers, arbitrary oven temperatures (e.g. _„exakt 200°C“_), artificial layer counts (e.g. _„40 Schichten“_), fabricated time limits (e.g. _„innerhalb der ersten 4 Minuten verzehren“_), shelf-life days (e.g. _„bis zu 5 Tage haltbar“_), or artificial numerical rating scores (e.g. _„9.8 / 10“_).
   - If a culinary metric is not explicitly stated on the restaurant's printed menu or directly confirmed by the kitchen, **omit the number entirely**. Let the sensory description, texture, and dining atmosphere carry the article.
   - For ratings: Use qualitative community endorsements (_„Speisely Community Empfehlung: Handwerkliche Antep-Tradition...“_) instead of arbitrary numerical scores.

2. **Zero In-Image Floating Badges / 100% Unobstructed Food Photography:**
   - **STRICTLY PROHIBITED:** Never position badge pills, tag chips, or text overlays on top of food photographs (`absolute top-3 left-3` or anywhere covering the image canvas). Discerning foodies come for the food; obscuring the product damages visual appeal.
   - Badges and category tags MUST be placed:
     - In card bodies: Above the headline inside the card content (`<div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-[#083822]/10 text-[#083822] w-fit">`).
     - In standalone figures: Inside the caption bar beneath the photo frame.

3. **Mandatory Community Disclosure Placement (Strictly at the End, Never at the Top):**
   - Every community-submitted article must include a clear, transparent disclosure note stating:
     - The story is based on an authentic on-site visit shared by a Speisely community member.
     - The visuals combine genuine table snapshots from the diner with high-definition presentations from the venue's official media to faithfully showcase the culinary craft.
     - All dishes were independently ordered and paid for.
   - **STRICT PLACEMENT RULE:** The disclosure note MUST sit **strictly at the very end of the article** (as an editorial endnote `<aside>` directly beneath the Gastro Dossier and right above the partner onboarding bridge).
   - **NEVER** place the disclosure in the hero, under the main headline, or anywhere near the top of the reading journey.

4. **Zero Phantom Ingredients & Strict Image-Text Truth:**
   - What you write must strictly match what the reader can see in the photo.
   - Never speculate on exotic ingredients or garnish toppings that cannot be visually verified from the actual dish photo or confirmed menu (e.g. do not invent avocado garnishes, secret syrups, or special oils unless visibly present or officially confirmed).
   - Before writing dish copy or captions, inspect the photo and describe only what is authentically present.

5. **Grounded Editorial Voice (No Owner PR & No "Claiming Extra"):**
   - Frame the review from the perspective of an observant, independent guest who paid for their own meal.
   - Never write like a paid PR brochure, marketing spokesperson, or uncritical promoter.
   - Never use exaggerated hyperbole such as _„so dünn, dass man eine Zeitung durchlesen kann“_ or claims of culinary perfection.
   - Include grounded operational nuances (e.g. busy weekend hours or bold acquired flavors).

---

## 21. Mandatory Spec-Driven Development & Plan Standard (`docs/plans/`)

Whenever implementing a new feature, flow, checkout process, or non-trivial architectural change:
You MUST follow the 4-phase product development lifecycle:

1. **Phase 1: Interrogation Gate (`/grill-me`):**
   - Never write code on Prompt #1.
   - Run the `/grill-me` protocol: actively interview the human on edge cases, permissions, empty states, and technical constraints.
   - Use the `ask_question` interactive modal tool, always prefixing the recommended option with `(Recommended)`.

2. **Phase 2: Formal PRD & Design Panel:**
   - Write an inspectable Product Requirements Document (PRD) and save it to:
     `docs/plans/YYYY-MM-DD-[feature-name]-prd.md`
   - When designing UI, spawn a 3-agent specialist panel:
     - UX Designer (flow, empty states, loading states).
     - Accessibility Specialist (WCAG AA 4.5:1 / AAA 7:1 contrast, mobile tap targets >= 44px).
     - Visual Designer (strictly locked to `docs/DESIGN.md` tokens).
   - Specialized findings MUST be saved to `docs/plans/disciplines/`.

3. **Phase 3: Technical Architecture Spec & Finite State Machines:**
   - Save the approved technical architecture to:
     `docs/plans/YYYY-MM-DD-[feature-name]-architecture.md`
   - Interactive components (checkouts, reservations, modals) MUST explicitly declare their finite state machines:
     e.g., `IDLE -> EDITING -> VALIDATING -> EXECUTING -> SUCCESS / ERROR`
   - State flow must be visualized with Mermaid diagrams.
   - Prefer modern platform primitives (native `<dialog>`, CSS container queries, native fetch) over adding new npm packages.

4. **Phase 4: Dual-Review Subagent Gate (Requirements Auditor + Mean Critic):**
   - After code generation, spawn 2 review subagents before presenting results:
     - **Requirements Auditor:** Verifies every single PRD requirement was implemented.
     - **The "Mean Goldfish Critic":** An adversarial, zero-ego review specifically hunting for race conditions, unhandled async promises, Supabase WAL bloat, and RLS security holes.

---

## 22. Immutable Test Suite & Schema Protection (Anti-Cheating Standard)

When resolving bugs or test failures:

- **STRICTLY FORBIDDEN:** An agent must NEVER weaken validation schemas (Zod/TypeScript), loosen Supabase RLS policies, or comment out/alter existing test assertions in `tests/` just to achieve a passing build.
- The agent is **REQUIRED** to fix the implementation code itself until the existing strict test suite and schemas pass.

---

## 23. Design System Token Contract Enforcement (`docs/DESIGN.md`)

Every UI component generated or modified for Speisely MUST adhere strictly to `docs/DESIGN.md`:

- **Colors:** Deep Forest Green (`#083822`), Warm Gold (`#E6B84A`), Creamy Ivory (`#F6F4EB`), Alabaster White (`#FFFFFF`).
- **Typography:** Refined Editorial Serif (Georgia/Playfair) for headlines; Modern Sans (Inter) for UI labels and body.
- **Card Styling:** `rounded-3xl border-2 border-[#083822]/15 bg-white p-4 sm:p-6 shadow-xl` with passe-partout inner padding.
- **Zero Food Obstruction:** Badges and pills MUST NEVER float over food photos. Discarded or floating overlay badges are strictly forbidden.

---

## 24. Mandatory Google PageSpeed 90+ & WCAG AAA Accessibility Standard (Zero Performance Regression Policy)

To ensure Speisely permanently retains top-tier Google PageSpeed Insights ratings (100 SEO, 100 Best Practices, 100 Accessibility, 90+ Performance, 3/3 Agentic Browsing) across both Mobile and Desktop:

1. **Zero Render-Blocking Font Preloads:**
   - **STRICTLY FORBIDDEN:** Never add `<link rel="preload" as="style" ...>` pointing to Google Fonts or external CSS sheets in `__root.tsx` or route heads. External fonts must be loaded purely non-blocking via `media="print" onload="this.media='all'"` with `<noscript>` fallback, or rely on system font fallbacks to preserve sub-second First Contentful Paint (FCP).
   - Preconnect links are permitted strictly to `https://fonts.googleapis.com` and `https://fonts.gstatic.com` (with `crossOrigin: "anonymous"`).

2. **Mandatory LCP Image Sync Decoding & Preloading:**
   - Any above-the-fold or hero image declared as the Largest Contentful Paint (LCP) candidate (`fetchPriority="high"` / `fetchpriority="high"`) MUST explicitly declare `decoding="sync"`.
   - Never use `decoding="async"` on LCP images, as it introduces a >1,800 ms browser Element Render Delay on mobile devices.
   - Hero images must include a matching `<link rel="preload" as="image" type="image/webp" media="...">` declaration in `Route.head` to trigger early browser fetch before layout parsing.
   - When a dedicated mobile hero asset exists (e.g. `hero-cinematic-mobile.webp`), never allow the desktop master asset to prefetch on mobile viewports; isolate via media queries (`media="(max-width: 768px)"` vs `media="(min-width: 769px)"`).

3. **High-Density WebP Image Standard & Asset Budgets:**
   - **STRICTLY FORBIDDEN:** Never commit or reference raw uncompressed PNGs or JPEGs (>250 KB) on public storefront, catering, restaurant, planner, case study, or magazine routes.
   - All public imagery must be encoded as WebP (or AVIF) with maximum budget of **350 KB** for high-density retina master heroes and **<75 KB** for cards, menu items, and thumbnails.
   - Always enclose multi-column or mobile card photos in responsive `<picture>` elements to serve compact resolutions to phone viewports.

4. **100% WCAG AAA Contrast & Link Disambiguation:**
   - All interactive elements (buttons, links, inputs, badges) must meet or exceed WCAG 2 AA minimum contrast (4.5:1) and target WCAG AAA (7:1).
   - Never use opacity tokens like `text-white/40`, `text-forest/50`, or low-contrast emerald tints on readable body text or interactive labels.
   - Generic action links (e.g., "Case Study", "Partner werden", "Jetzt anfragen") must ALWAYS declare a descriptive `aria-label` attribute (e.g., `aria-label="Case Study Partyservice Küpper lesen"`) so screen readers and automated accessibility engines never encounter ambiguous link descriptions.
   - Headings must maintain strict sequential order (`h1` ➔ `h2` ➔ `h3`), never skipping heading levels.

5. **Agentic Browsing (`llms.txt`) Standard:**
   - All entries in `public/llms.txt`, `public/llms-full.txt`, and `src/routes/llms[.]txt.ts` must adhere to standard Markdown link syntax: `- [Page Title](https://speisely.de/path): Plain text summary`.

6. **Automated Compiler Enforcement (`verify:graph` Rule 16):**
   - `scripts/verify_agent_graph.js` (Rule 16) automatically audits font preloads, LCP sync decoding, asset size budgets, and link accessibility on every build. Any violation halts `npm run build` immediately before code can be deployed.

---

## 25. Mandatory Social Media Cross-Linking & Fast-Index Standard (The 24-Hour Social Synergy Rule)

To maximize Google Search indexing speed, Google Perspectives carousel inclusion, and Brand E-E-A-T authority whenever publishing new public content:

1. **The 24-Hour Cross-Publishing Protocol:**
   - Whenever ANY new **Speisely Visit**, **Community Partner Story**, **Case Study**, or major **Blog Article** is published live on `https://speisely.de`:
     - **Instagram Action:** Within 24 hours, publish a companion Instagram Carousel (following Section 12) or Reel (following Section 16). The post caption MUST follow Section 13 (Keyword Hook in first 100 chars, max 3-5 keywords, no emoji wall), tag the partner's Instagram handle, and link back to the exact article URL (`speisely.de/magazin/...` or `speisely.de/case-study/...`) in the profile bio or stories.
     - **LinkedIn Action:** Within 24 hours, publish a companion B2B post on the official Speisely LinkedIn page (`https://www.linkedin.com/company/speisely`) sharing the case study or visit, highlighting business metrics, and linking directly to the canonical URL.
     - **Why:** Google's crawling algorithms monitor simultaneous cross-platform publication across verified entities (`sameAs`). When a new website URL receives immediate referral traffic and social citations from verified LinkedIn and Instagram channels, Googlebot accelerates crawl priority and bypasses long "Discovered - currently not indexed" queues.

2. **Entity Consistency & NAP Uniformity:**
   - The brand name (**Speisely**), website URL (**`https://speisely.de`**), and core description across Instagram bio, LinkedIn company page, and Google Search Console must remain 100% synchronized with Schema.org `Organization` metadata.
   - Never reference speculative social channels (e.g. unverified Facebook or TikTok profiles) in structured data or code until officially created and active.

3. **In-Caption Keyword Matching:**
   - Social post captions must include the primary localized transactional keyword targeted by the webpage (e.g. *Catering Berlin*, *Halal Food Berlin*, *Catering München*, *Eventplanung Frankfurt*) within the first 100 characters to maximize Google SERP Perspectives ranking.
