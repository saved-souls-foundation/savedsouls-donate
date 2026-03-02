-- Storage voor sociale media planner: bucket "social-media-uploads".
-- Maak de bucket handmatig in Dashboard → Storage → New bucket:
--   Naam: social-media-uploads, Public (voor publieke URLs), max 50 MB.
-- Toegestane types: image/jpeg, image/png, image/gif, video/mp4, video/quicktime (mov).

-- Admin mag objecten in deze bucket bekijken en verwijderen
CREATE POLICY social_media_uploads_admin_select ON storage.objects
  FOR SELECT USING (
    bucket_id = 'social-media-uploads'
    AND public.is_admin()
  );

-- Admin mag uploaden naar deze bucket
CREATE POLICY social_media_uploads_admin_insert ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'social-media-uploads'
    AND public.is_admin()
  );

-- Admin mag verwijderen
CREATE POLICY social_media_uploads_admin_delete ON storage.objects
  FOR DELETE USING (
    bucket_id = 'social-media-uploads'
    AND public.is_admin()
  );
