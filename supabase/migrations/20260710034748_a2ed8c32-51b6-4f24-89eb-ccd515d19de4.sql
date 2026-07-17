-- Restore EXECUTE on role-check helpers to anon/authenticated.
-- These SECURITY DEFINER functions are referenced inside RLS policies on public
-- tables (e.g. products), so both anon and authenticated roles must be able to
-- call them or PostgREST returns 401 "permission denied for function is_admin".
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_staff(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_tier_rank(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_min_tier(uuid, integer) TO anon, authenticated;