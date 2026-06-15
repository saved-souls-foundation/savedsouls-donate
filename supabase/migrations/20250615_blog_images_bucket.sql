-- Storage voor blog hero/cover afbeeldingen.
-- Maak de bucket handmatig in Dashboard → Storage → New bucket:
--   Naam: blog-images, Public (voor publieke URLs), max 10 MB.
-- Toegestane types: image/jpeg, image/png, image/gif, image/webp.

-- Publiek leesbaar (blog toont afbeeldingen zonder login)
CREATE POLICY blog_images_public_select ON storage.objects
  FOR SELECT USING (bucket_id = 'blog-images');

-- Admin mag uploaden
CREATE POLICY blog_images_admin_insert ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'blog-images'
    AND public.is_admin()
  );

-- Admin mag verwijderen
CREATE POLICY blog_images_admin_delete ON storage.objects
  FOR DELETE USING (
    bucket_id = 'blog-images'
    AND public.is_admin()
  );
