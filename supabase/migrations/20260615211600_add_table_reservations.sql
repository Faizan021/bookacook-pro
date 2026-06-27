create table public.table_reservations (
  id uuid not null default gen_random_uuid (),
  restaurant_id uuid not null,
  customer_id uuid null,
  first_name text not null,
  last_name text not null,
  phone text not null,
  guest_count integer not null,
  reservation_date date not null,
  reservation_time time not null,
  status text not null default 'pending'::text,
  notes text null,
  created_at timestamp with time zone not null default now(),
  constraint table_reservations_pkey primary key (id),
  constraint table_reservations_restaurant_id_fkey foreign key (restaurant_id) references restaurants (id) on delete cascade,
  constraint table_reservations_customer_id_fkey foreign key (customer_id) references profiles (id) on delete set null
);

create table public.brief_messages (
  id uuid not null default gen_random_uuid (),
  brief_id uuid not null,
  sender_id uuid not null,
  message text not null,
  created_at timestamp with time zone not null default now(),
  constraint brief_messages_pkey primary key (id),
  constraint brief_messages_sender_id_fkey foreign key (sender_id) references profiles (id) on delete cascade
);

-- RLS for table_reservations
alter table public.table_reservations enable row level security;

create policy "Customers can view their own reservations" on public.table_reservations
  for select using (auth.uid() = customer_id);

create policy "Restaurants can view and update their reservations" on public.table_reservations
  for all using (
    exists (
      select 1 from restaurants r
      where r.id = table_reservations.restaurant_id
      and r.owner_id = auth.uid()
    )
  );

create policy "Anyone can create reservations" on public.table_reservations
  for insert with check (true);


-- RLS for brief_messages
alter table public.brief_messages enable row level security;

create policy "Users can view messages for their briefs" on public.brief_messages
  for select using (
    exists (
      select 1 from catering_briefs cb
      where cb.id = brief_messages.brief_id
      and (cb.customer_id = auth.uid() or cb.preferred_caterer_id in (select id from caterers where owner_id = auth.uid()))
    )
    or
    exists (
      select 1 from planner_requests pr
      where pr.id = brief_messages.brief_id
      and (pr.customer_id = auth.uid() or pr.preferred_planner_id in (select id from planners where owner_id = auth.uid()))
    )
  );

create policy "Users can send messages to their briefs" on public.brief_messages
  for insert with check (
    auth.uid() = sender_id and
    (
      exists (
        select 1 from catering_briefs cb
        where cb.id = brief_messages.brief_id
        and (cb.customer_id = auth.uid() or cb.preferred_caterer_id in (select id from caterers where owner_id = auth.uid()))
      )
      or
      exists (
        select 1 from planner_requests pr
        where pr.id = brief_messages.brief_id
        and (pr.customer_id = auth.uid() or pr.preferred_planner_id in (select id from planners where owner_id = auth.uid()))
      )
    )
  );
