-- Migration 011: Fix public MVP checkout RLS for storefront orders

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists public_create_direct_storefront_orders on public.orders;
drop policy if exists public_read_direct_storefront_orders on public.orders;
drop policy if exists public_select_direct_storefront_orders on public.orders;

drop policy if exists public_create_direct_storefront_order_items on public.order_items;
drop policy if exists public_create_order_items on public.order_items;
drop policy if exists public_read_direct_storefront_order_items on public.order_items;
drop policy if exists public_select_order_items_for_direct_orders on public.order_items;

create policy public_create_direct_storefront_orders
on public.orders
for insert
to anon, authenticated
with check (
  source = 'direct_storefront'
  and order_type = 'instant_order'
  and status = 'pending'
);

create policy public_read_direct_storefront_orders
on public.orders
for select
to anon, authenticated
using (
  source = 'direct_storefront'
  and order_type = 'instant_order'
);

create policy public_create_direct_storefront_order_items
on public.order_items
for insert
to anon, authenticated
with check (
  exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
      and orders.source = 'direct_storefront'
      and orders.order_type = 'instant_order'
  )
);

create policy public_read_direct_storefront_order_items
on public.order_items
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
      and orders.source = 'direct_storefront'
      and orders.order_type = 'instant_order'
  )
);

notify pgrst, 'reload schema';
