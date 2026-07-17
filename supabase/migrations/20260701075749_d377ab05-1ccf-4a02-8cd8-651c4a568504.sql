
-- ticket_replies
CREATE TABLE public.ticket_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT,
  is_staff BOOLEAN NOT NULL DEFAULT false,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.ticket_replies TO authenticated;
GRANT ALL ON public.ticket_replies TO service_role;

ALTER TABLE public.ticket_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers view own ticket replies" ON public.ticket_replies
FOR SELECT TO authenticated
USING (
  public.is_staff(auth.uid())
  OR EXISTS (SELECT 1 FROM public.tickets t WHERE t.id = ticket_id AND t.customer_id = auth.uid())
);

CREATE POLICY "Customers reply on own tickets, staff reply on any" ON public.ticket_replies
FOR INSERT TO authenticated
WITH CHECK (
  author_id = auth.uid() AND (
    public.is_staff(auth.uid())
    OR EXISTS (SELECT 1 FROM public.tickets t WHERE t.id = ticket_id AND t.customer_id = auth.uid())
  )
);

CREATE INDEX ticket_replies_ticket_idx ON public.ticket_replies(ticket_id, created_at);

-- Auto-create wallet on new profile
CREATE OR REPLACE FUNCTION public.create_wallet_for_profile()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.wallets (user_id, balance_inr, frozen)
  VALUES (NEW.id, 0, false)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS create_wallet_on_profile ON public.profiles;
CREATE TRIGGER create_wallet_on_profile
AFTER INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.create_wallet_for_profile();

-- Backfill wallets for existing profiles
INSERT INTO public.wallets (user_id, balance_inr, frozen)
SELECT p.id, 0, false FROM public.profiles p
LEFT JOIN public.wallets w ON w.user_id = p.id
WHERE w.id IS NULL;
