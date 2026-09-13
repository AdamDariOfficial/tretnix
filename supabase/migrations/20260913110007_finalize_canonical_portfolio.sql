BEGIN;

INSERT INTO public.projects (
  slug,
  title,
  category,
  short_description,
  overview,
  problem,
  solution,
  audience,
  features,
  impact_points,
  modules,
  workflow_steps,
  customizations,
  tech_stack,
  image_url,
  gradient,
  badge,
  is_concept,
  is_visible,
  is_featured,
  sort_order
)
VALUES
  (
    'forno-lume',
    'Forno Lume',
    'Food & Hospitality',
    'Concept Hospitality Tretnix che evolve da un''esperienza single-page calda e editoriale a un sito multipagina per menu, storia, galleria e contatti.',
    'Forno Lume mostra l''evoluzione coerente di una presenza digitale Hospitality: START concentra proposta, atmosfera e contatto in una home mobile-first; BUSINESS aggiunge profondità informativa e route dedicate preservando identità, motion e qualità di interazione.',
    'Rendere menu, atmosfera e canali di prenotazione immediatamente accessibili senza ridurre l''identità a un template generico o disperdere i contenuti nella variante multipagina.',
    'Un sistema editoriale warm-premium con contenuti centralizzati, percorsi di contatto espliciti, gallery progressiva e architettura START → BUSINESS coerente.',
    'Ristoranti, pizzerie, bistrot ed enoteche indipendenti che vogliono presentare proposta, atmosfera e informazioni pratiche con un''esperienza mobile curata.',
    ARRAY[
      'Esperienza START single-page mobile-first',
      'Architettura BUSINESS multipagina',
      'Menu preview e menu categorizzato',
      'Gallery rail e galleria con filtri/lightbox',
      'Scelta dei canali di prenotazione e contatto',
      'Mappa caricata solo dopo consenso esplicito',
      'Routing, history, focus e reduced motion',
      'Demo SEO e structured data non commerciale'
    ]::TEXT[],
    ARRAY[
      'Riduce i passaggi necessari per trovare menu e canale di prenotazione',
      'Mantiene riconoscibile la stessa identità nel passaggio da START a BUSINESS',
      'Separa la consultazione rapida dalla profondità informativa delle route dedicate',
      'Permette di esplorare spazi e proposta senza interrompere il percorso di contatto'
    ]::TEXT[],
    ARRAY[
      'Hero e posizionamento',
      'Menu e categorie',
      'Racconto del locale',
      'Review surface demo/authentic',
      'Gallery rail e gallery explorer',
      'FAQ e informazioni pratiche',
      'Mappa privacy-aware',
      'Booking/contact choice',
      'Privacy, Cookie e 404'
    ]::TEXT[],
    ARRAY[
      'Comprendere proposta e atmosfera',
      'Esplorare menu e contenuti',
      'Valutare galleria e informazioni pratiche',
      'Scegliere il canale di prenotazione o contatto'
    ]::TEXT[],
    ARRAY[
      'Identità, copy e fotografia',
      'Menu, categorie e contenuti',
      'Canali di prenotazione e contatto',
      'Orari, area e mappa',
      'Gallery e recensioni autentiche verificate',
      'Metadata e structured data cliente'
    ]::TEXT[],
    ARRAY[
      'React 19',
      'TypeScript',
      'TanStack Start e TanStack Router',
      'Vite',
      'Tailwind CSS 4',
      'Radix UI',
      'Nitro / Cloudflare Pages'
    ]::TEXT[],
    NULL,
    'bg-background',
    'Concept Tretnix',
    TRUE,
    TRUE,
    TRUE,
    10
  ),
  (
    'rito-studio',
    'RITO Studio',
    'Beauty & Wellness',
    'Concept Beauty & Wellness Tretnix che evolve da una one-page editoriale a un percorso multipagina per trattamenti, studio, galleria, FAQ e contatti.',
    'RITO Studio presenta la cura personale con un''identità tattile e contemporanea. START concentra il racconto in una home mobile-first; BUSINESS amplia la scoperta dei trattamenti con route dedicate e dettagli query-driven, preservando palette, tipografia, motion e demo integrity.',
    'Organizzare un''offerta Beauty articolata senza ricorrere a cliché visuali, card ripetitive o un booking nativo non disponibile, mantenendo il percorso chiaro su mobile.',
    'Un sistema editoriale porcellana, inchiostro e borgogna con catalogo trattamento query-driven, gallery progressiva e canali di prenotazione/contatto centralizzati.',
    'Hair salon, barber shop, beauty e nail studio, spa e professionisti wellness che desiderano presentare servizi, metodo e ambiente con una presenza digitale curata.',
    ARRAY[
      'Esperienza START one-page mobile-first',
      'BUSINESS multipagina per trattamenti, studio, galleria, FAQ e contatti',
      'Catalogo e dettaglio trattamento query-driven',
      'Gallery rail e galleria con filtri/lightbox',
      'Booking via WhatsApp e telefono',
      'Contatto via email e telefono',
      'Route focus, history e interazioni da tastiera',
      'Demo noindex e structured data non commerciale'
    ]::TEXT[],
    ARRAY[
      'Riduce i passaggi tra scoperta del trattamento e scelta del canale di prenotazione',
      'Mantiene il contesto del catalogo durante l''apertura dei dettagli',
      'Separa approfondimento, studio e FAQ senza perdere l''identità dello START',
      'Permette di adattare categorie e contenuti alle specializzazioni effettive'
    ]::TEXT[],
    ARRAY[
      'Hero e posizionamento',
      'Categorie e catalogo trattamenti',
      'Dettaglio query-driven',
      'Rituale e metodo',
      'Studio e informazioni pre-visita',
      'Review surface demo/authentic',
      'Gallery rail e gallery explorer',
      'FAQ e contatti',
      'Privacy, Cookie e 404'
    ]::TEXT[],
    ARRAY[
      'Comprendere identità e proposta',
      'Filtrare e scegliere un trattamento',
      'Consultare il dettaglio mantenendo il contesto',
      'Esplorare studio, galleria e FAQ',
      'Scegliere booking o contatto esterno'
    ]::TEXT[],
    ARRAY[
      'Categorie e catalogo pertinenti al cliente',
      'Brand, copy, palette e fotografia',
      'Prezzi, durate e contenuti trattamento',
      'Booking e contact channels',
      'Studio, location e informazioni pratiche',
      'Metadata, analytics e structured data cliente'
    ]::TEXT[],
    ARRAY[
      'React 19',
      'TypeScript',
      'TanStack Start e TanStack Router',
      'Vite',
      'Tailwind CSS 4',
      'Radix UI',
      'Nitro / Cloudflare Pages'
    ]::TEXT[],
    NULL,
    'bg-background',
    'Concept Tretnix',
    TRUE,
    TRUE,
    TRUE,
    20
  )
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  short_description = EXCLUDED.short_description,
  overview = EXCLUDED.overview,
  problem = EXCLUDED.problem,
  solution = EXCLUDED.solution,
  audience = EXCLUDED.audience,
  features = EXCLUDED.features,
  impact_points = EXCLUDED.impact_points,
  modules = EXCLUDED.modules,
  workflow_steps = EXCLUDED.workflow_steps,
  customizations = EXCLUDED.customizations,
  tech_stack = EXCLUDED.tech_stack,
  image_url = EXCLUDED.image_url,
  gradient = EXCLUDED.gradient,
  badge = EXCLUDED.badge,
  is_concept = EXCLUDED.is_concept,
  is_visible = EXCLUDED.is_visible,
  is_featured = EXCLUDED.is_featured,
  sort_order = EXCLUDED.sort_order
WHERE ROW(
  projects.title,
  projects.category,
  projects.short_description,
  projects.overview,
  projects.problem,
  projects.solution,
  projects.audience,
  projects.features,
  projects.impact_points,
  projects.modules,
  projects.workflow_steps,
  projects.customizations,
  projects.tech_stack,
  projects.image_url,
  projects.gradient,
  projects.badge,
  projects.is_concept,
  projects.is_visible,
  projects.is_featured,
  projects.sort_order
) IS DISTINCT FROM ROW(
  EXCLUDED.title,
  EXCLUDED.category,
  EXCLUDED.short_description,
  EXCLUDED.overview,
  EXCLUDED.problem,
  EXCLUDED.solution,
  EXCLUDED.audience,
  EXCLUDED.features,
  EXCLUDED.impact_points,
  EXCLUDED.modules,
  EXCLUDED.workflow_steps,
  EXCLUDED.customizations,
  EXCLUDED.tech_stack,
  EXCLUDED.image_url,
  EXCLUDED.gradient,
  EXCLUDED.badge,
  EXCLUDED.is_concept,
  EXCLUDED.is_visible,
  EXCLUDED.is_featured,
  EXCLUDED.sort_order
);

UPDATE public.projects
SET
  is_visible = TRUE,
  is_featured = FALSE,
  sort_order = CASE slug
    WHEN 'fitzone' THEN 100
    WHEN 'supplyflow' THEN 110
    WHEN 'wealthcore' THEN 120
  END
WHERE slug IN ('fitzone', 'supplyflow', 'wealthcore')
  AND ROW(is_visible, is_featured, sort_order) IS DISTINCT FROM ROW(
    TRUE,
    FALSE,
    CASE slug
      WHEN 'fitzone' THEN 100
      WHEN 'supplyflow' THEN 110
      WHEN 'wealthcore' THEN 120
    END
  );

DO $$
BEGIN
  IF (
    SELECT COUNT(*)
    FROM public.projects
    WHERE slug IN ('forno-lume', 'rito-studio')
      AND is_concept
      AND is_visible
      AND is_featured
  ) <> 2 THEN
    RAISE EXCEPTION 'Canonical portfolio postcondition failed';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.projects
    WHERE slug IN ('fitzone', 'supplyflow', 'wealthcore')
      AND is_featured
  ) THEN
    RAISE EXCEPTION 'Legacy portfolio demotion postcondition failed';
  END IF;
END
$$;

COMMIT;
