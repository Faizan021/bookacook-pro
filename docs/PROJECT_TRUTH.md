# Speisely — System Project Truth

This document specifies the core project truths, architectural boundaries, business rules, and technical foundations for Speisely.

---

## 1. Core Platform Architecture

- **Framework:** Built strictly on **TanStack Start** (Vite + React SSR/CSR). Next.js is strictly forbidden and does not exist in this project.
- **Backend & Storage:** **Supabase** (PostgreSQL, RLS, Auth, Storage) + Server Functions via `@tanstack/react-start` (`createServerFn`).
- **Styling:** Vanilla Tailwind CSS v4 with custom design tokens (`forest`, `cream`, `sand`, `gold`, `clay`, etc.).
- **Multi-Role Separation:**
  1. **Admin:** Platform management, system CRUD, manual assignment.
  2. **Customer:** Public marketplace browsing, storefront ordering, inquiry submission, client dashboard.
  3. **Caterer:** B2B/B2C event catering, package management, logistics (zip codes, delivery radii), inquiry management, proposals.
  4. **Restaurant:** Direct ordering, table reservations, surplus food ("Too Good To Go" style bags), KDS (Kitchen Display System).
  5. **Event Manager / Planner:** Full event planning services, partner coordination, inquiry handling.

- **Unified Partner Identity:** Caterers, Restaurants, and Event Planners share a unified login/partner identity, but their specific management dashboards, data models, and public storefronts remain strictly separate.

---

## 2. Business Model & Security Strictness

- **Restaurant Vertical:** €34.99/mo subscription fee + 0% order commission.
- **Caterer & Planner Verticals:** 10% booking commission + lead protection.
- **Disintermediation & Lead Protection:**
  - Phone and business address details are optional and kept private on public vendor storefronts.
  - Customer contact details (PII) are stage-gated and revealed ONLY when an inquiry/proposal transitions to `"booked"` state after deposit capture.
- **Payment Processing:**
  - Direct Card Payments for Restaurants use **Stripe Connect Direct Charge**.
  - Caterer and Planner deposits use dynamically generated Stripe Checkout Sessions embedded into secure chat/proposal flows.
- **Anti-Fraud Rules:**
  - No past-date bookings, reservations, or promo periods allowed. Enforced at DB trigger, Zod schema, and UI layers.

---

## 3. Production Verification & Safety Standards

- **Build / Type Safety:** Every change must compile cleanly via `npm run build` before deployment.
- **Runtime Sanity:** Zero tolerance for `is not defined`, undefined property access, or broken route error boundaries.
- **Deploy Pipeline:** Changes committed to `main` branch are pushed and deployed to Vercel production (`https://speisely.de`), followed by automated smoke testing (`npm run smoke:test`).
