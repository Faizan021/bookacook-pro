---
name: qa-visual
description: Launch headless Chromium via Playwright across Desktop (1440px), Laptop (1280px), and Mobile (375px) viewports to visually verify UI changes against the 5-Point Human-Eye Rubric.
---

# /qa-visual — Agentic Browser Visual Regression Gate

When invoked, the agent MUST:

1. Execute `npm run qa:visual` to capture real headless screenshots across Desktop (1440x900) and Mobile (375x812).
2. Grade the captured viewports against the **5-Point Human-Eye Rubric**:
   - **Clipping & Cropping:** Confirm no header, title, or navigation element is clipped.
   - **Whitespace Balance:** Verify no large accidental empty voids (>20% vertical canvas).
   - **Typography Collision:** Check for overlapping text or broken line wraps.
   - **Asset Health:** Confirm all images load crisp with standard aspect ratio (no naturalWidth === 0).
   - **State Consistency:** Verify modals, drawers, and language switches update cleanly.
3. If any check fails, block the build and correct the root cause immediately.
