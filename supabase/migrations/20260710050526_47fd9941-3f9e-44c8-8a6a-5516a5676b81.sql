
ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS min_watch_percent integer NOT NULL DEFAULT 95,
  ADD COLUMN IF NOT EXISTS min_quiz_percent integer NOT NULL DEFAULT 85,
  ADD COLUMN IF NOT EXISTS signature_image text,
  ADD COLUMN IF NOT EXISTS signatory_name text,
  ADD COLUMN IF NOT EXISTS signatory_title text;
