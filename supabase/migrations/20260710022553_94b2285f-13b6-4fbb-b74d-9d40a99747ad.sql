-- Fix products (and any RLS-using SECURITY DEFINER helpers) failing for anon
-- Root cause: PostgREST executes RLS `USING` expression as the request role.
-- Even though is_admin/has_role are SECURITY DEFINER, the caller still needs
-- EXECUTE privilege to call them. Grant that to anon/authenticated.
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_staff(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_min_tier(uuid, integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_tier_rank(uuid) TO anon, authenticated;