
-- Membership tiers
CREATE TABLE public.membership_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  rank integer NOT NULL DEFAULT 0,
  color text NOT NULL DEFAULT '#10b981',
  gradient_from text NOT NULL DEFAULT '#10b981',
  gradient_to text NOT NULL DEFAULT '#059669',
  price_inr numeric NOT NULL DEFAULT 0,
  duration_days integer,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.membership_tiers TO anon, authenticated;
GRANT ALL ON public.membership_tiers TO service_role;
ALTER TABLE public.membership_tiers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tiers public read" ON public.membership_tiers FOR SELECT USING (true);
CREATE POLICY "tiers admin write" ON public.membership_tiers FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER membership_tiers_updated_at BEFORE UPDATE ON public.membership_tiers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- User memberships
CREATE TABLE public.user_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier_id uuid NOT NULL REFERENCES public.membership_tiers(id) ON DELETE RESTRICT,
  starts_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  source text NOT NULL DEFAULT 'free',
  auto_renew boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'active',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX user_memberships_user_id_idx ON public.user_memberships(user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_memberships TO authenticated;
GRANT ALL ON public.user_memberships TO service_role;
ALTER TABLE public.user_memberships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own membership read" ON public.user_memberships FOR SELECT USING (auth.uid() = user_id OR public.is_admin(auth.uid()));
CREATE POLICY "admin manage memberships" ON public.user_memberships FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER user_memberships_updated_at BEFORE UPDATE ON public.user_memberships FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Resource access rules
CREATE TABLE public.resource_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_type text NOT NULL,
  resource_id text,
  min_tier_rank integer NOT NULL DEFAULT 0,
  required_tier_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(resource_type, resource_id)
);
GRANT SELECT ON public.resource_access TO anon, authenticated;
GRANT ALL ON public.resource_access TO service_role;
ALTER TABLE public.resource_access ENABLE ROW LEVEL SECURITY;
CREATE POLICY "access rules public read" ON public.resource_access FOR SELECT USING (true);
CREATE POLICY "access rules admin write" ON public.resource_access FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER resource_access_updated_at BEFORE UPDATE ON public.resource_access FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Helper: active membership tier rank for user
CREATE OR REPLACE FUNCTION public.get_user_tier_rank(_user_id uuid)
RETURNS integer LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE(MAX(t.rank), 0)
  FROM public.user_memberships um
  JOIN public.membership_tiers t ON t.id = um.tier_id
  WHERE um.user_id = _user_id
    AND um.status = 'active'
    AND (um.expires_at IS NULL OR um.expires_at > now());
$$;

CREATE OR REPLACE FUNCTION public.has_min_tier(_user_id uuid, _min_rank integer)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.get_user_tier_rank(_user_id) >= _min_rank;
$$;

-- Seed tiers
INSERT INTO public.membership_tiers (slug, name, rank, color, gradient_from, gradient_to, price_inr, duration_days, features, description, sort_order) VALUES
('free',     'Free',     0, '#64748b', '#94a3b8', '#475569', 0,     NULL, '["Basic access","Community support"]'::jsonb, 'Get started at no cost', 0),
('silver',   'Silver',   1, '#94a3b8', '#cbd5e1', '#64748b', 499,   30,   '["All Free features","Silver-tier courses","Priority email support"]'::jsonb, 'Great for casual learners', 1),
('gold',     'Gold',     2, '#f59e0b', '#fbbf24', '#d97706', 1499,  90,   '["All Silver features","Gold-tier courses & products","Certificates","Faster support"]'::jsonb, 'Most popular', 2),
('platinum', 'Platinum', 3, '#a855f7', '#c084fc', '#7c3aed', 4999,  365,  '["Everything unlocked","Priority support","Early access","Exclusive events"]'::jsonb, 'Full access, everything unlocked', 3)
ON CONFLICT (slug) DO NOTHING;

-- Backfill: assign every existing user to Free
INSERT INTO public.user_memberships (user_id, tier_id, source, status, expires_at)
SELECT p.id, t.id, 'free', 'active', NULL
FROM public.profiles p
CROSS JOIN public.membership_tiers t
WHERE t.slug = 'free'
ON CONFLICT DO NOTHING;

-- Trigger: give new profiles a Free membership
CREATE OR REPLACE FUNCTION public.create_free_membership_for_profile()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE free_id uuid;
BEGIN
  SELECT id INTO free_id FROM public.membership_tiers WHERE slug='free' LIMIT 1;
  IF free_id IS NOT NULL THEN
    INSERT INTO public.user_memberships (user_id, tier_id, source, status)
    VALUES (NEW.id, free_id, 'free', 'active');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_create_free_membership ON public.profiles;
CREATE TRIGGER profiles_create_free_membership
AFTER INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.create_free_membership_for_profile();
