GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO anon;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.is_staff(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.has_min_tier(uuid, integer) TO anon;
GRANT EXECUTE ON FUNCTION public.get_user_tier_rank(uuid) TO anon;