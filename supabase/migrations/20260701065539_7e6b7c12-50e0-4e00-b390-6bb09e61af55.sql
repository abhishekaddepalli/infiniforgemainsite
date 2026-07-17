
CREATE TABLE public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_email TEXT,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  target_user_id UUID,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX admin_audit_logs_created_at_idx ON public.admin_audit_logs (created_at DESC);
CREATE INDEX admin_audit_logs_resource_idx ON public.admin_audit_logs (resource_type, resource_id);
CREATE INDEX admin_audit_logs_actor_idx ON public.admin_audit_logs (actor_id);

GRANT SELECT, INSERT ON public.admin_audit_logs TO authenticated;
GRANT ALL ON public.admin_audit_logs TO service_role;

ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_read_audit_logs"
  ON public.admin_audit_logs FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "staff_insert_own_audit_logs"
  ON public.admin_audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (public.is_staff(auth.uid()) AND actor_id = auth.uid());
