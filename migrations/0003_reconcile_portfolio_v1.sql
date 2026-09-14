-- Reconcile the canonical PR #7 portfolio semantics onto the Cloudflare-native D1 model.
-- No Lovable/Supabase data is imported; this migration applies to a fresh Tretnix D1 database.

UPDATE projects SET
  category='Food & Hospitality',
  short_description='Concept Hospitality Tretnix che evolve da un’esperienza single-page calda e editoriale a un sito multipagina per menu, storia, galleria e contatti.',
  overview='Forno Lume mostra l’evoluzione coerente di una presenza digitale Hospitality: START concentra proposta, atmosfera e contatto in una home mobile-first; BUSINESS aggiunge profondità informativa e route dedicate preservando identità, motion e qualità di interazione.',
  problem='Rendere menu, atmosfera e canali di prenotazione immediatamente accessibili senza ridurre l’identità a un template generico o disperdere i contenuti nella variante multipagina.',
  solution='Un sistema editoriale warm-premium con contenuti centralizzati, percorsi di contatto espliciti, gallery progressiva e architettura START → BUSINESS coerente.',
  audience='Ristoranti, pizzerie, bistrot ed enoteche indipendenti che vogliono presentare proposta, atmosfera e informazioni pratiche con un’esperienza mobile curata.',
  features_json='["Esperienza START single-page mobile-first","Architettura BUSINESS multipagina","Menu preview e menu categorizzato","Gallery rail e galleria con filtri/lightbox","Scelta dei canali di prenotazione e contatto","Mappa caricata solo dopo consenso esplicito","Routing, history, focus e reduced motion","Demo SEO e structured data non commerciale"]',
  impact_points_json='["Riduce i passaggi necessari per trovare menu e canale di prenotazione","Mantiene riconoscibile la stessa identità nel passaggio da START a BUSINESS","Separa la consultazione rapida dalla profondità informativa delle route dedicate","Permette di esplorare spazi e proposta senza interrompere il percorso di contatto"]',
  modules_json='["Hero e posizionamento","Menu e categorie","Racconto del locale","Review surface demo/authentic","Gallery rail e gallery explorer","FAQ e informazioni pratiche","Mappa privacy-aware","Booking/contact choice","Privacy, Cookie e 404"]',
  workflow_steps_json='["Comprendere proposta e atmosfera","Esplorare menu e contenuti","Valutare galleria e informazioni pratiche","Scegliere il canale di prenotazione o contatto"]',
  customizations_json='["Identità, copy e fotografia","Menu, categorie e contenuti","Canali di prenotazione e contatto","Orari, area e mappa","Gallery e recensioni autentiche verificate","Metadata e structured data cliente"]',
  tech_stack_json='["React 19","TypeScript","TanStack Start e TanStack Router","Vite","Tailwind CSS 4","Radix UI","Nitro / Cloudflare Workers","Cloudflare D1","Cloudflare R2"]',
  image_url=NULL,
  gradient='bg-background',
  badge='Concept Tretnix',
  is_concept=1,
  is_visible=1,
  is_featured=1,
  sort_order=10,
  updated_at=CURRENT_TIMESTAMP
WHERE slug='forno-lume';

UPDATE projects SET
  category='Beauty & Wellness',
  short_description='Concept Beauty & Wellness Tretnix che evolve da una one-page editoriale a un percorso multipagina per trattamenti, studio, galleria, FAQ e contatti.',
  overview='RITO Studio presenta la cura personale con un’identità tattile e contemporanea. START concentra il racconto in una home mobile-first; BUSINESS amplia la scoperta dei trattamenti con route dedicate e dettagli query-driven, preservando palette, tipografia, motion e demo integrity.',
  problem='Organizzare un’offerta Beauty articolata senza ricorrere a cliché visuali, card ripetitive o un booking nativo non disponibile, mantenendo il percorso chiaro su mobile.',
  solution='Un sistema editoriale porcellana, inchiostro e borgogna con catalogo trattamento query-driven, gallery progressiva e canali di prenotazione/contatto centralizzati.',
  audience='Hair salon, barber shop, beauty e nail studio, spa e professionisti wellness che desiderano presentare servizi, metodo e ambiente con una presenza digitale curata.',
  features_json='["Esperienza START one-page mobile-first","BUSINESS multipagina per trattamenti, studio, galleria, FAQ e contatti","Catalogo e dettaglio trattamento query-driven","Gallery rail e galleria con filtri/lightbox","Booking via WhatsApp e telefono","Contatto via email e telefono","Route focus, history e interazioni da tastiera","Demo noindex e structured data non commerciale"]',
  impact_points_json='["Riduce i passaggi tra scoperta del trattamento e scelta del canale di prenotazione","Mantiene il contesto del catalogo durante l’apertura dei dettagli","Separa approfondimento, studio e FAQ senza perdere l’identità dello START","Permette di adattare categorie e contenuti alle specializzazioni effettive"]',
  modules_json='["Hero e posizionamento","Categorie e catalogo trattamenti","Dettaglio query-driven","Rituale e metodo","Studio e informazioni pre-visita","Review surface demo/authentic","Gallery rail e gallery explorer","FAQ e contatti","Privacy, Cookie e 404"]',
  workflow_steps_json='["Comprendere identità e proposta","Filtrare e scegliere un trattamento","Consultare il dettaglio mantenendo il contesto","Esplorare studio, galleria e FAQ","Scegliere booking o contatto esterno"]',
  customizations_json='["Categorie e catalogo pertinenti al cliente","Brand, copy, palette e fotografia","Prezzi, durate e contenuti trattamento","Booking e contact channels","Studio, location e informazioni pratiche","Metadata, analytics e structured data cliente"]',
  tech_stack_json='["React 19","TypeScript","TanStack Start e TanStack Router","Vite","Tailwind CSS 4","Radix UI","Nitro / Cloudflare Workers","Cloudflare D1","Cloudflare R2"]',
  image_url=NULL,
  gradient='bg-background',
  badge='Concept Tretnix',
  is_concept=1,
  is_visible=1,
  is_featured=1,
  sort_order=20,
  updated_at=CURRENT_TIMESTAMP
WHERE slug='rito-studio';

UPDATE projects SET
  is_concept=1,
  is_visible=1,
  is_featured=0,
  sort_order=CASE slug
    WHEN 'fitzone' THEN 100
    WHEN 'supplyflow' THEN 110
    WHEN 'wealthcore' THEN 120
  END,
  updated_at=CURRENT_TIMESTAMP
WHERE slug IN ('fitzone','supplyflow','wealthcore');

-- The homepage featured set is exact, including any non-canonical rows added before reconciliation.
UPDATE projects
SET is_featured=0, updated_at=CURRENT_TIMESTAMP
WHERE slug NOT IN ('forno-lume','rito-studio') AND is_featured<>0;

UPDATE project_variants
SET publish_status='published', updated_at=CURRENT_TIMESTAMP
WHERE project_id IN (
  SELECT id FROM projects WHERE slug IN ('forno-lume','rito-studio')
) AND plan IN ('START','BUSINESS');

UPDATE project_variants
SET publish_status='draft', updated_at=CURRENT_TIMESTAMP
WHERE project_id IN (
  SELECT id FROM projects WHERE slug IN ('forno-lume','rito-studio')
) AND plan='BUSINESS_PLUS';
