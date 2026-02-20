-- ============================================
-- MIGRACION: Crear esquema de Eventos SEGOPI
-- ============================================

-- ============================================
-- Tabla: profiles (base para auth)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'viewer'
    CHECK (role IN ('admin', 'organizer', 'viewer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- Tabla: events
-- ============================================
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  seo_title TEXT,
  seo_description TEXT,
  og_image_url TEXT,

  event_date DATE NOT NULL,
  event_start_time TIME NOT NULL,
  event_end_time TIME NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'Europe/Madrid',
  venue_name TEXT NOT NULL,
  venue_address TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Espana',
  google_maps_embed_url TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  benefits JSONB DEFAULT '[]'::jsonb,
  speakers JSONB DEFAULT '[]'::jsonb,
  gallery_images JSONB DEFAULT '[]'::jsonb,

  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed', 'completed', 'cancelled')),
  max_capacity INTEGER,
  registration_deadline TIMESTAMPTZ,

  created_by UUID REFERENCES profiles(id),

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_event_date ON events(event_date);

-- ============================================
-- Tabla: registrations
-- ============================================
CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  email_verified BOOLEAN NOT NULL DEFAULT false,
  email_verification_token TEXT,
  phone TEXT NOT NULL,
  phone_country_code TEXT NOT NULL DEFAULT '+34',
  company TEXT,
  position TEXT,

  attendance_status TEXT NOT NULL DEFAULT 'registered'
    CHECK (attendance_status IN ('registered', 'confirmed', 'attended', 'no_show', 'cancelled')),
  checked_in_at TIMESTAMPTZ,

  registration_ip TEXT NOT NULL,
  user_agent TEXT,

  raffle_eligible BOOLEAN NOT NULL DEFAULT true,

  tags TEXT[] DEFAULT '{}',

  lead_score INTEGER NOT NULL DEFAULT 0,
  lead_status TEXT NOT NULL DEFAULT 'new'
    CHECK (lead_status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),

  nps_score INTEGER CHECK (nps_score >= 0 AND nps_score <= 10),
  survey_completed_at TIMESTAMPTZ,

  internal_notes TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(event_id, email)
);

CREATE INDEX idx_registrations_event ON registrations(event_id);
CREATE INDEX idx_registrations_email ON registrations(email);
CREATE INDEX idx_registrations_attendance ON registrations(attendance_status);
CREATE INDEX idx_registrations_lead_status ON registrations(lead_status);

-- ============================================
-- Tabla: consents (RGPD)
-- ============================================
CREATE TABLE IF NOT EXISTS consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,

  consent_type TEXT NOT NULL
    CHECK (consent_type IN ('privacy_policy', 'commercial_communications', 'raffle_participation')),
  granted BOOLEAN NOT NULL,

  consent_timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  consent_ip TEXT NOT NULL,
  consent_user_agent TEXT,

  withdrawn_at TIMESTAMPTZ,
  withdrawn_ip TEXT,

  policy_version TEXT NOT NULL DEFAULT '1.0',

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_consents_registration ON consents(registration_id);
CREATE INDEX idx_consents_type ON consents(consent_type);

-- ============================================
-- Tabla: suppression_list
-- ============================================
CREATE TABLE IF NOT EXISTS suppression_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('unsubscribe', 'deletion_request', 'bounce', 'complaint')),
  suppressed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  requested_ip TEXT,
  data_deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES profiles(id)
);

CREATE INDEX idx_suppression_email ON suppression_list(email);

-- ============================================
-- Tabla: workflow_definitions
-- ============================================
CREATE TABLE IF NOT EXISTS workflow_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL
    CHECK (trigger_type IN ('registration', 'pre_event', 'post_event', 'manual')),
  trigger_offset_hours INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  email_subject TEXT NOT NULL,
  email_template TEXT NOT NULL,
  include_ics_attachment BOOLEAN NOT NULL DEFAULT false,
  target_audience TEXT NOT NULL DEFAULT 'all'
    CHECK (target_audience IN ('all', 'attendees', 'no_shows', 'commercial_opted_in')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- Tabla: workflow_executions
-- ============================================
CREATE TABLE IF NOT EXISTS workflow_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES workflow_definitions(id),
  event_id UUID NOT NULL REFERENCES events(id),
  registration_id UUID REFERENCES registrations(id),

  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed')),

  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  error_message TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  resend_email_id TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_executions_workflow ON workflow_executions(workflow_id);
CREATE INDEX idx_executions_event ON workflow_executions(event_id);
CREATE INDEX idx_executions_status ON workflow_executions(status);

-- ============================================
-- Tabla: raffles
-- ============================================
CREATE TABLE IF NOT EXISTS raffles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  prize_description TEXT NOT NULL,

  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),

  num_winners INTEGER NOT NULL DEFAULT 1,
  require_attendance BOOLEAN NOT NULL DEFAULT true,
  require_raffle_consent BOOLEAN NOT NULL DEFAULT false,

  executed_at TIMESTAMPTZ,
  executed_by UUID REFERENCES profiles(id),
  random_seed TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- Tabla: raffle_entries
-- ============================================
CREATE TABLE IF NOT EXISTS raffle_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  raffle_id UUID NOT NULL REFERENCES raffles(id) ON DELETE CASCADE,
  registration_id UUID NOT NULL REFERENCES registrations(id),

  is_winner BOOLEAN NOT NULL DEFAULT false,
  winner_position INTEGER,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(raffle_id, registration_id)
);

CREATE INDEX idx_raffle_entries_raffle ON raffle_entries(raffle_id);
CREATE INDEX idx_raffle_entries_winner ON raffle_entries(is_winner) WHERE is_winner = true;

-- ============================================
-- Tabla: event_metrics
-- ============================================
CREATE TABLE IF NOT EXISTS event_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  metric_date DATE NOT NULL,

  total_registrations INTEGER NOT NULL DEFAULT 0,
  new_registrations INTEGER NOT NULL DEFAULT 0,
  emails_sent INTEGER NOT NULL DEFAULT 0,
  emails_opened INTEGER NOT NULL DEFAULT 0,
  emails_clicked INTEGER NOT NULL DEFAULT 0,
  surveys_sent INTEGER NOT NULL DEFAULT 0,
  surveys_completed INTEGER NOT NULL DEFAULT 0,
  avg_nps_score DECIMAL(3,1),
  leads_contacted INTEGER NOT NULL DEFAULT 0,
  leads_converted INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(event_id, metric_date)
);

-- ============================================
-- RLS Policies
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppression_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE raffles ENABLE ROW LEVEL SECURITY;
ALTER TABLE raffle_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_metrics ENABLE ROW LEVEL SECURITY;

-- Profiles: usuarios leen su propio perfil, admins leen todos
CREATE POLICY "Users read own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Admins manage all profiles"
  ON profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'admin'
    )
  );

-- Events: publicados son de lectura publica
CREATE POLICY "Published events are publicly readable"
  ON events FOR SELECT
  USING (status IN ('published', 'closed'));

CREATE POLICY "Admins and organizers manage events"
  ON events FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'organizer')
    )
  );

-- Registrations: service role inserta, admin/organizer lee
CREATE POLICY "Anyone can insert registrations"
  ON registrations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins and organizers read registrations"
  ON registrations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'organizer')
    )
  );

CREATE POLICY "Admins and organizers update registrations"
  ON registrations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'organizer')
    )
  );

-- Consents: inserta cualquiera, lee solo admin (inmutables)
CREATE POLICY "Anyone can insert consents"
  ON consents FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins read consents"
  ON consents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'organizer')
    )
  );

-- Suppression list: admin gestiona, insert publico para unsubscribe/webhooks
CREATE POLICY "Anyone can insert suppression"
  ON suppression_list FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins manage suppression list"
  ON suppression_list FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Workflows: admin/organizer
CREATE POLICY "Admins manage workflows"
  ON workflow_definitions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'organizer')
    )
  );

CREATE POLICY "Admins manage workflow executions"
  ON workflow_executions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'organizer')
    )
  );

-- Raffles: admin/organizer
CREATE POLICY "Admins manage raffles"
  ON raffles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'organizer')
    )
  );

CREATE POLICY "Admins manage raffle entries"
  ON raffle_entries FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'organizer')
    )
  );

-- Metrics: admin/organizer lectura
CREATE POLICY "Admins read metrics"
  ON event_metrics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'organizer')
    )
  );

-- ============================================
-- Funciones y Triggers
-- ============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_profiles BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at_events BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at_registrations BEFORE UPDATE ON registrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at_raffles BEFORE UPDATE ON raffles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at_workflows BEFORE UPDATE ON workflow_definitions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Funcion de sorteo auditable
CREATE OR REPLACE FUNCTION execute_raffle(
  p_raffle_id UUID,
  p_executed_by UUID
)
RETURNS SETOF raffle_entries AS $$
DECLARE
  v_raffle raffles%ROWTYPE;
  v_seed TEXT;
BEGIN
  SELECT * INTO v_raffle FROM raffles WHERE id = p_raffle_id;

  IF v_raffle.status != 'pending' THEN
    RAISE EXCEPTION 'Raffle already executed or cancelled';
  END IF;

  v_seed := gen_random_uuid()::text;

  UPDATE raffles SET
    status = 'completed',
    executed_at = now(),
    executed_by = p_executed_by,
    random_seed = v_seed
  WHERE id = p_raffle_id;

  WITH eligible AS (
    SELECT re.id, re.registration_id,
           ROW_NUMBER() OVER (ORDER BY md5(v_seed || re.registration_id::text)) as rn
    FROM raffle_entries re
    JOIN registrations r ON r.id = re.registration_id
    WHERE re.raffle_id = p_raffle_id
      AND (NOT v_raffle.require_attendance OR r.attendance_status = 'attended')
  )
  UPDATE raffle_entries SET
    is_winner = true,
    winner_position = eligible.rn
  FROM eligible
  WHERE raffle_entries.id = eligible.id
    AND eligible.rn <= v_raffle.num_winners;

  RETURN QUERY
    SELECT * FROM raffle_entries
    WHERE raffle_id = p_raffle_id AND is_winner = true
    ORDER BY winner_position;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-crear perfil en signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'viewer')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- Seed: Workflow definitions predefinidos
-- ============================================
INSERT INTO workflow_definitions (name, description, trigger_type, trigger_offset_hours, email_subject, email_template, include_ics_attachment, target_audience) VALUES
('registration_confirmation', 'Email de confirmacion de inscripcion', 'registration', 0, 'Confirmacion de inscripcion: {{event_title}}', 'registration_confirmation', true, 'all'),
('pre_event_reminder', 'Recordatorio 48h antes del evento', 'pre_event', -48, 'Recordatorio: {{event_title}} es en 2 dias', 'pre_event_reminder', false, 'all'),
('post_event_thankyou', 'Agradecimiento post-evento + NPS', 'post_event', 24, 'Gracias por asistir a {{event_title}}', 'post_event_thankyou', false, 'attendees'),
('post_event_sales_notification', 'Notificacion al equipo de ventas', 'post_event', 72, 'Lista de leads: {{event_title}}', 'post_event_sales_notification', false, 'attendees'),
('post_event_commercial', 'Email comercial post-evento', 'post_event', 168, 'Oferta especial tras {{event_title}}', 'post_event_commercial', false, 'commercial_opted_in');
