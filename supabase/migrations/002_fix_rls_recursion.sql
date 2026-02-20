-- ============================================
-- FIX: Recursion infinita en RLS policies
-- Crear funcion SECURITY DEFINER para leer rol
-- sin pasar por RLS de profiles
-- ============================================

-- Funcion helper que bypasses RLS
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$;

-- ============================================
-- Drop ALL existing policies
-- ============================================
DROP POLICY IF EXISTS "Users read own profile" ON profiles;
DROP POLICY IF EXISTS "Admins manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Published events are publicly readable" ON events;
DROP POLICY IF EXISTS "Admins and organizers manage events" ON events;
DROP POLICY IF EXISTS "Anyone can insert registrations" ON registrations;
DROP POLICY IF EXISTS "Admins and organizers read registrations" ON registrations;
DROP POLICY IF EXISTS "Admins and organizers update registrations" ON registrations;
DROP POLICY IF EXISTS "Anyone can insert consents" ON consents;
DROP POLICY IF EXISTS "Admins read consents" ON consents;
DROP POLICY IF EXISTS "Anyone can insert suppression" ON suppression_list;
DROP POLICY IF EXISTS "Admins manage suppression list" ON suppression_list;
DROP POLICY IF EXISTS "Admins manage workflows" ON workflow_definitions;
DROP POLICY IF EXISTS "Admins manage workflow executions" ON workflow_executions;
DROP POLICY IF EXISTS "Admins manage raffles" ON raffles;
DROP POLICY IF EXISTS "Admins manage raffle entries" ON raffle_entries;
DROP POLICY IF EXISTS "Admins read metrics" ON event_metrics;

-- ============================================
-- Recreate policies using get_user_role()
-- ============================================

-- Profiles: usuarios leen su propio perfil, admins gestionan todos
CREATE POLICY "Users read own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Admins manage all profiles"
  ON profiles FOR ALL
  USING (public.get_user_role() = 'admin');

-- Events: publicados son de lectura publica
CREATE POLICY "Published events are publicly readable"
  ON events FOR SELECT
  USING (status IN ('published', 'closed'));

CREATE POLICY "Admins and organizers manage events"
  ON events FOR ALL
  USING (public.get_user_role() IN ('admin', 'organizer'));

-- Registrations
CREATE POLICY "Anyone can insert registrations"
  ON registrations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins and organizers read registrations"
  ON registrations FOR SELECT
  USING (public.get_user_role() IN ('admin', 'organizer'));

CREATE POLICY "Admins and organizers update registrations"
  ON registrations FOR UPDATE
  USING (public.get_user_role() IN ('admin', 'organizer'));

-- Consents
CREATE POLICY "Anyone can insert consents"
  ON consents FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins read consents"
  ON consents FOR SELECT
  USING (public.get_user_role() IN ('admin', 'organizer'));

-- Consents: allow updating withdrawn_at for unsubscribe flow
CREATE POLICY "Anyone can update consents"
  ON consents FOR UPDATE
  WITH CHECK (true);

-- Suppression list
CREATE POLICY "Anyone can insert suppression"
  ON suppression_list FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins manage suppression list"
  ON suppression_list FOR ALL
  USING (public.get_user_role() = 'admin');

-- Workflows
CREATE POLICY "Admins manage workflows"
  ON workflow_definitions FOR ALL
  USING (public.get_user_role() IN ('admin', 'organizer'));

CREATE POLICY "Admins manage workflow executions"
  ON workflow_executions FOR ALL
  USING (public.get_user_role() IN ('admin', 'organizer'));

-- Allow public insert for workflow executions (cron/webhooks)
CREATE POLICY "Anyone can insert workflow executions"
  ON workflow_executions FOR INSERT
  WITH CHECK (true);

-- Allow public update for workflow executions (webhooks update status)
CREATE POLICY "Anyone can update workflow executions"
  ON workflow_executions FOR UPDATE
  WITH CHECK (true);

-- Raffles
CREATE POLICY "Admins manage raffles"
  ON raffles FOR ALL
  USING (public.get_user_role() IN ('admin', 'organizer'));

CREATE POLICY "Admins manage raffle entries"
  ON raffle_entries FOR ALL
  USING (public.get_user_role() IN ('admin', 'organizer'));

-- Metrics
CREATE POLICY "Admins read metrics"
  ON event_metrics FOR SELECT
  USING (public.get_user_role() IN ('admin', 'organizer'));
