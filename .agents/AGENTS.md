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
2. `docs/PROJECT_TRUTH.md`
3. `docs/EDITORIAL_STYLE_GUIDE.md`
4. `docs/DECISIONS.md`
5. `docs/PERFORMANCE_RULES.md`
6. `docs/ACTIVE_WORK_NOTES.md`

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
  1. *Clipping & Cropping Check:* Ensure no header, title, or folio is clipped or hidden behind navigation/toolbars.
  2. *Whitespace Balance Check:* Ensure no accidental blank voids (>20% of vertical canvas) remain unutilized.
  3. *Typography Collision Check:* Ensure no overlapping text, broken line wraps, or unreadable contrasts.
  4. *Asset Health Check:* Ensure all images are loaded, crisp, and aspect-ratio locked (no naturalWidth === 0).
  5. *State & Translation Check:* Ensure interactive controls (like DE/EN toggle) switch copy cleanly with zero reload.
- **Node 5 (Feedback Loop):** If Node 3, Node 4, or Node 4.5 fails ANY check, automatically loop back to Node 2 to correct the root cause *before* presenting results to the user. Never ask the user to visually QA uninspected layouts.

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
4. **Food Badge Overlays & Cache-Busting:**
   - Include floating frosted-glass food badges (`🍫 Signature...`, `🔥 Slow Fried...`) on the top-left of figures.
   - Always append cache-busting query strings (`?v=2`) to image paths so client browsers never display stale or unsharpened assets.

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
   - **Part 1: The Keyword Hook (First 100 characters):** Contains the primary search query (e.g. *Ägyptisches Restaurant Berlin*, *Halal Food Berlin*, *Catering München*) before the "...more" cut.
   - **Part 2: Sensory Storytelling (Short, punchy lines):** 2–3 mouthwatering sentences explaining the craft, taste, and atmosphere.
   - **Part 3: 3 Clear Dish Highlights (Clean Bullet Points):** Max 1 emoji per bullet point.
   - **Part 4: Restaurant Facts & Verification:** Name, address, opening times, dietary status (100% Halal).
   - **Part 5: Single Follow CTA + 3-5 Targeted SEO Hashtags:** Clear call to follow `@speisely` and save the post.






