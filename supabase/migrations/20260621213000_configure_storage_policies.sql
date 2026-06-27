-- Drop existing storage policies if they exist to prevent duplicates
DROP POLICY IF EXISTS "Authenticated users can upload to caterer-menu" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view caterer-menu" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to restaurant-products" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view restaurant-products" ON storage.objects;

DROP POLICY IF EXISTS "Planner owner uploads service images" ON storage.objects;
DROP POLICY IF EXISTS "Planner owner updates service images" ON storage.objects;
DROP POLICY IF EXISTS "Planner owner deletes service images" ON storage.objects;
DROP POLICY IF EXISTS "Signed-in reads planner service images" ON storage.objects;

DROP POLICY IF EXISTS "Owner manages storefront assets" ON storage.objects;
DROP POLICY IF EXISTS "Public read storefront assets" ON storage.objects;
DROP POLICY IF EXISTS "Owner manages caterer menu assets" ON storage.objects;
DROP POLICY IF EXISTS "Public read caterer menu assets" ON storage.objects;
DROP POLICY IF EXISTS "Owner manages restaurant products assets" ON storage.objects;
DROP POLICY IF EXISTS "Public read restaurant products assets" ON storage.objects;
DROP POLICY IF EXISTS "Owner manages planner services assets" ON storage.objects;
DROP POLICY IF EXISTS "Public read planner services assets" ON storage.objects;


-- ==================== 1. storefront-assets ====================
-- Public read access so anyone can view logos and banners
CREATE POLICY "Public read storefront assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'storefront-assets');

-- Owner manages their own storefront assets (folder name matches vendor uuid)
CREATE POLICY "Owner manages storefront assets"
ON storage.objects FOR ALL TO authenticated
USING (
  bucket_id = 'storefront-assets'
  AND (
    EXISTS (
      SELECT 1 FROM public.caterers c
      WHERE c.owner_id = auth.uid()
        AND c.id::text = (storage.foldername(objects.name))[1]
    )
    OR EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.owner_id = auth.uid()
        AND r.id::text = (storage.foldername(objects.name))[1]
    )
    OR EXISTS (
      SELECT 1 FROM public.planners p
      WHERE p.owner_id = auth.uid()
        AND p.id::text = (storage.foldername(objects.name))[1]
    )
  )
);


-- ==================== 2. caterer-menu ====================
-- Public read access for menu images
CREATE POLICY "Public read caterer menu assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'caterer-menu');

-- Owner manages their own caterer menu assets
CREATE POLICY "Owner manages caterer menu assets"
ON storage.objects FOR ALL TO authenticated
USING (
  bucket_id = 'caterer-menu'
  AND EXISTS (
    SELECT 1 FROM public.caterers c
    WHERE c.owner_id = auth.uid()
      AND c.id::text = (storage.foldername(objects.name))[1]
  )
);


-- ==================== 3. restaurant-products ====================
-- Public read access for product images
CREATE POLICY "Public read restaurant products assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'restaurant-products');

-- Owner manages their own restaurant products assets
CREATE POLICY "Owner manages restaurant products assets"
ON storage.objects FOR ALL TO authenticated
USING (
  bucket_id = 'restaurant-products'
  AND EXISTS (
    SELECT 1 FROM public.restaurants r
    WHERE r.owner_id = auth.uid()
      AND r.id::text = (storage.foldername(objects.name))[1]
  )
);


-- ==================== 4. planner-services ====================
-- Public read access for planner packages images
CREATE POLICY "Public read planner services assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'planner-services');

-- Owner manages their own planner services assets
CREATE POLICY "Owner manages planner services assets"
ON storage.objects FOR ALL TO authenticated
USING (
  bucket_id = 'planner-services'
  AND EXISTS (
    SELECT 1 FROM public.planners p
    WHERE p.owner_id = auth.uid()
      AND p.id::text = (storage.foldername(objects.name))[1]
  )
);
