
CREATE POLICY "Planner owner uploads service images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'planner-services'
  AND EXISTS (
    SELECT 1 FROM public.planners p
    WHERE p.owner_id = auth.uid()
      AND p.id::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Planner owner updates service images"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'planner-services'
  AND EXISTS (
    SELECT 1 FROM public.planners p
    WHERE p.owner_id = auth.uid()
      AND p.id::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Planner owner deletes service images"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'planner-services'
  AND EXISTS (
    SELECT 1 FROM public.planners p
    WHERE p.owner_id = auth.uid()
      AND p.id::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Signed-in reads planner service images"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'planner-services');
