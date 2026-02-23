-- Migration 003: Add QR token for event check-in
-- Each registration gets a unique QR token to show at event entrance

ALTER TABLE public.registrations
  ADD COLUMN IF NOT EXISTS qr_token TEXT UNIQUE;

CREATE INDEX IF NOT EXISTS idx_registrations_qr_token ON public.registrations(qr_token);

-- Track when thank-you email was sent after attendance
ALTER TABLE public.registrations
  ADD COLUMN IF NOT EXISTS thanked_at TIMESTAMPTZ;
