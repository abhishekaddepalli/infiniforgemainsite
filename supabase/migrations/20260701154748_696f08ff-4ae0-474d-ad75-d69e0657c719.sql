
-- 1) Tighten module_records public INSERT policies for whatsapp_orders and contact_submissions
DROP POLICY IF EXISTS "Anyone can log whatsapp orders" ON public.module_records;
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.module_records;

CREATE POLICY "Public can log whatsapp orders"
ON public.module_records
FOR INSERT
TO anon, authenticated
WITH CHECK (
  module = 'whatsapp_orders'
  AND status = 'pending'
  AND title IS NOT NULL AND length(title) BETWEEN 1 AND 200
  AND (subtitle IS NULL OR length(subtitle) <= 300)
  AND (amount_inr IS NULL OR (amount_inr >= 0 AND amount_inr <= 100000000))
  AND (customer_id IS NULL OR customer_id = auth.uid())
  AND metadata IS NOT NULL
  AND pg_column_size(metadata) <= 32768
);

CREATE POLICY "Public can submit contact form"
ON public.module_records
FOR INSERT
TO anon, authenticated
WITH CHECK (
  module = 'contact_submissions'
  AND status = 'new'
  AND title IS NOT NULL AND length(title) BETWEEN 1 AND 200
  AND customer_id IS NULL
  AND amount_inr IS NULL
  AND metadata IS NOT NULL
  AND pg_column_size(metadata) <= 16384
);

-- 2) phone_otps: ensure RLS enabled and no client access via API. Revoke all client privileges; only service_role uses it.
ALTER TABLE public.phone_otps ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.phone_otps FROM anon, authenticated, PUBLIC;
GRANT ALL ON public.phone_otps TO service_role;

-- 3) Restrict SECURITY DEFINER helper functions from anon; keep authenticated (needed by RLS at query time).
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_staff(uuid) FROM PUBLIC, anon;
