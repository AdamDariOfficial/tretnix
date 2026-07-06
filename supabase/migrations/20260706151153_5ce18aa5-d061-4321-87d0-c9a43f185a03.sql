
-- ================== ROLES ==================
CREATE TYPE public.app_role AS ENUM ('admin', 'editor');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "users read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- ================== SITE SETTINGS ==================
CREATE TABLE public.site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  contact_email TEXT NOT NULL DEFAULT 'hello@tretnix.com',
  contact_phone TEXT NOT NULL DEFAULT '+39 049 000 0000',
  location TEXT NOT NULL DEFAULT 'Padova, Italia',
  cta_email_subject TEXT NOT NULL DEFAULT 'Nuovo progetto Tretnix',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT singleton CHECK (id = 1)
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read site settings" ON public.site_settings
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins update site settings" ON public.site_settings
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.site_settings (id) VALUES (1) ON CONFLICT DO NOTHING;

-- ================== PROJECTS ==================
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Gestionale',
  short_description TEXT NOT NULL DEFAULT '',
  overview TEXT NOT NULL DEFAULT '',
  problem TEXT NOT NULL DEFAULT '',
  solution TEXT NOT NULL DEFAULT '',
  audience TEXT NOT NULL DEFAULT '',
  features TEXT[] NOT NULL DEFAULT '{}',
  impact_points TEXT[] NOT NULL DEFAULT '{}',
  modules TEXT[] NOT NULL DEFAULT '{}',
  workflow_steps TEXT[] NOT NULL DEFAULT '{}',
  customizations TEXT[] NOT NULL DEFAULT '{}',
  tech_stack TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT,
  gradient TEXT NOT NULL DEFAULT 'bg-[radial-gradient(ellipse_at_top,#0B2A4A,#020814_70%),linear-gradient(135deg,#061326,#020814)]',
  badge TEXT DEFAULT 'Concept interno / Demo portfolio',
  is_concept BOOLEAN NOT NULL DEFAULT true,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 100,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX projects_visible_idx ON public.projects(is_visible, sort_order);
GRANT SELECT ON public.projects TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read visible projects" ON public.projects
  FOR SELECT TO anon, authenticated USING (is_visible = true);
CREATE POLICY "admins read all projects" ON public.projects
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins insert projects" ON public.projects
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update projects" ON public.projects
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete projects" ON public.projects
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ================== ANALYTICS ==================
CREATE TABLE public.analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event_type TEXT NOT NULL,
  path TEXT,
  project_slug TEXT,
  referrer_host TEXT,
  device_type TEXT,
  viewport_width INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX analytics_events_created_idx ON public.analytics_events(created_at DESC);
CREATE INDEX analytics_events_type_idx ON public.analytics_events(event_type);
GRANT INSERT ON public.analytics_events TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.analytics_events_id_seq TO anon, authenticated;
GRANT SELECT ON public.analytics_events TO authenticated;
GRANT ALL ON public.analytics_events TO service_role;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can insert analytics" ON public.analytics_events
  FOR INSERT TO anon, authenticated WITH CHECK (
    event_type IN ('page_view','cta_click','email_click','phone_click','case_study_view','project_card_click')
    AND (path IS NULL OR length(path) <= 200)
    AND (project_slug IS NULL OR length(project_slug) <= 80)
    AND (referrer_host IS NULL OR length(referrer_host) <= 120)
    AND (device_type IS NULL OR device_type IN ('mobile','tablet','desktop'))
  );
CREATE POLICY "admins read analytics" ON public.analytics_events
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ================== TRIGGERS ==================
CREATE OR REPLACE FUNCTION public.tg_touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER projects_touch BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();
CREATE TRIGGER settings_touch BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.tg_touch_updated_at();

-- ================== SEED PROJECTS ==================
INSERT INTO public.projects (slug, title, category, short_description, overview, problem, solution, audience, features, impact_points, modules, workflow_steps, customizations, tech_stack, gradient, is_visible, is_featured, sort_order) VALUES
('fitzone', 'FitZone', 'Fitness Management Platform',
 'Concept di piattaforma digitale per centri fitness e wellness con gestione utenti, programmi, community, messaggi e statistiche.',
 'FitZone è un concept di piattaforma digitale pensata per palestre, personal trainer e centri wellness che vogliono gestire utenti, programmi, comunicazioni e attività da un unico sistema.',
 'Molte strutture fitness usano strumenti separati per schede di allenamento, messaggi, prenotazioni, pagamenti e comunicazioni con gli iscritti. Questo crea confusione, dati sparsi e difficoltà nel seguire ogni cliente in modo ordinato.',
 'La piattaforma centralizza profili utenti, programmi di allenamento, messaggi, community, statistiche e attività, offrendo al team una visione più chiara e agli utenti un''esperienza digitale più semplice.',
 'Palestre, centri wellness e personal trainer che vogliono un sistema unico per gestire iscritti, programmi e comunicazioni.',
 ARRAY['Gestione utenti e profili','Programmi di allenamento','Community interna','Messaggi e comunicazioni','Dashboard statistiche','Area personale mobile-first'],
 ARRAY['Meno comunicazioni sparse','Maggiore controllo sugli iscritti','Esperienza più professionale per i clienti','Gestione più ordinata del lavoro quotidiano'],
 ARRAY['Anagrafica utenti','Schede allenamento','Community & messaggi','Statistiche & KPI','Area cliente mobile'],
 ARRAY['Iscrizione utente','Assegnazione programma','Comunicazione via messaggi','Monitoraggio progressi','Reportistica periodica'],
 ARRAY['Branding e temi','Ruoli e permessi','Integrazioni con sistemi di pagamento','Notifiche push personalizzate'],
 ARRAY['React','TanStack Start','Postgres','Supabase','Tailwind'],
 'bg-[radial-gradient(ellipse_at_top,#0B2A4A,#020814_70%),linear-gradient(135deg,#061326,#020814)]',
 true, true, 10),
('supplyflow', 'SupplyFlow', 'Supplier & Operations System',
 'Concept di web app mobile-first per gestire fornitori, prodotti, sessioni d''acquisto, quantità e storico operativo.',
 'SupplyFlow è un concept di web app mobile-first progettata per attività che devono gestire acquisti, fornitori, prodotti, quantità e storico operativo in modo rapido e ordinato.',
 'Molte attività gestiscono ordini e acquisti con liste cartacee, messaggi WhatsApp o fogli Excel. Questo può causare dimenticanze, quantità sbagliate, poca tracciabilità e difficoltà nel coordinare il team.',
 'SupplyFlow permette di creare sessioni d''acquisto, selezionare fornitori, aggiornare quantità, consultare lo storico e mantenere tutto il processo centralizzato in una piattaforma accessibile da telefono.',
 'Ristoranti, bar, negozi e attività operative che gestiscono ordini ricorrenti con più fornitori.',
 ARRAY['Gestione fornitori','Gestione prodotti','Sessioni d''acquisto','Storico quantità','Ricerca e filtri','Interfaccia mobile-first','Ruoli operativi'],
 ARRAY['Meno errori negli acquisti','Ordini più veloci','Storico sempre consultabile','Migliore coordinamento del team'],
 ARRAY['Fornitori','Catalogo prodotti','Sessioni ordini','Storico e report'],
 ARRAY['Apertura sessione','Selezione fornitori','Aggiornamento quantità','Chiusura e archiviazione'],
 ARRAY['Categorie prodotti personalizzate','Unità di misura','Notifiche di conferma','Esportazione dati'],
 ARRAY['React','TanStack Start','Postgres','Supabase','Tailwind'],
 'bg-[radial-gradient(ellipse_at_bottom_right,#123055,#020814_70%),linear-gradient(135deg,#030B1A,#061326)]',
 true, true, 20),
('wealthcore', 'WealthCore', 'Finance Dashboard',
 'Concept di dashboard avanzata per monitorare conti, transazioni, investimenti, obiettivi finanziari e storico patrimoniale.',
 'WealthCore è un concept di dashboard finanziaria progettata per monitorare conti, transazioni, investimenti, obiettivi e andamento patrimoniale in modo centralizzato.',
 'Quando dati finanziari, conti, investimenti e obiettivi sono sparsi tra più strumenti, diventa difficile avere una visione chiara e aggiornata della situazione.',
 'La dashboard centralizza dati, grafici, movimenti, conti e obiettivi, offrendo una panoramica ordinata e analisi più leggibili.',
 'Consulenti finanziari, piccoli team di gestione patrimoniale e utenti avanzati che vogliono una visione unificata.',
 ARRAY['Dashboard patrimonio','Gestione conti','Transazioni','Obiettivi finanziari','Grafici e report','Storico andamento','Filtri e categorie'],
 ARRAY['Dati più chiari','Meno confusione tra strumenti','Monitoraggio più veloce','Migliore visione d''insieme'],
 ARRAY['Panoramica patrimonio','Movimenti','Obiettivi','Report analitici'],
 ARRAY['Import dati','Categorizzazione','Analisi ricorrenti','Revisione obiettivi'],
 ARRAY['Categorie personalizzate','Valute multiple','Ruoli utente','Export CSV/PDF'],
 ARRAY['React','TanStack Start','Postgres','Supabase','Tailwind','Recharts'],
 'bg-[radial-gradient(ellipse_at_top_left,#0B2A4A,#020814_70%),linear-gradient(135deg,#061326,#030B1A)]',
 true, false, 30);
