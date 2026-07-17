
CREATE POLICY "Public can view site-cms media"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'site-cms');

CREATE POLICY "Staff can upload site-cms media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'site-cms' AND public.is_staff(auth.uid()));

CREATE POLICY "Staff can update site-cms media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'site-cms' AND public.is_staff(auth.uid()));

CREATE POLICY "Staff can delete site-cms media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'site-cms' AND public.is_staff(auth.uid()));
