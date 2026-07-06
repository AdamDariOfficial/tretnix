
CREATE TABLE public.contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  business_name text,
  needs text[] NOT NULL DEFAULT '{}',
  starting_point text,
  message text NOT NULL,
  privacy_accepted boolean NOT NULL DEFAULT false,
  source_path text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.contact_requests TO anon;
GRANT INSERT ON public.contact_requests TO authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_requests TO authenticated;
GRANT ALL ON public.contact_requests TO service_role;

ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a contact request (but only with sensible values)
CREATE POLICY "Anyone can submit a contact request"
  ON public.contact_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    privacy_accepted = true
    AND length(full_name) BETWEEN 1 AND 200
    AND length(email) BETWEEN 3 AND 320
    AND length(message) BETWEEN 1 AND 5000
    AND (phone IS NULL OR length(phone) <= 60)
    AND (business_name IS NULL OR length(business_name) <= 200)
    AND (starting_point IS NULL OR length(starting_point) <= 200)
    AND coalesce(array_length(needs, 1), 0) <= 20
    AND status = 'new'
  );

-- Only admins can read / update / delete
CREATE POLICY "Admins can read contact requests"
  ON public.contact_requests
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update contact requests"
  ON public.contact_requests
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete contact requests"
  ON public.contact_requests
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER contact_requests_touch_updated_at
  BEFORE UPDATE ON public.contact_requests
  FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

CREATE INDEX contact_requests_created_at_idx ON public.contact_requests (created_at DESC);
CREATE INDEX contact_requests_status_idx ON public.contact_requests (status);
