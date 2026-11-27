# Speisely Mobile Viewport & Task Delivery Standard

## 1. Overview & Problem Statement
In mobile environments (especially Android devices with viewports around 360px and iOS around 375px), unconstrained flex children, fixed-width grids, or multi-button clusters stacked over imagery lead to severe UX failures:
- Horizontal scrolling where `scrollWidth > clientWidth`.
- Truncated description sentences cut off at the right screen edge.
- Pushed-off or invisible action buttons (such as the `+` Add-to-cart button).
- Cluttered hero banners where action buttons obscure food photography.

This standard establishes mandatory architectural rules and automated agent gates to permanently eliminate these flaws.

---

## 2. The Mobile Viewport Standard (360px & 375px)

1. **Zero-Clip Grid & Flex Rules:**
   - Any flex container with text must enforce `min-w-0` on its child containers so text wraps naturally with `break-words`.
   - Never use `grid-cols-[1fr_auto]` without `min-w-0` and `overflow-hidden` on the card.
   - For menu items, prioritize a horizontal layout:
     - Left (flexible): Title, dietary badges, wrapped description, price.
     - Right (fixed): Food thumbnail (e.g. `w-20 h-20` on mobile) with the action button (`+` Add to Cart) positioned directly beneath it or clearly aligned.

2. **Clean Hero & Action Bar Separation:**
   - On mobile viewports (`< md:`), hero photography must remain unobstructed and cinematic.
   - Keep only sleek status badges (like `GEPRÜFT`) in the hero image.
   - Primary action buttons (`Zur Speisekarte`, `Tisch reservieren`) must be rendered in a dedicated mobile action row below the hero banner with minimum 44px touch targets.

3. **Official Asset Authenticity:**
   - When a partner provides an official brand logo or asset, it must be stored in `public/` (WebP + JPEG fallback) and linked across all data registries (`src/data/restaurants.ts`, `src/data/caterers.ts`).

---

## 3. Dedicated Verification Agents

Speisely deploys two specialized guardian agents for all frontend and partner updates:

1. **`mobile_viewport_guardian` (`.agents/agents/mobile_viewport_guardian/agent.md`):**
   - Audits DOM rendering on 360px and 375px screen widths.
   - Enforces `scrollWidth === clientWidth` and verifies that action buttons are within viewport bounds.

2. **`task_completion_verifier` (`.agents/agents/task_completion_verifier/agent.md`):**
   - Reconciles every individual requirement from user requests item by item.
   - Confirms asset presence, type safety, production build status, and smoke tests before marking any task as complete.

---

## 4. Automated Testing Script

Run the mobile storefront audit at any time with:
```bash
node scripts/verify_mobile_storefronts.cjs
```
Screenshots are saved to `scratch/mobile_audits/` for multimodal inspection.
