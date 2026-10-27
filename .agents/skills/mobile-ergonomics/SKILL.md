---
name: mobile-ergonomics
description: Mandatory Mobile Viewport Ergonomics & Zero-Clip Standard for Speisely across 360px and 375px mobile viewports, including touch target accessibility and responsive action stacking.
---

# Speisely Mobile Viewport Ergonomics & Zero-Clip Standard

Follow these rules whenever designing, coding, or auditing responsive frontend layouts on Speisely.

---

## 1. Zero-Clip Viewport Standard (360px Android & 375px iOS)

1. **Strictly Zero Horizontal Scroll:**
   - Any layout must verify `scrollWidth === clientWidth === innerWidth` on mobile viewports down to 360px width.
   - Never allow fixed-width container elements or `whitespace-nowrap` text spans that cause right-edge clipping under `overflow-x-hidden`.

2. **Responsive Button & Action Stacking:**
   - On viewports `< 640px` (`sm:`), paired action buttons (e.g. `[Für Genießer] [Für Partner]` or `[Anfragen] [Details]`) must use:
     - Full container width: `w-full`
     - Short mobile labels (e.g. `<span className="sm:hidden">Für Genießer</span>`)
     - Responsive stacking: `flex-col sm:flex-row gap-3`

3. **Touch-Target Accessibility (WCAG AAA):**
   - Every interactive element (buttons, toggles, form fields) must maintain a minimum touch target of **44 × 44 px**.

4. **Floating Action Buttons (FAB) & Safe Zones:**
   - Floating elements (like AI Concierge pills) must collapse into compact circular icons (`w-11 h-11`) positioned in safe corner margins (`bottom-4 right-4`) on mobile, leaving main body text 100% visible and unblocked.
