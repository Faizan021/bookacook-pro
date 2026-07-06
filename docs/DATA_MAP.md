# Speisely Data Map

*Last verified against `src/integrations/supabase/types.ts` and full-repo grep for `.from("<table>")`, commit `4381605`, 2026-07-05.*

This document lists every table found in the generated Supabase types, its purpose, and whether it's actually referenced anywhere in application code (not just present in the schema).

## 1. Core System & Auth Tables

| Table Name | Purpose | Key Columns | Used By Role | Storefront Usage | Status |
|---|---|---|---|---|---|
| `profiles` | Stores standard user profile info linking to Supabase Auth. | `id` (PK, Auth UID), `first_name`, `email` | All | N/A (Internal auth logic) | **Active** |
| `user_roles` | Manages explicit role assignments (admin, customer, partner, etc). | `user_id`, `role` | Admin, System | N/A | **Active** |
| `partner_profiles` | *(Previously undocumented.)* Shared profile data layer used during auth/profile resolution for any vendor role. | — | Restaurant, Caterer, Planner | N/A | **Active** — read in `src/lib/auth/get-user-profile.functions.ts` |
| `seo_content_pages` | Drives programmatic SEO pages (e.g. Catering in Berlin). Admin-managed CRUD only. | `slug`, `city`, `category`, `h1_heading` | Admin | None currently — see `SEO_GEO.md` | **Active (backend only, no public consumption found)** |
| `german_locations` | Base geographic data for GEO strategy. | `city`, `zipcode`, `lat`, `lng` | System | N/A | **Active** |

## 2. Restaurant Operational Tables

| Table Name | Purpose | Key Columns | Used By Role | Storefront Usage | Status |
|---|---|---|---|---|---|
| `restaurants` | Core profile for instant order / reservation partners. | `id`, `slug`, `custom_domain`, `is_published`, `stripe_user_id` (legacy, still publicly readable), `paypal_email`, `accepts_cash`, `accepts_paypal` | Restaurant | `/restaurant/[slug]` | **Active** |
| `restaurant_stripe_accounts` | Private table holding Stripe Connect account IDs, introduced to replace the public `restaurants.stripe_user_id` column. | `restaurant_id`, `stripe_user_id` | Restaurant, System | Checkout (server-side only) | **Active** — but migration is incomplete: old column/policy on `restaurants` was never removed/tightened |
| `restaurant_products` | Menu items offered by the restaurant. | `restaurant_id`, `name`, `price` | Restaurant | `/restaurant/[slug]` | **Active** |
| `product_categories` | Menu categorization. | `name`, `restaurant_id` | Restaurant | Menu Sections | **Active** |
| `restaurant_orders` | Tracks instant food orders. | `restaurant_id`, `status`, `total` | Restaurant, Customer | Checkout / KDS | **Active** |
| `order_items` | Specific products inside a `restaurant_order`. | `order_id`, `product_id`, `qty` | Restaurant, Customer | Checkout / KDS | **Active** |
| `table_reservations` | Stores booking intents for physical tables. | `restaurant_id`, `reservation_date`, `reservation_time` | Restaurant, Customer | `/restaurant/[slug]` | **Active** |

## 3. Catering Operational Tables

| Table Name | Purpose | Key Columns | Used By Role | Storefront Usage | Status |
|---|---|---|---|---|---|
| `caterers` | Core profile for event caterers. **Does not hold publish status** — see `storefront_settings` below. | `id`, `slug`, `minimum_order_value` | Caterer | `/caterer/[slug]` | **Active** |
| `storefront_settings` | *(Previously undocumented.)* Holds caterer publish/draft status (`status` field: draft/published), distinct from the `caterers` row itself. | `partner_id`(?), `status` | Caterer, Admin | Gates visibility of `/caterer/[slug]` | **Active** — read/written in `src/data/caterers.ts` and `src/lib/admin/mutations.functions.ts` |
| `caterer_menu_items` | Packages and items offered by caterers. | `caterer_id`, `price` | Caterer | `/caterer/[slug]` | **Active** |
| `catering_bookings` | Inquiries and booked events for caterers. | `caterer_id`, `status` (pending, quoted, paid) | Caterer, Customer | `/caterer/[slug]` | **Active** |
| `catering_briefs` | Detailed event requirements submitted by customers. | `booking_id`, `guest_count`, `budget` | Caterer, Customer | Inquiry Form | **Active** |
| `catering_matches` | System/admin logic for matching briefs to caterers. | `brief_id`, `caterer_id` | Admin, System | N/A | **Legacy — confirmed zero code references anywhere in `src/`.** Exists in schema only. |

## 4. Event Planner Operational Tables

| Table Name | Purpose | Key Columns | Used By Role | Storefront Usage | Status |
|---|---|---|---|---|---|
| `planners` | Core profile for event decorators and planners. | `id`, `slug`, `portfolio_urls` | Event Manager | `/planner/[slug]` | **Active** |
| `planner_services` | Specific services (e.g. Wedding Decor). | `planner_id`, `title`, `base_price` | Event Manager | `/planner/[slug]` | **Active** |
| `planner_requests` | *(Previously undocumented.)* Lead intake for planner inquiries. | — | Event Manager, Customer | Lead capture form | **Active** — written in `src/lib/planner/mutations.functions.ts` |
| `event_bookings` | Leads and confirmed bookings for planners. | `planner_id`, `status` | Event Manager, Customer | `/planner/[slug]` | **Active** |
| `event_requests` | Described as a broader request-matching system, overlapping `event_bookings`. | `customer_id`, `event_type` | System | N/A | **Legacy — confirmed zero code references anywhere in `src/`.** Exists in schema only. |
| `event_request_matches` | Presumed matching logic for `event_requests`. | — | Admin, System | N/A | **Legacy — confirmed zero code references anywhere in `src/`.** Exists in schema only. |

## 5. Shared Partner Capabilities

| Table Name | Purpose | Key Columns | Used By Role | Storefront Usage | Status |
|---|---|---|---|---|---|
| `availability` | Recurring availability for partners (e.g. Open Mon-Fri). | `partner_id`, `day_of_week` | Caterer, Planner | Date Pickers | **Active** |
| `vendor_blackout_dates` | Specific dates blocked off by partners. | `vendor_id`, `date` | Caterer, Planner | Date Pickers | **Active** |
| `promo_codes` | Discount logic engine (percentage, fixed, free_delivery, free_item, BOGO). | `code`, `discount_type`, `discount_value` | Admin, Partners | Checkout | **Active in schema and admin CRUD, but NOT wired to the restaurant storefront checkout** — see `SHARED_RULES.md` §3 |
| `reviews` | Customer feedback on partners. | `partner_id`, `rating`, `comment` | Customer | Profile Pages | **Schema active; UI is a hardcoded empty mock (`const reviews: any[] = []`), no real read/write path found in code** |
| `saved_caterers` | Customers saving favorite partners. | `customer_id`, `caterer_id` | Customer | N/A | **Active** |
| `storefront_page_views` | Analytics tracking hits on public profiles. | `vendor_id`, `url` | System | N/A | **Active** |
| `products` | Generic products table. | — | — | — | **Legacy — confirmed zero code references anywhere in `src/`.** |
| `packages` | Generic packages table. | — | — | — | **Legacy — confirmed zero code references anywhere in `src/`.** |

## 6. Financial & Communication Tables

| Table Name | Purpose | Key Columns | Used By Role | Storefront Usage | Status |
|---|---|---|---|---|---|
| `payments` | Tracks Stripe payment intents and status. | `booking_id`, `stripe_id` | System | Checkout | **Active** |
| `subscriptions` | Tracks SaaS platform fees paid by partners (if applicable). | `partner_id`, `stripe_id` | Admin, System | N/A | Referenced in `20260620130000_add_subscription_to_restaurants.sql`; likely future B2B feature, not confirmed wired to any billing flow |
| `messages` | Direct chat between customers and partners. | `sender_id`, `receiver_id`, `content` | Customer, Partners | N/A | **Active** |
| `brief_messages` | Chat specifically tied to a `catering_brief`. | `brief_id`, `content` | Customer, Caterer | N/A | **Active / Duplicate** (overlaps with `messages`) |

## 7. Confirmed Legacy / Deprecated Tables (zero code references)

The following tables exist in the live Supabase schema (`types.ts`) but have **zero** `.from("<table>")` references anywhere in `src/`. This was verified by direct repo grep, not inferred:
- `orders`
- `quotes`
- `quote_items`
- `catering_matches`
- `event_requests`
- `event_request_matches`
- `products`
- `packages`

**Before dropping any of these**, confirm they're also empty/unused in the live production database — code silence doesn't guarantee the tables hold no data or aren't queried directly via the Supabase dashboard/other services.
