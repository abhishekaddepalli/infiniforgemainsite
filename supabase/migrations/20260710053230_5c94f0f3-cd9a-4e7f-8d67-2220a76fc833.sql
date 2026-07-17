ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS youtube_privacy_mode boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS block_youtube_links boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS player_accent_color text NOT NULL DEFAULT '#2563eb';

UPDATE public.courses
SET youtube_privacy_mode = false,
    block_youtube_links = true,
    player_accent_color = COALESCE(NULLIF(player_accent_color, ''), '#2563eb')
WHERE youtube_privacy_mode IS DISTINCT FROM false
   OR block_youtube_links IS DISTINCT FROM true
   OR player_accent_color IS NULL
   OR player_accent_color = '';

ALTER TABLE public.courses
  ADD CONSTRAINT courses_player_accent_color_format
  CHECK (player_accent_color ~ '^#[0-9A-Fa-f]{6}$');