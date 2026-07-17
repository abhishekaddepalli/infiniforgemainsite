-- Lock down SECURITY DEFINER functions: revoke public/anon EXECUTE,
-- grant back only to the roles that actually need each function.

-- RLS helpers: needed by authenticated (RLS policies run as the caller).
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.is_admin(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.is_staff(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_staff(uuid) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.has_min_tier(uuid, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_min_tier(uuid, integer) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.get_user_tier_rank(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_user_tier_rank(uuid) TO authenticated, service_role;

-- Trigger-only functions: not meant to be called from the API at all.
REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.create_wallet_for_profile() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.create_free_membership_for_profile() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.track_ticket_first_response() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.track_ticket_status() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.apply_ticket_workflow() FROM PUBLIC, anon, authenticated;

-- Public certificate verification: intentionally callable without sign-in.
REVOKE ALL ON FUNCTION public.verify_certificate(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_certificate(text) TO anon, authenticated, service_role;
