<p align="center">
  <img src="public/favicon.svg" alt="Speisely Logo" width="84">
  <h1 align="center">Speisely — Germany's Premier Food &amp; Event Marketplace</h1>
</p>

<p align="center">
  <strong>Curated Catering · Instant Restaurant Orders · Intelligent Event Budget Engine</strong><br>
  Built with TanStack Start, React 19, Supabase, Stripe, and Luxury Editorial Storytelling.
</p>

<p align="center">
  <a href="CHANGELOG.md"><img src="https://img.shields.io/badge/version-2.5.0-173C32?style=flat-square" alt="Version 2.5.0"></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19.2-173C32?style=flat-square&logo=react" alt="React 19"></a>
  <a href="https://tanstack.com/start"><img src="https://img.shields.io/badge/TanStack_Start-v1.167-E6B84A?style=flat-square" alt="TanStack Start"></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind-v4.2-0f2720?style=flat-square&logo=tailwindcss" alt="Tailwind CSS v4"></a>
  <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-Database-10b981?style=flat-square&logo=supabase" alt="Supabase"></a>
  <a href="https://stripe.com/"><img src="https://img.shields.io/badge/Stripe-Payments-6366f1?style=flat-square&logo=stripe" alt="Stripe"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-Proprietary-050505?style=flat-square" alt="License"></a>
</p>

<p align="center">
  <a href="#overview"><strong>Overview</strong></a> ·
  <a href="#core-capabilities"><strong>Core Capabilities</strong></a> ·
  <a href="#search-pipeline"><strong>Search Pipeline</strong></a> ·
  <a href="#studios--tools"><strong>Studios &amp; Tools</strong></a> ·
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#quick-start"><strong>Quick Start</strong></a> ·
  <a href="#architecture--agent-rules"><strong>Agent Rules</strong></a>
</p>

---

## Overview

**Speisely** is Germany’s next-generation marketplace connecting consumers, event organizers, and corporate teams with hand-vetted **Caterers**, **Restaurants**, and **Event Planners** across major metropolitan hubs (Berlin, Munich, Hamburg, Frankfurt, Cologne, Stuttgart, Düsseldorf, Leipzig).

The platform bridges instant high-speed restaurant ordering with full-scale enterprise B2B catering management, budget estimation, multi-caterer quote comparison, and rich editorial magazine journalism.

---

## Core Capabilities

<table>
<tr>
<td width="50%" valign="top">
<h3>01 · B2B &amp; Event Catering Marketplace</h3>
<p>Comprehensive event catering booking with custom flying buffets, BBQ stations, fingerfood, and dietary certifications (100% Halal, Vegan, Gluten-Free, Organic).</p>
</td>
<td width="50%" valign="top">
<h3>02 · Real-Time Headcount &amp; Budget Engine</h3>
<p>Interactive slider calculator estimating total costs, portion weights, and price-per-person ranges for 10 to 500+ guests in under 60 seconds.</p>
</td>
</tr>
<tr>
<td width="50%" valign="top">
<h3>03 · Instant B2C Food Orders</h3>
<p>Lightning-fast restaurant ordering for dine-in, pickup, and local delivery with zero overhead and transparent vendor pricing.</p>
</td>
<td width="50%" valign="top">
<h3>04 · Speisely Magazin &amp; Community Stories</h3>
<p>Luxury editorial food journalism following the <strong>GEO/AEO Magazine Standard</strong> with 4:3 retina passe-partout photography, history deep-dives, and AI-search synchronization.</p>
</td>
</tr>
<tr>
<td width="50%" valign="top">
<h3>05 · Multi-Stage Search Pipeline</h3>
<p>Sub-30ms candidate retrieval inspired by Uber Eats architecture: product-level aggregation, microbatching, and geo-radius hydration.</p>
</td>
<td width="50%" valign="top">
<h3>06 · Vendor Dashboard &amp; Stripe Settlement</h3>
<p>Complete portal for caterers and restaurateurs with automated menu management, festival cash register mode, and instant payouts via Stripe.</p>
</td>
</tr>
</table>

---

## Search Pipeline (Uber Eats Architecture)

Speisely executes a 4-stage parallel search pipeline to provide sub-30ms discovery across Caterers, Restaurants, and Magazine Stories:

```
[User Query / City / Intent]
             │
             ▼
[Stage 1: Geo Candidate Retrieval] ──► PostGIS radius & City cluster lookup
             │
             ▼
[Stage 2: Product & Dish Aggregation] ──► Groups by Concept (Fingerfood, Cheesecake, BBQ)
             │
             ▼
[Stage 3: Parallel Hydration & Reviews] ──► Fetches ratings, minimum orders & pricing
             │
             ▼
[Stage 4: Real-time Budget Engine] ──► Computes total event cost & suggested packages
```

---

## Studios &amp; Tools

Speisely includes built-in interactive studios for social marketing and video production:

- **Launch Video Studio (`public/launch-videos.html`):**  
  Native 60 FPS Canvas video generator rendering 3 animated launch reels (Platform Launch, Event Planner, Food Magazine) with 1-click WebM/MP4 HD export.
- **Instagram Carousel Studio (`public/san-sebastian-carousel.html`):**  
  1080×1350 px HD 5-slide magazine carousel builder calibrated for Instagram safe zones.

---

## Tech Stack

- **Framework:** [TanStack Start](https://tanstack.com/start) + [React 19](https://react.dev/) + [Nitro](https://nitro.unjs.io/)
- **Styling & Motion:** [Tailwind CSS v4](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/) + [Lenis](https://lenis.darkroom.engineering/)
- **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL with RLS & Server Functions)
- **Payments:** [Stripe](https://stripe.com/) Connect & Checkout
- **Telemetry & Monitoring:** [Sentry](https://sentry.io/) + [PostHog](https://posthog.com/)
- **Icons & UI:** [Lucide React](https://lucide.dev/) + Radix UI Primitives

---

## Quick Start

### Prerequisites
- Node.js 20+
- npm 10+

### Installation & Development

```bash
# 1. Clone repository
git clone https://github.com/Faizan021/bookacook-pro.git
cd bookacook-pro

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

### Production Build & Verification

```bash
# Audit function scoping & agent graph rules
npm run verify:graph

# Full production build
npm run build

# Run automated smoke test
npm run smoke:test
```

---

## Architecture &amp; Agent Rules

Speisely enforces a strict **Graph-Style Execution Pipeline** documented in [`.agents/AGENTS.md`](.agents/AGENTS.md):

```
[Node 1: Planner] ──► [Node 2: Worker Code] ──► [Node 3: Scope Reviewer] ──► [Node 4: Verifier]
                                                        │                               │
                                                        ▼ (If Error)                    ▼
                                                        └───────────────────────────────┘
```

1. **Lightweight Frontend Rule:** Public pages must not bundle dashboard-only or admin-only dependencies.
2. **Mandatory LLMs.txt & Sitemap Sync:** Whenever new editorial content is published, `public/llms.txt` and `src/routes/sitemap[.]xml.ts` are automatically synchronized for AI search engines.
3. **Luxury Editorial Magazine Standard:** All magazine imagery uses unified 4:3 aspect ratios, double-layer gallery frames, and floating food badges.

---

<p align="center">
  <sub>Speisely Marketplace © 2026. All rights reserved.</sub>
</p>
