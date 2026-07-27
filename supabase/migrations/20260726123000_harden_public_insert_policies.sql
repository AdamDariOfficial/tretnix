-- Keep public form and analytics inserts intentionally narrow.
-- Public clients may only provide the columns required by the corresponding UI flows;
-- server-managed identifiers, statuses and timestamps keep their defaults.

REVOKE INSERT ON TABLE public.analytics_events FROM anon, authenticated;
GRANT INSERT (
  event_type,
  path,
  project_slug,
  referrer_host,
  device_type,
  viewport_width
) ON TABLE public.analytics_events TO anon, authenticated;

DROP POLICY IF EXISTS "anyone can insert analytics" ON public.analytics_events;
CREATE POLICY "anyone can insert analytics"
  ON public.analytics_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    event_type IN (
      'page_view',
      'cta_click',
      'email_click',
      'phone_click',
      'case_study_view',
      'project_card_click',
      'contact_form_submit'
    )
    AND (path IS NULL OR length(path) <= 200)
    AND (project_slug IS NULL OR length(project_slug) <= 80)
    AND (referrer_host IS NULL OR length(referrer_host) <= 120)
    AND (device_type IS NULL OR device_type IN ('mobile', 'tablet', 'desktop'))
    AND (viewport_width IS NULL OR viewport_width BETWEEN 0 AND 10000)
  );

REVOKE INSERT ON TABLE public.contact_requests FROM anon, authenticated;
GRANT INSERT (
  full_name,
  email,
  phone,
  business_name,
  needs,
  starting_point,
  message,
  privacy_accepted,
  source_path
) ON TABLE public.contact_requests TO anon, authenticated;

DROP POLICY IF EXISTS "Anyone can submit a contact request" ON public.contact_requests;
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
    AND (source_path IS NULL OR length(source_path) <= 200)
    AND coalesce(array_length(needs, 1), 0) <= 20
    AND status = 'new'
  );
