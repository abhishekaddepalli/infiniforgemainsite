
CREATE TABLE public.module_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module text NOT NULL,
  title text NOT NULL,
  subtitle text,
  status text NOT NULL DEFAULT 'active',
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  amount_inr numeric(12,2) DEFAULT 0,
  due_at timestamptz,
  tags text[] DEFAULT '{}',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.module_records TO authenticated;
GRANT ALL ON public.module_records TO service_role;

ALTER TABLE public.module_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff manage all module records"
  ON public.module_records FOR ALL
  TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "Customers view their own module records"
  ON public.module_records FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

CREATE INDEX idx_module_records_module ON public.module_records(module);
CREATE INDEX idx_module_records_customer ON public.module_records(customer_id);
CREATE INDEX idx_module_records_status ON public.module_records(status);

CREATE TRIGGER trg_module_records_updated_at
  BEFORE UPDATE ON public.module_records
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
