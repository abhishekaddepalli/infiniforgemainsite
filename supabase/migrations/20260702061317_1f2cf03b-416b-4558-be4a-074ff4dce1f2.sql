
REVOKE ALL ON FUNCTION public.apply_ticket_workflow() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.track_ticket_status() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.track_ticket_first_response() FROM PUBLIC, anon, authenticated;
