# Speisely Design System & Token Contract (`docs/DESIGN.md`)

This document is the authoritative design system contract for **Speisely Marketplace**.  
Every agent, engineer, and component generator must strictly adhere to the tokens and rules declared here to preserve our **Luxury Editorial Gastronomy** brand standard across web and mobile.

---

## 1. Brand Philosophy: Luxury Editorial Gastronomy

Speisely is not a generic SaaS tool or casual fast-food directory. Speisely is a prestigious, Michelin-grade culinary curation and event marketplace.
* **Tone:** Sophisticated, warm, authoritative, tactile, and appetizing.
* **Visual Metaphor:** The luxury culinary magazine (Passe-partout photo framing, serif editorial headlines, subtle warm paper tones, and polished gold accents).
* **Anti-Patterns:** No neon primary colors, no generic purple buttons, no raw un-bordered cards, and no obstructed food photos.

---

## 2. Color Primitives & Semantic Tokens

### Primary Palette (Core Identity)
| Token Name | Hex Code | Tailwind / CSS Variable | Purpose |
| :--- | :--- | :--- | :--- |
| **Deep Forest Green** | `#083822` | `var(--color-forest)` / `bg-forest` | Primary brand authority, headers, dark buttons, brand marks. |
| **Forest Light Tint** | `#0D4E30` | `bg-forest-light` | Hover states for primary green elements. |
| **Warm Gold** | `#E6B84A` | `var(--color-gold)` / `text-gold` | Premium accent, verified badges, active tabs, subtle card borders on hover. |
| **Gold Muted** | `#D4A338` | `border-gold-muted` | Focused inputs, divider rules, subtle luxury icons. |
| **Creamy Ivory** | `#F6F4EB` | `var(--color-ivory)` / `bg-ivory` | Soft page background, modal fills, card inner backgrounds. |
| **Alabaster White** | `#FFFFFF` | `bg-white` | Elevated card surfaces, crisp text on dark green surfaces. |

### Semantic Status Tokens (WCAG AA Compliant)
| Token Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Success Emerald** | `#1B7340` | Order confirmed, caterer verified, availability active. |
| **Urgent Amber** | `#C97A10` | Low surplus meal stock (e.g. *Only 2 portions left*). |
| **Error Crimson** | `#BA1A1A` | Validation failure, payment declined, form error. |
| **Charcoal Body** | `#1C241F` | Primary high-contrast body text on light backgrounds (12.5:1 ratio). |
| **Sage Slate** | `#526357` | Subtitle text, metadata, opening hours, secondary details. |

---

## 3. Typography Scales & Pairings

### Font Families
* **Editorial Serif (Headlines & Folios):** Georgia, Playfair Display, or native `font-serif`. Used for hero headlines, partner story titles, and section markers.
* **Modern Sans (UI Controls & Body):** Inter, system-ui, or native `font-sans`. Used for labels, pricing, navigation, form inputs, and long-form descriptions.

### Type Scale
| Role | Size / Line Height | Tracking | Font Weight | Family |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Display** | `3rem (48px)` / `1.15` | `-0.02em` | Bold (`700`) | Editorial Serif |
| **Section Title (H2)**| `2.25rem (36px)` / `1.2` | `-0.01em` | Bold (`700`) | Editorial Serif |
| **Card Heading (H3)** | `1.5rem (24px)` / `1.3` | `normal` | SemiBold (`600`) | Editorial Serif |
| **Subheading / Meta** | `0.875rem (14px)` / `1.4` | `+0.05em` | Medium (`500`), Uppercase | Modern Sans |
| **Body Large** | `1.125rem (18px)` / `1.6` | `normal` | Regular (`400`) | Modern Sans |
| **Body Standard** | `1rem (16px)` / `1.5` | `normal` | Regular (`400`) | Modern Sans |
| **Caption & Tags** | `0.75rem (12px)` / `1.4` | `+0.02em` | Medium (`500`) | Modern Sans |

---

## 4. Component Shapes & Elevation (Passe-Partout Standard)

### Card Radiuses & Padding
* **Standard Editorial Card:**
  `rounded-3xl border-2 border-[#083822]/15 bg-white p-4 sm:p-6 shadow-xl transition-all duration-300 hover:border-[#E6B84A] hover:shadow-2xl`
* **Sub-Containers & Pills:**
  `rounded-2xl` for form containers; `rounded-full` strictly for interactive chips and filter pills.

### Food Image Presentation (The Zero-Obstruction Rule)
* **Strict Aspect Ratio:** Standard `4:3` ratio (`aspect-[4/3]`) or `16:9` for wide banners.
* **Unobstructed Canvas:** NEVER overlay text chips or badge pills floating directly over food. Badges must sit cleanly in the card body text *above* or *below* the photo.
* **Passe-Partout Retina Frame:** Images must be encased with an inner border and subtle drop shadow to prevent desktop stretching.

### Interactive Buttons & Controls
* **Primary Action Button:**
  `inline-flex items-center justify-center rounded-2xl bg-[#083822] px-6 py-3.5 text-sm font-semibold text-[#F6F4EB] shadow-md transition-all duration-200 hover:bg-[#0D4E30] hover:shadow-lg active:scale-[0.98]`
* **Secondary / Gold Button:**
  `inline-flex items-center justify-center rounded-2xl border border-[#E6B84A] bg-[#F6F4EB] px-6 py-3.5 text-sm font-semibold text-[#083822] transition-all hover:bg-[#E6B84A] hover:text-white`
* **Filter Pills (Active / Inactive):**
  * *Active:* `rounded-full bg-[#083822] text-[#F6F4EB] px-4 py-2 text-xs font-semibold shadow-sm`
  * *Inactive:* `rounded-full border border-[#083822]/20 bg-white text-[#1C241F] hover:border-[#E6B84A] px-4 py-2 text-xs font-medium`

---

## 5. Responsive Viewport Constraints & Zero-Clip Ergonomics
* **Mobile (360px - 640px):** Single-column layout. Minimum tap target size: `44 x 44 px`. Zero horizontal scrollbars.
  * **Zero Right-Edge Truncation:** Multi-button selectors and toggles must use fluid widths (`w-full sm:w-auto` with `flex-1 sm:flex-initial`) to avoid pushing past the 360px viewport.
  * **Card Action Bar Stacking:** Card footers pairing copy with a CTA button must stack vertically on mobile (`flex-col sm:flex-row gap-3`), with the button expanding to full width (`w-full sm:w-auto`) to eliminate button label slicing.
  * **Floating Assistant Safe-Zone:** Docked bottom elements must collapse into a compact circular Floating Action Button (FAB, `44x44px`, `p-3 sm:px-5 sm:py-3`) placed at `bottom-4 right-4` so they never cover card buttons.
  * **Above-the-Fold Cognitive Flow:** Max 1 pill/badge above the mobile hero headline. Secondary category chips are hidden on mobile (`hidden sm:inline-flex`).
* **Tablet (641px - 1024px):** 2-column catalog grids with `gap-6`.
* **Desktop (1025px+):** Max canvas constraint `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`. 3-column catalog grids with generous whitespace.
