
-- 1) Lock down course_certificates SELECT
DROP POLICY IF EXISTS "Users view own certs, public verify by number" ON public.course_certificates;

CREATE POLICY "Owners and admins view certificates"
ON public.course_certificates
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- Public verification helper: returns minimal info by certificate number
CREATE OR REPLACE FUNCTION public.verify_certificate(_certificate_number text)
RETURNS TABLE(valid boolean, course_id uuid, issued_at timestamptz)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT true, c.course_id, c.issued_at
  FROM public.course_certificates c
  WHERE c.certificate_number = _certificate_number
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.verify_certificate(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_certificate(text) TO anon, authenticated;

-- 2) Revoke anon EXECUTE on internal SECURITY DEFINER helpers
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.has_min_tier(uuid, integer) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_user_tier_rank(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.create_free_membership_for_profile() FROM PUBLIC, anon, authenticated;
