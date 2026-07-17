CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audience text NOT NULL DEFAULT 'staff',
  user_id uuid NULL,
  title text NOT NULL,
  body text NULL,
  href text NULL,
  kind text NOT NULL DEFAULT 'system',
  read_at timestamptz NULL,
  email_status text NOT NULL DEFAULT 'pending',
  whatsapp_status text NOT NULL DEFAULT 'skipped',
  sms_status text NOT NULL DEFAULT 'skipped',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT notifications_audience_check CHECK (audience IN ('staff','user')),
  CONSTRAINT notifications_user_required_for_user_audience CHECK (audience <> 'user' OR user_id IS NOT NULL)
);

GRANT SELECT, INSERT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view staff notifications"
ON public.notifications
FOR SELECT
TO authenticated
USING (audience = 'staff' AND public.is_staff(auth.uid()));

CREATE POLICY "Users can view own notifications"
ON public.notifications
FOR SELECT
TO authenticated
USING (audience = 'user' AND user_id = auth.uid());

CREATE POLICY "Users can mark own notifications read"
ON public.notifications
FOR UPDATE
TO authenticated
USING ((audience = 'user' AND user_id = auth.uid()) OR (audience = 'staff' AND public.is_staff(auth.uid())))
WITH CHECK ((audience = 'user' AND user_id = auth.uid()) OR (audience = 'staff' AND public.is_staff(auth.uid())));

CREATE INDEX notifications_user_created_idx ON public.notifications (user_id, created_at DESC);
CREATE INDEX notifications_staff_created_idx ON public.notifications (audience, created_at DESC) WHERE audience = 'staff';

CREATE TRIGGER set_notifications_updated_at
BEFORE UPDATE ON public.notifications
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_audit_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.wallet_transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;