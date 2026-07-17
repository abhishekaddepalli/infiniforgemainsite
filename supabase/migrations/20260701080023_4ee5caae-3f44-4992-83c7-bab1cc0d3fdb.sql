
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS quantity INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS gst_percent NUMERIC(5,2) NOT NULL DEFAULT 18,
  ADD COLUMN IF NOT EXISTS customer_phone TEXT,
  ADD COLUMN IF NOT EXISTS customer_gstin TEXT,
  ADD COLUMN IF NOT EXISTS invoice_number TEXT,
  ADD COLUMN IF NOT EXISTS coupon_code TEXT,
  ADD COLUMN IF NOT EXISTS wallet_applied_inr NUMERIC(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT,
  ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT,
  ADD COLUMN IF NOT EXISTS payment_id TEXT,
  ADD COLUMN IF NOT EXISTS billing_cycle TEXT;

CREATE INDEX IF NOT EXISTS orders_customer_idx ON public.orders(customer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS orders_rzp_order_idx ON public.orders(razorpay_order_id);

ALTER TABLE public.wallet_transactions
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS balance_after_inr NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS reference_type TEXT,
  ADD COLUMN IF NOT EXISTS reference_id UUID,
  ADD COLUMN IF NOT EXISTS note TEXT;

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  amount_inr NUMERIC(12,2) NOT NULL,
  method TEXT NOT NULL DEFAULT 'razorpay',
  gateway_reference TEXT,
  status TEXT NOT NULL DEFAULT 'success',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own payments, staff read all" ON public.payments
FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.is_staff(auth.uid()));

CREATE POLICY "Staff insert payments" ON public.payments
FOR INSERT TO authenticated
WITH CHECK (public.is_staff(auth.uid()) OR user_id = auth.uid());

CREATE INDEX IF NOT EXISTS payments_user_idx ON public.payments(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS payments_order_idx ON public.payments(order_id);
