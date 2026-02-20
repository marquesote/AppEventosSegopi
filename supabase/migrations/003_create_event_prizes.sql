-- ============================================================
-- EVENT PRIZES: Premios/regalos por evento para sorteos
-- ============================================================

CREATE TABLE event_prizes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  estimated_value DECIMAL(10,2),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for efficient queries by event
CREATE INDEX idx_event_prizes_event_id ON event_prizes(event_id);

-- Auto-update updated_at
CREATE TRIGGER set_event_prizes_updated_at
  BEFORE UPDATE ON event_prizes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- RLS Policies
-- ============================================================
ALTER TABLE event_prizes ENABLE ROW LEVEL SECURITY;

-- Public: anyone can read active prizes (for landing pages)
CREATE POLICY "event_prizes_public_read"
  ON event_prizes FOR SELECT
  USING (is_active = true);

-- Admin/Organizer: full management
CREATE POLICY "event_prizes_admin_manage"
  ON event_prizes FOR ALL
  USING (get_user_role() IN ('admin', 'organizer'))
  WITH CHECK (get_user_role() IN ('admin', 'organizer'));
