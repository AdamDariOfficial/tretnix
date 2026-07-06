
CREATE POLICY "public read project images" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'project-images');
CREATE POLICY "admins upload project images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'project-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update project images" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'project-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete project images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'project-images' AND public.has_role(auth.uid(), 'admin'));
