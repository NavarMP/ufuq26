-- ============================================================
-- Supabase Storage RLS Policies for UFUQ '26
-- Bucket: ufuq-media
-- ============================================================
-- Run this script in the Supabase SQL Editor (Dashboard > SQL Editor)
-- to allow the Admin Portal to upload speaker photos and audio files.

-- 1. Ensure the bucket exists and is public (run if not already created)
INSERT INTO storage.buckets (id, name, public)
VALUES ('ufuq-media', 'ufuq-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Allow public/anon uploads (INSERT) to the 'ufuq-media' bucket
CREATE POLICY "Allow public uploads to ufuq-media"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'ufuq-media');

-- 3. Allow public reading/downloading (SELECT) from the 'ufuq-media' bucket
CREATE POLICY "Allow public read from ufuq-media"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'ufuq-media');

-- 4. Allow updating/overwriting existing files (UPDATE) in 'ufuq-media'
CREATE POLICY "Allow public update to ufuq-media"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'ufuq-media')
WITH CHECK (bucket_id = 'ufuq-media');

-- 5. Allow deleting files (DELETE) from 'ufuq-media'
CREATE POLICY "Allow public delete from ufuq-media"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'ufuq-media');
