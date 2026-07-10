# Speisely UI Design System

This document defines the unified, project-wide design system and visual guidelines for **Speisely**. Every page, component, and feature must strictly adhere to these rules to maintain a cohesive, premium, and state-of-the-art aesthetic.

---

## 1. Visual Theme & Color Palette

Speisely uses a **Premium Gastronomy & Hospitality** theme centered around dark forest green, warm cream, and gold accents.

### Core Color Tokens (OKLCH & CSS Variables)

All colors are defined in `src/styles.css` using OKLCH values for wide-gamut color representation and smooth gradients.

| Variable Name    | Tailwind Color Class        | OKLCH Value            | Visual Usage                                                      |
| :--------------- | :-------------------------- | :--------------------- | :---------------------------------------------------------------- |
| `--forest`       | `bg-forest` / `text-forest` | `oklch(0.27 0.06 152)` | Primary dark brand color (backgrounds, primary text)              |
| `--cream`        | `bg-cream` / `text-cream`   | `oklch(0.96 0.04 92)`  | Secondary light brand color (card backgrounds, page header)       |
| `--mint`         | `bg-mint` / `text-mint`     | `oklch(0.93 0.05 152)` | Accent light green (dotted background, muted panels)              |
| `--gold`         | `bg-gold` / `text-gold`     | `oklch(0.68 0.09 92)`  | Accent brand color (icons, primary CTA buttons, highlighted text) |
| `--brand-orange` | `text-brand-orange`         | `oklch(0.64 0.22 47)`  | Alert, warning, or admin highlight indicators                     |

---

## 2. Typography

We combine a classic, elegant Serif font for headlines with a clean, high-readability Sans-Serif font for UI and body text.

- **Display / Headings Font**: `Fraunces` (fallback: Georgia, serif).
  - _Usage_: Page titles, hero section headlines, section headings, and display numbers.
  - _Tailwind Class_: `font-display` (e.g. `font-display text-5xl font-bold`)
- **Body / UI Font**: `Inter` (fallback: system-ui, sans-serif).
  - _Usage_: Paragraphs, input fields, labels, buttons, and navigation links.
  - _Tailwind Class_: `font-sans` (default body font)

---

## 3. Component Design Guidelines

### A. Page Shell & Layout (`SiteShell`)

- Every public page must be wrapped in `<SiteShell>` to automatically render the global header, cookie banner, analytics scripts, and footer.
- **Backgrounds**:
  - Use the dotted background class `bg-mint-dotted` for generic pages.
  - Use clean solid backgrounds for dashboard panels.

### B. Global Header (`SiteHeader`)

- **Dynamic Scroll Behavior**:
  - On pages with dark cinematic hero headers (Home `/`), the header starts **transparent** with white text, white logo, and glassmorphism elements.
  - When the page scrolls past `20px`, the header morphs into a solid cream bar (`bg-cream/95 backdrop-blur-md border-b border-forest/10`) with dark forest text and green logo.
- Other static pages use the solid cream header by default to guarantee full readability.

### C. Cards & Containers (`surface-card`)

All content cards must use the project-wide utility classes:

- **Aesthetic Style**: `bg-white` or `bg-cream/50`, with rounded corners (`rounded-[2rem]` or `rounded-3xl`), and a soft deep shadow:
  `shadow-2xl shadow-forest/5 border border-forest/10`
- **Interactive Cards**: Add hover scale-up effect:
  `transition-all duration-300 hover:-translate-y-1 hover:shadow-forest/10`

### D. Buttons & CTAs

- **Primary CTA Button**: Large, bold gold button.
  `bg-[#b28a3c] text-white px-8 py-4 rounded-full font-bold shadow-xl hover:bg-[#9a7633] transition-all`
- **Secondary CTA Button**: Outlined or text button.
  `border border-forest/20 text-forest px-6 py-3 rounded-full font-semibold hover:bg-cream transition-all`

---

## 4. Page Layout Blueprints

To ensure new pages match existing ones, follow these layout structures:

### Layout A: Cinematic Split Hero (Used for `/`, `/about`, `/contact`, `/partners`)

1.  **Header**: Transparent overlapping layout (`-mt-20 lg:-mt-24` on hero).
2.  **Hero Section**: Dark background image (`/hero-cinematic.png`) with a gradient overlay (`from-forest via-forest/90 to-transparent`) and large white display text.
3.  **Body Section**: Soft beige cards overlaying the hero bottom (`-mt-16 lg:-mt-24`) to draw the user's eye downwards.

### Layout B: Clean Service Landing Page (Used for `/instant-order`, `/catering`)

1.  **Header**: Solid cream header bar.
2.  **Content Grid**: Mint-dotted background layout (`bg-mint-dotted`) displaying category search bars, filters, and list cards.
