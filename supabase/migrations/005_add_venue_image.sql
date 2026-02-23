-- ============================================
-- Migration 005: Venue Image for Events
-- ============================================
-- Allows admins to upload a custom venue/location image
-- as an alternative to Google Maps embed

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS venue_image_url TEXT;

-- Create storage bucket for venue images (public read)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'venue-images',
  'venue-images',
  true,
  5242880, -- 5MB max
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Public read access
CREATE POLICY "Public read venue images"
ON storage.objects FOR SELECT
USING (bucket_id = 'venue-images');

-- Admin/organizer can upload
CREATE POLICY "Admin upload venue images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'venue-images'
  AND get_user_role() IN ('admin', 'organizer')
);

-- Admin/organizer can update
CREATE POLICY "Admin update venue images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'venue-images'
  AND get_user_role() IN ('admin', 'organizer')
);

-- Admin/organizer can delete
CREATE POLICY "Admin delete venue images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'venue-images'
  AND get_user_role() IN ('admin', 'organizer')
);
