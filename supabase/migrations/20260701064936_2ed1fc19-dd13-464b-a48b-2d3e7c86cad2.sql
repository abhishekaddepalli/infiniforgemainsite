
CREATE POLICY "product_images_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "product_images_admin_write" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images' AND public.is_admin(auth.uid()));
CREATE POLICY "product_images_admin_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'product-images' AND public.is_admin(auth.uid()));
CREATE POLICY "product_images_admin_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'product-images' AND public.is_admin(auth.uid()));
