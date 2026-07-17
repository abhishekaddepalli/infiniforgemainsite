REVOKE EXECUTE ON FUNCTION public.verify_certificate(text) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.verify_certificate(text) TO authenticated, service_role;