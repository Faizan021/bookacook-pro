-- ============================================================================
-- SPEISELY DEMO SEED DATA
-- Run this entire script in your Supabase SQL Editor.
-- It inserts all 3 restaurants, 3 caterers, and 3 planners from the Lovable mockup.
-- ============================================================================

-- We use fixed demo UUIDs so FK constraints are satisfied.
-- These are demo-only user IDs (not real auth accounts).
-- We temporarily bypass FK on auth.users by inserting into auth.users directly.

DO $$
DECLARE
  uid_verde_grain   UUID := 'aaaaaaaa-0000-0000-0000-000000000001';
  uid_casa_limone   UUID := 'aaaaaaaa-0000-0000-0000-000000000002';
  uid_miso_social   UUID := 'aaaaaaaa-0000-0000-0000-000000000003';
  uid_maison_verde  UUID := 'aaaaaaaa-0000-0000-0000-000000000004';
  uid_stadt_tafel   UUID := 'aaaaaaaa-0000-0000-0000-000000000005';
  uid_olivenhain    UUID := 'aaaaaaaa-0000-0000-0000-000000000006';
  uid_lumen         UUID := 'aaaaaaaa-0000-0000-0000-000000000007';
  uid_north         UUID := 'aaaaaaaa-0000-0000-0000-000000000008';
  uid_atelier       UUID := 'aaaaaaaa-0000-0000-0000-000000000009';

  rid_verde_grain   UUID;
  rid_casa_limone   UUID;
  rid_miso_social   UUID;
  cid_maison_verde  UUID;
  cid_stadt_tafel   UUID;
  cid_olivenhain    UUID;

BEGIN

  -- ─────────────────────────────────────────────────────────────────
  -- 1) Create demo users in auth.users (safe to re-run: ON CONFLICT DO NOTHING)
  -- ─────────────────────────────────────────────────────────────────
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, role, aud, created_at, updated_at)
  VALUES
    (uid_verde_grain,  'demo-verde-grain@speisely.de',  '', now(), 'authenticated', 'authenticated', now(), now()),
    (uid_casa_limone,  'demo-casa-limone@speisely.de',  '', now(), 'authenticated', 'authenticated', now(), now()),
    (uid_miso_social,  'demo-miso-social@speisely.de',  '', now(), 'authenticated', 'authenticated', now(), now()),
    (uid_maison_verde, 'demo-maison-verde@speisely.de', '', now(), 'authenticated', 'authenticated', now(), now()),
    (uid_stadt_tafel,  'demo-stadt-tafel@speisely.de',  '', now(), 'authenticated', 'authenticated', now(), now()),
    (uid_olivenhain,   'demo-olivenhain@speisely.de',   '', now(), 'authenticated', 'authenticated', now(), now()),
    (uid_lumen,        'demo-lumen@speisely.de',        '', now(), 'authenticated', 'authenticated', now(), now()),
    (uid_north,        'demo-north@speisely.de',        '', now(), 'authenticated', 'authenticated', now(), now()),
    (uid_atelier,      'demo-atelier@speisely.de',      '', now(), 'authenticated', 'authenticated', now(), now())
  ON CONFLICT (id) DO NOTHING;


  -- ─────────────────────────────────────────────────────────────────
  -- 2) RESTAURANTS
  -- ─────────────────────────────────────────────────────────────────

  INSERT INTO public.restaurants (
    user_id, business_name, slug, description,
    banner_image_url, phone, business_address, city, postal_code,
    cuisine_type, is_active, verification_status,
    min_order_amount, delivery_fee, accepts_pickup, accepts_delivery
  ) VALUES
    (
      uid_verde_grain, 'Verde & Grain', 'verde-grain',
      'Saisonale Bio-Bowls und Salate, frisch zubereitet aus regionalen Zutaten.',
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&h=900&fit=crop',
      '+49 30 1234 5678', 'Linienstraße 142, 10115 Berlin', 'Berlin', '10115',
      'Healthy, Bowls, Salads', true, 'verified',
      12.00, 1.49, true, true
    ),
    (
      uid_casa_limone, 'Casa Limone', 'casa-limone',
      'Authentische italienische Küche mit hausgemachter Pasta und Klassikern.',
      'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=1200&h=900&fit=crop',
      '+49 30 2345 6789', 'Kollwitzstraße 58, 10405 Berlin', 'Berlin', '10405',
      'Italian, Pasta, Antipasti', true, 'verified',
      15.00, 2.49, true, true
    ),
    (
      uid_miso_social, 'Miso Social', 'miso-social',
      'Modernes Izakaya mit Ramen, Sushi und saisonalen Kleinigkeiten.',
      'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=1200&h=900&fit=crop',
      '+49 30 3456 7890', 'Oranienstraße 22, 10999 Berlin', 'Berlin', '10999',
      'Japanese, Sushi, Ramen', true, 'verified',
      18.00, 0.99, false, true
    )
  ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO rid_verde_grain;

  -- Re-fetch IDs since ON CONFLICT may skip RETURNING
  SELECT id INTO rid_verde_grain FROM public.restaurants WHERE slug = 'verde-grain';
  SELECT id INTO rid_casa_limone FROM public.restaurants WHERE slug = 'casa-limone';
  SELECT id INTO rid_miso_social  FROM public.restaurants WHERE slug = 'miso-social';


  -- ─────────────────────────────────────────────────────────────────
  -- 3) RESTAURANT PRODUCTS
  -- ─────────────────────────────────────────────────────────────────

  -- Verde & Grain menu
  INSERT INTO public.restaurant_products (restaurant_id, name, description, price, image_url, category, dietary_tags, is_available, display_order)
  VALUES
    (rid_verde_grain, 'Tuscan Kale & Pecorino', 'Bio-Grünkohl, Pecorino, Pinienkerne', 14.50, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop', 'Bowls', ARRAY['vegetarian','gluten-free'], true, 1),
    (rid_verde_grain, 'Mediterranean Quinoa', 'Quinoa, Gurke, Tomate, Tahini', 15.50, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop', 'Bowls', ARRAY['vegan','gluten-free'], true, 2),
    (rid_verde_grain, 'Fig & Prosciutto', 'Feigen, Prosciutto, Rucola, Balsamico', 17.00, 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=400&fit=crop', 'Salads', ARRAY['gluten-free'], true, 3),
    (rid_verde_grain, 'Roasted Beet & Goat Cheese', 'Rote Bete, Ziegenkäse, Walnüsse', 13.50, 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=400&h=400&fit=crop', 'Salads', ARRAY['vegetarian','gluten-free'], true, 4),
    (rid_verde_grain, 'Cold Pressed Green Juice', 'Sellerie, Apfel, Ingwer, Zitrone', 6.50, 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&h=400&fit=crop', 'Drinks', ARRAY['vegan','gluten-free'], true, 5)
  ON CONFLICT DO NOTHING;

  -- Casa Limone menu
  INSERT INTO public.restaurant_products (restaurant_id, name, description, price, image_url, category, dietary_tags, is_available, display_order)
  VALUES
    (rid_casa_limone, 'Cacio e Pepe', 'Tonnarelli, Pecorino Romano, schwarzer Pfeffer', 13.90, 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400&h=400&fit=crop', 'Pasta', ARRAY['vegetarian'], true, 1),
    (rid_casa_limone, 'Tagliatelle al Ragù', 'Bolognese-Ragù, Parmigiano', 15.90, 'https://images.unsplash.com/photo-1572441713132-c542fc4fe282?w=400&h=400&fit=crop', 'Pasta', ARRAY[]::text[], true, 2),
    (rid_casa_limone, 'Antipasti Misti', 'Wurstwaren, Oliven, Focaccia', 16.50, 'https://images.unsplash.com/photo-1626202373052-9cb1490ff7e8?w=400&h=400&fit=crop', 'Antipasti', ARRAY[]::text[], true, 3),
    (rid_casa_limone, 'Burrata Pugliese', 'Burrata, Kirschtomaten, Basilikum', 12.00, 'https://images.unsplash.com/photo-1633437756091-3acff8d92b62?w=400&h=400&fit=crop', 'Antipasti', ARRAY['vegetarian','gluten-free'], true, 4),
    (rid_casa_limone, 'Tiramisu Classico', 'Mascarpone, Espresso, Savoiardi', 7.50, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=400&fit=crop', 'Dolci', ARRAY['vegetarian'], true, 5)
  ON CONFLICT DO NOTHING;

  -- Miso Social menu
  INSERT INTO public.restaurant_products (restaurant_id, name, description, price, image_url, category, dietary_tags, is_available, display_order)
  VALUES
    (rid_miso_social, 'Tonkotsu Ramen', 'Schweinebrühe, Chashu, weiches Ei', 15.90, 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400&h=400&fit=crop', 'Ramen', ARRAY[]::text[], true, 1),
    (rid_miso_social, 'Spicy Miso Ramen', 'Miso-Brühe, Chili-Öl, Mais', 14.90, 'https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=400&h=400&fit=crop', 'Ramen', ARRAY[]::text[], true, 2),
    (rid_miso_social, 'Salmon Nigiri (6 St.)', 'Sashimi-Lachs, Sushi-Reis', 12.50, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=400&fit=crop', 'Sushi', ARRAY['gluten-free'], true, 3),
    (rid_miso_social, 'Spicy Tuna Maki', 'Gelbflossen-Thunfisch, Chili-Mayo, Frühlingszwiebel', 11.00, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=400&fit=crop', 'Sushi', ARRAY[]::text[], true, 4),
    (rid_miso_social, 'Edamame', 'Meersalz, Sesam', 5.50, 'https://images.unsplash.com/photo-1564844536311-de546a28c87d?w=400&h=400&fit=crop', 'Sides', ARRAY['vegan','gluten-free'], true, 5)
  ON CONFLICT DO NOTHING;


  -- ─────────────────────────────────────────────────────────────────
  -- 4) CATERERS — insert into caterers table first
  -- ─────────────────────────────────────────────────────────────────
  INSERT INTO public.caterers (user_id, business_name, slug, contact_person, email, phone, city, verification_status, is_active)
  VALUES
    (uid_maison_verde, 'Maison Verde', 'maison-verde', 'Maison Verde Team', 'hello@maison-verde.de', '+49 30 4567 1234', 'Berlin', 'verified', true),
    (uid_stadt_tafel,  'Stadt & Tafel', 'stadt-tafel', 'Stadt & Tafel Team', 'hello@stadt-tafel.de', '+49 30 4567 2345', 'Berlin', 'verified', true),
    (uid_olivenhain,   'Olivenhain', 'olivenhain', 'Olivenhain Team', 'hello@olivenhain.de', '+49 30 4567 3456', 'Berlin', 'verified', true)
  ON CONFLICT (user_id) DO NOTHING;

  SELECT id INTO cid_maison_verde FROM public.caterers WHERE user_id = uid_maison_verde;
  SELECT id INTO cid_stadt_tafel  FROM public.caterers WHERE user_id = uid_stadt_tafel;
  SELECT id INTO cid_olivenhain   FROM public.caterers WHERE user_id = uid_olivenhain;


  -- ─────────────────────────────────────────────────────────────────
  -- 5) STOREFRONT SETTINGS for caterers
  -- ─────────────────────────────────────────────────────────────────
  INSERT INTO public.storefront_settings (caterer_id, slug, display_name, headline, description, hero_image_url, phone, address, city, postal_code, status, minimum_order_amount, delivery_fee, pickup_enabled, delivery_enabled, catering_cta_enabled)
  VALUES
    (
      cid_maison_verde, 'maison-verde', 'Maison Verde',
      'Fine Dining · Privates Dinner',
      'Intime Fine-Dining-Erlebnisse bei dir zuhause — saisonal, regional und persönlich serviert.',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=900&fit=crop',
      '+49 30 4567 1234', 'Auguststraße 14, 10117 Berlin', 'Berlin', '10117',
      'published', 600.00, 0.00, false, true, true
    ),
    (
      cid_stadt_tafel, 'stadt-tafel', 'Stadt & Tafel',
      'Modern Sharing · Corporate',
      'Sharing-Bowls und Plattenkonzepte für Team-Events, Konferenzen und Office-Lunches.',
      'https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&h=900&fit=crop',
      '+49 30 4567 2345', 'Lobeckstraße 30, 10969 Berlin', 'Berlin', '10969',
      'published', 350.00, 0.00, false, true, true
    ),
    (
      cid_olivenhain, 'olivenhain', 'Olivenhain',
      'Levantinische Hochzeit',
      'Üppige levantinische Buffets für Hochzeiten — Mezze, Grill und süße Klassiker.',
      'https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=1200&h=900&fit=crop',
      '+49 30 4567 3456', 'Sonnenallee 88, 12045 Berlin', 'Berlin', '12045',
      'published', 1500.00, 0.00, false, true, true
    )
  ON CONFLICT (slug) DO NOTHING;


  -- ─────────────────────────────────────────────────────────────────
  -- 6) PLANNER SERVICES (3 demo planners)
  -- ─────────────────────────────────────────────────────────────────
  INSERT INTO public.planner_services (planner_id, service_name, description, price_model, price_amount, image_url)
  VALUES
    (
      uid_lumen, 'Full-Service Wedding Planning',
      'Designgetriebene Eventplanung für Hochzeiten — von Konzept bis Cleanup. Mit über 200 realisierten Hochzeiten wissen wir, worauf es ankommt.',
      'starting_at', 4900.00,
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=900&fit=crop'
    ),
    (
      uid_north, 'Corporate Event Production',
      'End-to-end Produktion für Corporate Events, Produktlaunches und Konferenzen. Von der ersten Idee bis zur finalen Abrechnung.',
      'starting_at', 7500.00,
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=900&fit=crop'
    ),
    (
      uid_atelier, 'Curated Private Dinner',
      'Intime, kuratierte Privatdinner — Konzept, Caterer-Matching und Tag-Koordination. Wir schaffen einzigartige Momente für Ihre Feiern.',
      'starting_at', 1800.00,
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=900&fit=crop'
    )
  ON CONFLICT DO NOTHING;

END $$;

-- Confirm what was inserted
SELECT 'restaurants' AS table_name, count(*) FROM public.restaurants WHERE slug IN ('verde-grain','casa-limone','miso-social')
UNION ALL
SELECT 'storefront_settings', count(*) FROM public.storefront_settings WHERE slug IN ('maison-verde','stadt-tafel','olivenhain')
UNION ALL
SELECT 'planner_services', count(*) FROM public.planner_services WHERE planner_id IN (
  'aaaaaaaa-0000-0000-0000-000000000007',
  'aaaaaaaa-0000-0000-0000-000000000008',
  'aaaaaaaa-0000-0000-0000-000000000009'
);
