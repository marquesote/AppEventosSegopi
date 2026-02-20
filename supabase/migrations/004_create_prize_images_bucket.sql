-- ============================================
-- Migration 004: Prize Images Storage Bucket
-- ============================================
-- Creates Supabase Storage bucket for prize images
-- with public read access and admin-only write access

-- Create storage bucket for prize images (public read)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'prize-images',
  'prize-images',
  true,
  5242880, -- 5MB max
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Public read access for all prize images
CREATE POLICY "Public read prize images"
ON storage.objects FOR SELECT
USING (bucket_id = 'prize-images');

-- Authenticated admin/organizer can upload
CREATE POLICY "Admin upload prize images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'prize-images'
  AND get_user_role() IN ('admin', 'organizer')
);

-- Authenticated admin/organizer can update
CREATE POLICY "Admin update prize images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'prize-images'
  AND get_user_role() IN ('admin', 'organizer')
);

-- Authenticated admin/organizer can delete
CREATE POLICY "Admin delete prize images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'prize-images'
  AND get_user_role() IN ('admin', 'organizer')
);
