
-- 1. Workflow configuration tables
CREATE TABLE IF NOT EXISTS public.ticket_departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  default_assignee uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email text,
  active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ticket_departments TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.ticket_departments TO authenticated;
GRANT ALL ON public.ticket_departments TO service_role;
ALTER TABLE public.ticket_departments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read departments" ON public.ticket_departments FOR SELECT TO authenticated USING (true);
CREATE POLICY "admins manage departments" ON public.ticket_departments FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE IF NOT EXISTS public.ticket_priorities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  color text NOT NULL DEFAULT '#64748b',
  sla_response_mins int NOT NULL DEFAULT 240,
  sla_resolve_mins int NOT NULL DEFAULT 1440,
  sort_order int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ticket_priorities TO authenticated;
GRANT ALL ON public.ticket_priorities TO service_role;
ALTER TABLE public.ticket_priorities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read priorities" ON public.ticket_priorities FOR SELECT TO authenticated USING (true);
CREATE POLICY "admins manage priorities" ON public.ticket_priorities FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE IF NOT EXISTS public.ticket_routing_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  match_department text,
  match_priority text,
  match_keyword text,
  assign_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  set_priority text,
  set_status text,
  active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ticket_routing_rules TO authenticated;
GRANT ALL ON public.ticket_routing_rules TO service_role;
ALTER TABLE public.ticket_routing_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff read routing" ON public.ticket_routing_rules FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));
CREATE POLICY "admins manage routing" ON public.ticket_routing_rules FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- 2. Ticket columns
ALTER TABLE public.tickets
  ADD COLUMN IF NOT EXISTS sla_due_at timestamptz,
  ADD COLUMN IF NOT EXISTS first_response_at timestamptz,
  ADD COLUMN IF NOT EXISTS resolved_at timestamptz,
  ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}';

-- 3. Auto-route on insert: apply routing rule, set SLA from priority
CREATE OR REPLACE FUNCTION public.apply_ticket_workflow()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rule record;
  prio record;
  dept record;
BEGIN
  -- Apply first matching active routing rule
  SELECT * INTO rule FROM public.ticket_routing_rules
    WHERE active = true
      AND (match_department IS NULL OR match_department = NEW.department)
      AND (match_priority IS NULL OR match_priority = NEW.priority)
      AND (match_keyword IS NULL OR
           NEW.subject ILIKE '%' || match_keyword || '%' OR
           COALESCE(NEW.description,'') ILIKE '%' || match_keyword || '%')
    ORDER BY sort_order ASC, created_at ASC
    LIMIT 1;
  IF FOUND THEN
    IF rule.assign_to IS NOT NULL AND NEW.assigned_to IS NULL THEN
      NEW.assigned_to := rule.assign_to;
    END IF;
    IF rule.set_priority IS NOT NULL THEN NEW.priority := rule.set_priority; END IF;
    IF rule.set_status IS NOT NULL THEN NEW.status := rule.set_status; END IF;
  END IF;

  -- Fallback to department default assignee
  IF NEW.assigned_to IS NULL THEN
    SELECT * INTO dept FROM public.ticket_departments WHERE slug = NEW.department LIMIT 1;
    IF FOUND AND dept.default_assignee IS NOT NULL THEN
      NEW.assigned_to := dept.default_assignee;
    END IF;
  END IF;

  -- Set SLA due-at from priority
  IF NEW.sla_due_at IS NULL THEN
    SELECT * INTO prio FROM public.ticket_priorities WHERE slug = NEW.priority LIMIT 1;
    IF FOUND THEN
      NEW.sla_due_at := now() + (prio.sla_resolve_mins || ' minutes')::interval;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_apply_ticket_workflow ON public.tickets;
CREATE TRIGGER trg_apply_ticket_workflow BEFORE INSERT ON public.tickets
  FOR EACH ROW EXECUTE FUNCTION public.apply_ticket_workflow();

-- 4. Track resolved timestamp on status change
CREATE OR REPLACE FUNCTION public.track_ticket_status()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.status IN ('resolved','closed') AND OLD.status NOT IN ('resolved','closed') THEN
    NEW.resolved_at := now();
  END IF;
  IF NEW.status NOT IN ('resolved','closed') AND OLD.status IN ('resolved','closed') THEN
    NEW.resolved_at := NULL;
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_track_ticket_status ON public.tickets;
CREATE TRIGGER trg_track_ticket_status BEFORE UPDATE ON public.tickets
  FOR EACH ROW WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION public.track_ticket_status();

-- 5. Track first staff response
CREATE OR REPLACE FUNCTION public.track_ticket_first_response()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.is_staff = true THEN
    UPDATE public.tickets SET first_response_at = now()
    WHERE id = NEW.ticket_id AND first_response_at IS NULL;
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_track_first_response ON public.ticket_replies;
CREATE TRIGGER trg_track_first_response AFTER INSERT ON public.ticket_replies
  FOR EACH ROW EXECUTE FUNCTION public.track_ticket_first_response();

-- 6. Seed defaults (only if empty)
INSERT INTO public.ticket_departments (slug, name, description, sort_order)
SELECT * FROM (VALUES
  ('support','Support','General customer support',1),
  ('sales','Sales','Pre-sales enquiries and quotes',2),
  ('billing','Billing','Invoices, payments, refunds',3),
  ('technical','Technical','Technical / infrastructure issues',4)
) AS v(slug,name,description,sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.ticket_departments);

INSERT INTO public.ticket_priorities (slug, name, color, sla_response_mins, sla_resolve_mins, sort_order)
SELECT * FROM (VALUES
  ('low','Low','#64748b',480,4320,1),
  ('medium','Medium','#3b82f6',240,1440,2),
  ('high','High','#f59e0b',60,480,3),
  ('urgent','Urgent','#ef4444',15,120,4)
) AS v(slug,name,color,r,rv,s)
WHERE NOT EXISTS (SELECT 1 FROM public.ticket_priorities);
