GRANT SELECT ON public.project_media TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.project_media TO authenticated;
GRANT ALL ON public.project_media TO service_role;