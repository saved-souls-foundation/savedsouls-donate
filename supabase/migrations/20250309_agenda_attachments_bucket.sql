-- Storage policies voor bucket agenda-attachments (maak bucket in Dashboard indien nodig).
CREATE POLICY agenda_attachments_admin_insert ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'agenda-attachments'
    AND public.is_admin()
  );

CREATE POLICY agenda_attachments_admin_select ON storage.objects
  FOR SELECT USING (
    bucket_id = 'agenda-attachments'
    AND public.is_admin()
  );

CREATE POLICY agenda_attachments_admin_delete ON storage.objects
  FOR DELETE USING (
    bucket_id = 'agenda-attachments'
    AND public.is_admin()
  );
