
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.is_staff(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_user_tier_rank(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.has_min_tier(uuid, integer) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.create_free_membership_for_profile() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.create_wallet_for_profile() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.apply_ticket_workflow() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.track_ticket_first_response() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.track_ticket_status() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM anon, public;

GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_staff(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_tier_rank(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_min_tier(uuid, integer) TO authenticated;

-- verify_certificate is intentionally public (certificate verification page)
-- keep default execute for anon on that function.
