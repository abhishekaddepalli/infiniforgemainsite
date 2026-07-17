
-- Public read access for site_cms module
DROP POLICY IF EXISTS "Public can read site_cms module" ON public.module_records;
CREATE POLICY "Public can read site_cms module"
  ON public.module_records FOR SELECT
  TO anon, authenticated
  USING (module = 'site_cms');

-- Anyone can submit contact form
GRANT INSERT ON public.module_records TO anon;

DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.module_records;
CREATE POLICY "Anyone can submit contact form"
  ON public.module_records FOR INSERT
  TO anon, authenticated
  WITH CHECK (module = 'contact_submissions');
