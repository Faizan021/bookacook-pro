Speisely Storefront MVP Implementation Notes
This branch adds the first additive version of the Smalt-inspired Speisely model:
Free restaurant storefronts at `/r/[slug]`
Normal direct menu orders through the storefront
Bulk/catering CTA routed back to the Speisely AI request flow
Source tracking for future commission logic
Tables for products, categories, direct orders, catering briefs, matches, quotes
Files added
`supabase/migrations/010_storefront_orders_catering.sql`
`lib/storefront/types.ts`
`lib/storefront/queries.ts`
`lib/storefront/actions.ts`
`app/r/[slug]/page.tsx`
`app/r/[slug]/StorefrontClient.tsx`
`app/caterer/orders/page.tsx`
What this does not do yet
No Stripe/payment processing yet
No subdomains yet; use `/r/[slug]` first
No custom domains yet
No PDF quote generation yet
No restaurant theme editor yet
Pilot data example
After running migration 010, insert a published storefront and a few products for one caterer.
Use an existing approved caterer ID.
```sql
-- Replace this with an existing caterer id.
-- select id, business_name from public.caterers limit 5;

update public.caterers
set slug = 'pizzanapoli',
    storefront_enabled = true,
    storefront_status = 'published',
    accepts_direct_orders = true,
    accepts_catering_requests = true
where id = '<CATERER_ID>';

insert into public.storefront_settings (
  caterer_id, slug, display_name, headline, description, city, pickup_enabled, delivery_enabled, status
) values (
  '<CATERER_ID>',
  'pizzanapoli',
  'Pizzeria Napoli',
  'Pizza, Pasta und Direktbestellung über Speisely.',
  'Bestellen Sie direkt beim Restaurant. Für Catering und Gruppenanfragen nutzen Sie den Speisely Catering-Flow.',
  'Berlin',
  true,
  false,
  'published'
);

insert into public.product_categories (caterer_id, name_de, sort_order)
values
  ('<CATERER_ID>', 'Pizza', 1),
  ('<CATERER_ID>', 'Pasta', 2),
  ('<CATERER_ID>', 'Getränke', 3);

insert into public.products (caterer_id, category_id, name_de, description_de, price, service_type, price_type, is_active, sort_order)
select '<CATERER_ID>', id, 'Pizza Margherita', 'Tomatensauce, Mozzarella, Basilikum', 9.90, 'instant', 'fixed', true, 1
from public.product_categories where caterer_id = '<CATERER_ID>' and name_de = 'Pizza';
```
Then open:
```text
https://www.speisely.de/r/pizzanapoli
```
