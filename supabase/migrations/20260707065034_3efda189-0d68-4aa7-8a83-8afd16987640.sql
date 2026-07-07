-- project_media table for images/videos linked to projects
CREATE TABLE public.project_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('image','video')),
  url TEXT NOT NULL,
  caption TEXT,
  alt_text TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX project_media_project_idx ON public.project_media(project_id, sort_order);

GRANT SELECT ON public.project_media TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_media TO authenticated;
GRANT ALL ON public.project_media TO service_role;

ALTER TABLE public.project_media ENABLE ROW LEVEL SECURITY;

-- Public can read media only for visible projects
CREATE POLICY "Public read media for visible projects"
  ON public.project_media FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_media.project_id AND p.is_visible = true));

-- Admins can read all
CREATE POLICY "Admins read all media"
  ON public.project_media FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can insert
CREATE POLICY "Admins insert media"
  ON public.project_media FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can update
CREATE POLICY "Admins update media"
  ON public.project_media FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can delete
CREATE POLICY "Admins delete media"
  ON public.project_media FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_project_media_touch
  BEFORE UPDATE ON public.project_media
  FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();