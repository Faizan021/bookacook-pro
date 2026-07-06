# Auto-Remediation Implementation Plan

## Architecture Overview

All three features are implemented as **isolated component files** that are imported and registered as new tabs in the restaurant dashboard. This avoids parallel write conflicts.

## File Map

### Feature 1 — Competitor Map Trigger
- **NEW** `src/components/geo/CompetitorMonitor.tsx` — Full UI + generation logic
- **MODIFY** `src/routes/_authenticated/restaurant.tsx` — Add `geo` tab render
- **MODIFY** `src/components/vendor/VendorLayout.tsx` — Add `geo` nav item

### Feature 2 — Geo-Targeting Cluster Engine
- **NEW** `src/components/geo/GeoTargetingEngine.tsx` — Setup form + city cross-reference + copy generator
- **MODIFY** `src/routes/_authenticated/restaurant.tsx` — Add `geo-targeting` tab render
- **MODIFY** `src/components/vendor/VendorLayout.tsx` — Add `geo-targeting` nav item

### Feature 3 — Automated Re-Scroller
- **NEW** `src/components/geo/SitemapMonitor.tsx` — Background poller + countdown progress bar
- **MODIFY** `src/routes/_authenticated/restaurant.tsx` — Inject monitor into `OverviewSection`

## Integration Notes
- VendorLayout nav: add `{ id: "geo", label: "AI Sichtbarkeit", icon: Globe }` and `{ id: "geo-targeting", label: "Geo-Targeting", icon: MapPin }` to the `restaurant` array
- restaurant.tsx tab switcher: add `{currentTab === "geo" && <CompetitorMonitor />}` and `{currentTab === "geo-targeting" && <GeoTargetingEngine />}`
- SitemapMonitor: embedded inside OverviewSection as a dashboard card
