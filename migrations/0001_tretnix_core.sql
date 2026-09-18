PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  location TEXT NOT NULL,
  cta_email_subject TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

INSERT INTO site_settings (id, contact_email, contact_phone, location, cta_email_subject, updated_at)
VALUES (1, 'hello@tretnix.com', '+39 049 000 0000', 'Padova, Italia', 'Nuovo progetto Tretnix', CURRENT_TIMESTAMP)
ON CONFLICT(id) DO NOTHING;

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  short_description TEXT NOT NULL DEFAULT '',
  overview TEXT NOT NULL DEFAULT '',
  problem TEXT NOT NULL DEFAULT '',
  solution TEXT NOT NULL DEFAULT '',
  audience TEXT NOT NULL DEFAULT '',
  features_json TEXT NOT NULL DEFAULT '[]',
  impact_points_json TEXT NOT NULL DEFAULT '[]',
  modules_json TEXT NOT NULL DEFAULT '[]',
  workflow_steps_json TEXT NOT NULL DEFAULT '[]',
  customizations_json TEXT NOT NULL DEFAULT '[]',
  tech_stack_json TEXT NOT NULL DEFAULT '[]',
  image_url TEXT,
  gradient TEXT NOT NULL DEFAULT '',
  badge TEXT,
  is_concept INTEGER NOT NULL DEFAULT 1 CHECK (is_concept IN (0,1)),
  is_visible INTEGER NOT NULL DEFAULT 1 CHECK (is_visible IN (0,1)),
  is_featured INTEGER NOT NULL DEFAULT 0 CHECK (is_featured IN (0,1)),
  sort_order INTEGER NOT NULL DEFAULT 100,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS projects_visible_idx ON projects(is_visible, sort_order);
CREATE INDEX IF NOT EXISTS projects_featured_idx ON projects(is_visible, is_featured, sort_order);

CREATE TABLE IF NOT EXISTS project_variants (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('START','BUSINESS','BUSINESS_PLUS')),
  label TEXT NOT NULL DEFAULT '',
  short_description TEXT NOT NULL DEFAULT '',
  goal TEXT NOT NULL DEFAULT '',
  features_json TEXT NOT NULL DEFAULT '[]',
  demo_url TEXT,
  publish_status TEXT NOT NULL DEFAULT 'draft' CHECK (publish_status IN ('draft','published')),
  sort_order INTEGER NOT NULL DEFAULT 100,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(project_id, plan),
  CHECK (plan <> 'BUSINESS_PLUS' OR publish_status = 'draft')
);
CREATE INDEX IF NOT EXISTS project_variants_public_idx ON project_variants(project_id, publish_status, sort_order);

CREATE TABLE IF NOT EXISTS media_assets (
  id TEXT PRIMARY KEY,
  object_key TEXT NOT NULL UNIQUE,
  content_type TEXT NOT NULL,
  byte_size INTEGER NOT NULL CHECK (byte_size >= 0),
  original_name TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS project_media (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  media_asset_id TEXT REFERENCES media_assets(id) ON DELETE RESTRICT,
  type TEXT NOT NULL CHECK (type IN ('image','video')),
  url TEXT NOT NULL,
  caption TEXT,
  alt_text TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS project_media_project_idx ON project_media(project_id, sort_order);
CREATE INDEX IF NOT EXISTS project_media_asset_idx ON project_media(media_asset_id);

CREATE TABLE IF NOT EXISTS contact_requests (
  id TEXT PRIMARY KEY,
  submission_key TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  business_name TEXT,
  needs_json TEXT NOT NULL DEFAULT '[]',
  starting_point TEXT,
  message TEXT NOT NULL,
  privacy_accepted INTEGER NOT NULL CHECK (privacy_accepted IN (0,1)),
  source_path TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','archived')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS contact_requests_status_created_idx ON contact_requests(status, created_at DESC);

CREATE TABLE IF NOT EXISTS analytics_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL CHECK (event_type IN ('page_view','cta_click','email_click','phone_click','case_study_view','project_card_click','contact_form_submit')),
  path TEXT,
  project_slug TEXT,
  referrer_host TEXT,
  device_type TEXT CHECK (device_type IS NULL OR device_type IN ('mobile','tablet','desktop')),
  viewport_width INTEGER,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS analytics_created_idx ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS analytics_type_created_idx ON analytics_events(event_type, created_at DESC);

-- Versioned public portfolio seeds. Unknown/live-admin rows are intentionally untouched.
INSERT INTO projects (
  id, slug, title, category, short_description, overview, problem, solution, audience,
  features_json, impact_points_json, modules_json, workflow_steps_json, customizations_json,
  tech_stack_json, image_url, gradient, badge, is_concept, is_visible, is_featured,
  sort_order, created_at, updated_at
) VALUES
(
  'portfolio-forno-lume', 'forno-lume', 'Forno Lume', 'Hospitality',
  'Concept Tretnix per una presenza digitale hospitality calda e riconoscibile, evoluta da una base essenziale a un’esperienza multipagina.',
  'Forno Lume è un concept dimostrativo Tretnix dedicato al settore Hospitality. Esplora come identità, contenuti, contatto e navigazione possano crescere in modo coerente da una prima presenza digitale completa a una struttura pubblica più articolata.',
  'Una realtà hospitality deve comunicare atmosfera, proposta e informazioni pratiche senza trasformare il sito in un catalogo impersonale o in un flusso difficile da usare su mobile.',
  'Tretnix costruisce una direzione editoriale calda e mobile-first, con contenuti essenziali, contatti diretti e una progressione che mantiene la stessa identità mentre aumenta la profondità informativa.',
  'Ristoranti, bistrot, pizzerie e piccole realtà hospitality che vogliono una presenza digitale riconoscibile e costruita intorno alla propria esperienza.',
  '["Identità visiva hospitality distinta e coerente","Esperienza mobile-first senza overflow intenzionale","Contatti e prenotazione attraverso canali esterni chiari","Contenuti editoriali e informazioni pratiche organizzati per priorità","Evoluzione START → BUSINESS senza cambio di personalità"]',
  '["Una stessa identità può sostenere scope differenti senza sembrare un template riutilizzato","La struttura può crescere da one-page a multipage senza perdere chiarezza","Le demo restano trasparenti: niente recensioni o prove commerciali inventate"]',
  '[]','[]','["Palette, tipografia, fotografia e tono adattabili alla reale identità del cliente","Canali di contatto e contenuti configurabili senza imporre un processo standard"]','[]',
  NULL,
  'bg-[radial-gradient(ellipse_at_top_left,#3a2117,#17100c_68%),linear-gradient(135deg,#24160f,#17100c)]',
  'Concept Tretnix',1,1,1,10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP
),
(
  'portfolio-rito-studio', 'rito-studio', 'RITO Studio', 'Beauty & Wellness',
  'Concept Tretnix per Beauty & Wellness: un’identità editoriale premium che cresce da un’esperienza essenziale a un percorso multipagina di scoperta dei trattamenti.',
  'RITO Studio è un concept dimostrativo Tretnix per attività Beauty & Wellness su appuntamento. La famiglia preserva un linguaggio visivo intimo e preciso mentre BUSINESS approfondisce catalogo, studio, galleria, FAQ e contatto.',
  'Un’attività Beauty & Wellness deve trasmettere fiducia, metodo e sensibilità visiva, rendendo i trattamenti facili da esplorare senza assumere l’aspetto di un marketplace, di una clinica o di un template beauty generico.',
  'Tretnix usa una composizione editoriale, una gerarchia tattile e interazioni misurate. START concentra il racconto in una one-page; BUSINESS estende la stessa famiglia con superfici dedicate e dettaglio query-driven.',
  'Beauty centre, hair salon, barber shop, nail studio, spa, massage e piccole attività wellness che lavorano principalmente su appuntamento.',
  '["Sistema visivo Beauty & Wellness riconoscibile e non generico","Navigazione e interazioni accessibili con comportamento mobile-first","Contatto e booking esterni senza fingere disponibilità o persistenza dati","Catalogo trattamenti e contenuti editoriali più profondi nella variante BUSINESS","Evoluzione START → BUSINESS preservando la stessa famiglia"]',
  '["Un concept può essere premium senza usare prove sociali o credenziali inventate","L’architettura multipagina aggiunge informazione, non rumore decorativo","Dettaglio, gallery e filtri possono mantenere Back, Forward, refresh e direct URL"]',
  '[]','[]','["Palette, tipografia, fotografia e catalogo trattamenti sostituibili con quelli della reale attività","Canali di booking e contatto adattabili al processo effettivo del cliente"]','[]',
  NULL,
  'bg-[radial-gradient(ellipse_at_top_left,#f5f1e9,#ded4c8_72%),linear-gradient(135deg,#ede8df,#d9cec2)]',
  'Concept Tretnix',1,1,1,20,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP
)
ON CONFLICT(slug) DO UPDATE SET
  title=excluded.title, category=excluded.category, short_description=excluded.short_description,
  overview=excluded.overview, problem=excluded.problem, solution=excluded.solution,
  audience=excluded.audience, features_json=excluded.features_json,
  impact_points_json=excluded.impact_points_json, customizations_json=excluded.customizations_json,
  gradient=excluded.gradient, badge=excluded.badge, is_concept=1, is_visible=1,
  is_featured=1, sort_order=excluded.sort_order, updated_at=CURRENT_TIMESTAMP;

INSERT INTO project_variants (
  id, project_id, plan, label, short_description, goal, features_json,
  demo_url, publish_status, sort_order, created_at, updated_at
) VALUES
('forno-start','portfolio-forno-lume','START','Presenza digitale essenziale',
 'Una one-page hospitality premium che concentra identità, menu, informazioni pratiche e contatto diretto.',
 'Costruire una presenza digitale completa ma essenziale, facile da adattare a una piccola attività hospitality.',
 '["One-page mobile-first","Menu e proposta editoriale","Informazioni pratiche","Booking esterno via WhatsApp/telefono","FAQ e mappa on-demand"]',
 'https://forno-lume.tretnix.com/','published',10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('forno-business','portfolio-forno-lume','BUSINESS','Esperienza multipagina',
 'Evoluzione della stessa identità in una struttura multipagina con maggiore profondità di contenuto.',
 'Ampliare la presenza pubblica senza perdere riconoscibilità, semplicità mobile e coerenza con START.',
 '["Home multipagina","Menu dedicato","Chi siamo","Galleria","Contatti","SEO per route","Stessa identità START"]',
 'https://forno-lume-business.tretnix.com/','published',20,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('rito-start','portfolio-rito-studio','START','Presenza digitale essenziale',
 'Una one-page editoriale Beauty & Wellness con trattamenti, metodo, studio, gallery, FAQ e booking esterno.',
 'Presentare una realtà beauty premium con un racconto compatto, accessibile e mobile-first.',
 '["One-page premium","Trattamenti editoriali","Studio e rituale","Gallery","FAQ","Booking esterno"]',
 'https://rito-studio.tretnix.com/','published',10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('rito-business','portfolio-rito-studio','BUSINESS','Percorso multipagina',
 'La stessa famiglia visiva estesa con catalogo trattamenti, studio, gallery, FAQ e contatti su route dedicate.',
 'Aumentare profondità e navigabilità mantenendo identità, accessibility e booking esterno.',
 '["Catalogo trattamenti","Dettaglio query-driven","Studio","Galleria con lightbox","FAQ","Contatti","Booking WhatsApp + telefono"]',
 'https://rito-studio-business.tretnix.com/','published',20,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
ON CONFLICT(project_id,plan) DO UPDATE SET
  label=excluded.label, short_description=excluded.short_description, goal=excluded.goal,
  features_json=excluded.features_json, demo_url=excluded.demo_url,
  publish_status=excluded.publish_status, sort_order=excluded.sort_order,
  updated_at=CURRENT_TIMESTAMP;

-- Historical Tretnix repository seeds are retained as non-featured concepts.
INSERT INTO projects (
  id,slug,title,category,short_description,overview,problem,solution,audience,
  features_json,impact_points_json,modules_json,workflow_steps_json,customizations_json,tech_stack_json,
  image_url,gradient,badge,is_concept,is_visible,is_featured,sort_order,created_at,updated_at
) VALUES
('legacy-fitzone','fitzone','FitZone','Fitness Management Platform',
 'Concept di piattaforma digitale per centri fitness e wellness con gestione utenti, programmi, community, messaggi e statistiche.',
 'FitZone è un concept di piattaforma digitale pensata per palestre, personal trainer e centri wellness che vogliono gestire utenti, programmi, comunicazioni e attività da un unico sistema.',
 'Molte strutture fitness usano strumenti separati per schede di allenamento, messaggi, prenotazioni, pagamenti e comunicazioni con gli iscritti. Questo crea confusione, dati sparsi e difficoltà nel seguire ogni cliente in modo ordinato.',
 'La piattaforma centralizza profili utenti, programmi di allenamento, messaggi, community, statistiche e attività, offrendo al team una visione più chiara e agli utenti un’esperienza digitale più semplice.',
 'Palestre, centri wellness e personal trainer che vogliono un sistema unico per gestire iscritti, programmi e comunicazioni.',
 '["Gestione utenti e profili","Programmi di allenamento","Community interna","Messaggi e comunicazioni","Dashboard statistiche","Area personale mobile-first"]',
 '["Meno comunicazioni sparse","Maggiore controllo sugli iscritti","Esperienza più professionale per i clienti","Gestione più ordinata del lavoro quotidiano"]',
 '["Anagrafica utenti","Schede allenamento","Community & messaggi","Statistiche & KPI","Area cliente mobile"]',
 '["Iscrizione utente","Assegnazione programma","Comunicazione via messaggi","Monitoraggio progressi","Reportistica periodica"]',
 '["Branding e temi","Ruoli e permessi","Integrazioni con sistemi di pagamento","Notifiche push personalizzate"]',
 '["React","TanStack Start","Postgres","Supabase","Tailwind"]',NULL,
 'bg-[radial-gradient(ellipse_at_top,#0B2A4A,#020814_70%),linear-gradient(135deg,#061326,#020814)]','Concept Tretnix',1,1,0,110,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('legacy-supplyflow','supplyflow','SupplyFlow','Supplier & Operations System',
 'Concept di web app mobile-first per gestire fornitori, prodotti, sessioni d’acquisto, quantità e storico operativo.',
 'SupplyFlow è un concept di web app mobile-first progettata per attività che devono gestire acquisti, fornitori, prodotti, quantità e storico operativo in modo rapido e ordinato.',
 'Molte attività gestiscono ordini e acquisti con liste cartacee, messaggi WhatsApp o fogli Excel. Questo può causare dimenticanze, quantità sbagliate, poca tracciabilità e difficoltà nel coordinare il team.',
 'SupplyFlow permette di creare sessioni d’acquisto, selezionare fornitori, aggiornare quantità, consultare lo storico e mantenere tutto il processo centralizzato in una piattaforma accessibile da telefono.',
 'Ristoranti, bar, negozi e attività operative che gestiscono ordini ricorrenti con più fornitori.',
 '["Gestione fornitori","Gestione prodotti","Sessioni d’acquisto","Storico quantità","Ricerca e filtri","Interfaccia mobile-first","Ruoli operativi"]',
 '["Meno errori negli acquisti","Ordini più veloci","Storico sempre consultabile","Migliore coordinamento del team"]',
 '["Fornitori","Catalogo prodotti","Sessioni ordini","Storico e report"]',
 '["Apertura sessione","Selezione fornitori","Aggiornamento quantità","Chiusura e archiviazione"]',
 '["Categorie prodotti personalizzate","Unità di misura","Notifiche di conferma","Esportazione dati"]',
 '["React","TanStack Start","Postgres","Supabase","Tailwind"]',NULL,
 'bg-[radial-gradient(ellipse_at_bottom_right,#123055,#020814_70%),linear-gradient(135deg,#030B1A,#061326)]','Concept Tretnix',1,1,0,120,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('legacy-wealthcore','wealthcore','WealthCore','Finance Dashboard',
 'Concept di dashboard avanzata per monitorare conti, transazioni, investimenti, obiettivi finanziari e storico patrimoniale.',
 'WealthCore è un concept di dashboard finanziaria progettata per monitorare conti, transazioni, investimenti, obiettivi e andamento patrimoniale in modo centralizzato.',
 'Quando dati finanziari, conti, investimenti e obiettivi sono sparsi tra più strumenti, diventa difficile avere una visione chiara e aggiornata della situazione.',
 'La dashboard centralizza dati, grafici, movimenti, conti e obiettivi, offrendo una panoramica ordinata e analisi più leggibili.',
 'Consulenti finanziari, piccoli team di gestione patrimoniale e utenti avanzati che vogliono una visione unificata.',
 '["Dashboard patrimonio","Gestione conti","Transazioni","Obiettivi finanziari","Grafici e report","Storico andamento","Filtri e categorie"]',
 '["Dati più chiari","Meno confusione tra strumenti","Monitoraggio più veloce","Migliore visione d’insieme"]',
 '["Panoramica patrimonio","Movimenti","Obiettivi","Report analitici"]',
 '["Import dati","Categorizzazione","Analisi ricorrenti","Revisione obiettivi"]',
 '["Categorie personalizzate","Valute multiple","Ruoli utente","Export CSV/PDF"]',
 '["React","TanStack Start","Postgres","Supabase","Tailwind","Recharts"]',NULL,
 'bg-[radial-gradient(ellipse_at_top_left,#0B2A4A,#020814_70%),linear-gradient(135deg,#061326,#030B1A)]','Concept Tretnix',1,1,0,130,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
ON CONFLICT(slug) DO NOTHING;
