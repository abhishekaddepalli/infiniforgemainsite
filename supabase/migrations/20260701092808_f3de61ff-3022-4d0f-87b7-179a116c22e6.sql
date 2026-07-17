GRANT SELECT ON public.module_records TO anon;
DROP POLICY IF EXISTS "Public can read site_content module" ON public.module_records;
CREATE POLICY "Public can read site_content module"
  ON public.module_records FOR SELECT
  TO anon, authenticated
  USING (module = 'site_content');