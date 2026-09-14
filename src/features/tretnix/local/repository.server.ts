type Project = {
  id: string;
  slug: string;
  title: string;
  category: string;
  short_description: string;
  overview: string;
  problem: string;
  solution: string;
  audience: string;
  features: string[];
  impact_points: string[];
  modules: string[];
  workflow_steps: string[];
  customizations: string[];
  tech_stack: string[];
  image_url: string | null;
  gradient: string;
  badge: string | null;
  is_concept: boolean;
  is_visible: boolean;
  is_featured: boolean;
  sort_order: number;
};

type ProjectVariant = {
  id: string;
  project_id: string;
  plan: "START" | "BUSINESS" | "BUSINESS_PLUS";
  label: string;
  short_description: string;
  goal: string;
  demo_url: string | null;
  publish_status: "draft" | "published";
  features: string[];
  sort_order: number;
};

type ProjectMedia = {
  id: string;
  project_id: string;
  type: "image" | "video";
  url: string;
  caption: string | null;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type ContactStatus = "new" | "contacted" | "archived";
type ContactRequest = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  business_name: string | null;
  needs: string[];
  starting_point: string | null;
  message: string;
  privacy_accepted: boolean;
  source_path: string | null;
  status: ContactStatus;
  created_at: string;
  updated_at: string;
};

type AnalyticsEventRow = {
  event_type: string;
  path: string | null;
  project_slug: string | null;
  device_type: string | null;
  referrer_host: string | null;
  created_at: string;
};

type SiteSettings = {
  contact_email: string;
  contact_phone: string;
  location: string;
  cta_email_subject: string;
};

const projectDefaults = {
  modules: [] as string[],
  workflow_steps: [] as string[],
  tech_stack: [] as string[],
  image_url: null as string | null,
  badge: "Concept Tretnix" as string | null,
  is_concept: true,
  is_visible: true,
};

let projects: Project[] = [
  {
    ...projectDefaults,
    id: "portfolio-forno-lume",
    slug: "forno-lume",
    title: "Forno Lume",
    category: "Food & Hospitality",
    short_description: "Concept Hospitality Tretnix che evolve da un’esperienza single-page calda e editoriale a un sito multipagina per menu, storia, galleria e contatti.",
    overview: "Forno Lume mostra l’evoluzione coerente di una presenza digitale Hospitality: START concentra proposta, atmosfera e contatto in una home mobile-first; BUSINESS aggiunge profondità informativa e route dedicate preservando identità, motion e qualità di interazione.",
    problem: "Rendere menu, atmosfera e canali di prenotazione immediatamente accessibili senza ridurre l’identità a un template generico o disperdere i contenuti nella variante multipagina.",
    solution: "Un sistema editoriale warm-premium con contenuti centralizzati, percorsi di contatto espliciti, gallery progressiva e architettura START → BUSINESS coerente.",
    audience: "Ristoranti, pizzerie, bistrot ed enoteche indipendenti che vogliono presentare proposta, atmosfera e informazioni pratiche con un’esperienza mobile curata.",
    features: ["Esperienza START single-page mobile-first", "Architettura BUSINESS multipagina", "Menu preview e menu categorizzato", "Gallery rail e galleria con filtri/lightbox", "Scelta dei canali di prenotazione e contatto", "Mappa caricata solo dopo consenso esplicito", "Routing, history, focus e reduced motion", "Demo SEO e structured data non commerciale"],
    impact_points: ["Riduce i passaggi necessari per trovare menu e canale di prenotazione", "Mantiene riconoscibile la stessa identità nel passaggio da START a BUSINESS", "Separa la consultazione rapida dalla profondità informativa delle route dedicate", "Permette di esplorare spazi e proposta senza interrompere il percorso di contatto"],
    modules: ["Hero e posizionamento", "Menu e categorie", "Racconto del locale", "Review surface demo/authentic", "Gallery rail e gallery explorer", "FAQ e informazioni pratiche", "Mappa privacy-aware", "Booking/contact choice", "Privacy, Cookie e 404"],
    workflow_steps: ["Comprendere proposta e atmosfera", "Esplorare menu e contenuti", "Valutare galleria e informazioni pratiche", "Scegliere il canale di prenotazione o contatto"],
    customizations: ["Identità, copy e fotografia", "Menu, categorie e contenuti", "Canali di prenotazione e contatto", "Orari, area e mappa", "Gallery e recensioni autentiche verificate", "Metadata e structured data cliente"],
    tech_stack: ["React 19", "TypeScript", "TanStack Start e TanStack Router", "Vite", "Tailwind CSS 4", "Radix UI", "Nitro / Cloudflare Workers", "Cloudflare D1", "Cloudflare R2"],
    gradient: "bg-[radial-gradient(ellipse_at_top_left,#3a2117,#17100c_68%),linear-gradient(135deg,#24160f,#17100c)]",
    is_featured: true,
    sort_order: 10,
  },
  {
    ...projectDefaults,
    id: "portfolio-rito-studio",
    slug: "rito-studio",
    title: "RITO Studio",
    category: "Beauty & Wellness",
    short_description: "Concept Beauty & Wellness Tretnix che evolve da una one-page editoriale a un percorso multipagina per trattamenti, studio, galleria, FAQ e contatti.",
    overview: "RITO Studio presenta la cura personale con un’identità tattile e contemporanea. START concentra il racconto in una home mobile-first; BUSINESS amplia la scoperta dei trattamenti con route dedicate e dettagli query-driven, preservando palette, tipografia, motion e demo integrity.",
    problem: "Organizzare un’offerta Beauty articolata senza ricorrere a cliché visuali, card ripetitive o un booking nativo non disponibile, mantenendo il percorso chiaro su mobile.",
    solution: "Un sistema editoriale porcellana, inchiostro e borgogna con catalogo trattamento query-driven, gallery progressiva e canali di prenotazione/contatto centralizzati.",
    audience: "Hair salon, barber shop, beauty e nail studio, spa e professionisti wellness che desiderano presentare servizi, metodo e ambiente con una presenza digitale curata.",
    features: ["Esperienza START one-page mobile-first", "BUSINESS multipagina per trattamenti, studio, galleria, FAQ e contatti", "Catalogo e dettaglio trattamento query-driven", "Gallery rail e galleria con filtri/lightbox", "Booking via WhatsApp e telefono", "Contatto via email e telefono", "Route focus, history e interazioni da tastiera", "Demo noindex e structured data non commerciale"],
    impact_points: ["Riduce i passaggi tra scoperta del trattamento e scelta del canale di prenotazione", "Mantiene il contesto del catalogo durante l’apertura dei dettagli", "Separa approfondimento, studio e FAQ senza perdere l’identità dello START", "Permette di adattare categorie e contenuti alle specializzazioni effettive"],
    modules: ["Hero e posizionamento", "Categorie e catalogo trattamenti", "Dettaglio query-driven", "Rituale e metodo", "Studio e informazioni pre-visita", "Review surface demo/authentic", "Gallery rail e gallery explorer", "FAQ e contatti", "Privacy, Cookie e 404"],
    workflow_steps: ["Comprendere identità e proposta", "Filtrare e scegliere un trattamento", "Consultare il dettaglio mantenendo il contesto", "Esplorare studio, galleria e FAQ", "Scegliere booking o contatto esterno"],
    customizations: ["Categorie e catalogo pertinenti al cliente", "Brand, copy, palette e fotografia", "Prezzi, durate e contenuti trattamento", "Booking e contact channels", "Studio, location e informazioni pratiche", "Metadata, analytics e structured data cliente"],
    tech_stack: ["React 19", "TypeScript", "TanStack Start e TanStack Router", "Vite", "Tailwind CSS 4", "Radix UI", "Nitro / Cloudflare Workers", "Cloudflare D1", "Cloudflare R2"],
    gradient: "bg-[radial-gradient(ellipse_at_top_left,#f5f1e9,#ded4c8_72%),linear-gradient(135deg,#ede8df,#d9cec2)]",
    is_featured: true,
    sort_order: 20,
  },
  ...[
    ["legacy-fitzone", "fitzone", "FitZone", "Fitness Management Platform", "Concept di piattaforma digitale per centri fitness e wellness con gestione utenti, programmi, community, messaggi e statistiche."],
    ["legacy-supplyflow", "supplyflow", "SupplyFlow", "Supplier & Operations System", "Concept di web app mobile-first per gestire fornitori, prodotti, sessioni d’acquisto, quantità e storico operativo."],
    ["legacy-wealthcore", "wealthcore", "WealthCore", "Finance Dashboard", "Concept di dashboard avanzata per monitorare conti, transazioni, investimenti, obiettivi finanziari e storico patrimoniale."],
  ].map(([id, slug, title, category, short_description], index) => ({
    ...projectDefaults,
    id,
    slug,
    title,
    category,
    short_description,
    overview: short_description,
    problem: "",
    solution: "",
    audience: "",
    features: [],
    impact_points: [],
    customizations: [],
    gradient: "bg-[radial-gradient(ellipse_at_top,#0B2A4A,#020814_70%),linear-gradient(135deg,#061326,#020814)]",
    is_featured: false,
    sort_order: 100 + index * 10,
  } satisfies Project)),
];

let variants: ProjectVariant[] = [
  { id: "forno-start", project_id: "portfolio-forno-lume", plan: "START", label: "Presenza digitale essenziale", short_description: "Una one-page hospitality premium che concentra identità, menu, informazioni pratiche e contatto diretto.", goal: "Costruire una presenza digitale completa ma essenziale, facile da adattare a una piccola attività hospitality.", features: ["One-page mobile-first", "Menu e proposta editoriale", "Informazioni pratiche", "Booking esterno via WhatsApp/telefono", "FAQ e mappa on-demand"], demo_url: "https://forno-lume.tretnix.com/", publish_status: "published", sort_order: 10 },
  { id: "forno-business", project_id: "portfolio-forno-lume", plan: "BUSINESS", label: "Esperienza multipagina", short_description: "Evoluzione della stessa identità in una struttura multipagina con maggiore profondità di contenuto.", goal: "Ampliare la presenza pubblica senza perdere riconoscibilità, semplicità mobile e coerenza con START.", features: ["Home multipagina", "Menu dedicato", "Chi siamo", "Galleria", "Contatti", "SEO per route", "Stessa identità START"], demo_url: "https://forno-lume-business.tretnix.com/", publish_status: "published", sort_order: 20 },
  { id: "rito-start", project_id: "portfolio-rito-studio", plan: "START", label: "Presenza digitale essenziale", short_description: "Una one-page editoriale Beauty & Wellness con trattamenti, metodo, studio, gallery, FAQ e booking esterno.", goal: "Presentare una realtà beauty premium con un racconto compatto, accessibile e mobile-first.", features: ["One-page premium", "Trattamenti editoriali", "Studio e rituale", "Gallery", "FAQ", "Booking esterno"], demo_url: "https://rito-studio.tretnix.com/", publish_status: "published", sort_order: 10 },
  { id: "rito-business", project_id: "portfolio-rito-studio", plan: "BUSINESS", label: "Percorso multipagina", short_description: "La stessa famiglia visiva estesa con catalogo trattamenti, studio, gallery, FAQ e contatti su route dedicate.", goal: "Aumentare profondità e navigabilità mantenendo identità, accessibility e booking esterno.", features: ["Catalogo trattamenti", "Dettaglio query-driven", "Studio", "Galleria con lightbox", "FAQ", "Contatti", "Booking WhatsApp + telefono"], demo_url: "https://rito-studio-business.tretnix.com/", publish_status: "published", sort_order: 20 },
];

let media: ProjectMedia[] = [];
let contacts: ContactRequest[] = [];
const analytics: AnalyticsEventRow[] = [];
let settings: SiteSettings = {
  contact_email: "hello@tretnix.com",
  contact_phone: "+39 049 000 0000",
  location: "Padova, Italia",
  cta_email_subject: "Nuovo progetto Tretnix",
};

function clone<T>(value: T): T {
  return structuredClone(value);
}

export async function listProjects(options: { featured?: boolean; admin?: boolean } = {}) {
  return clone(
    projects
      .filter((project) => (options.admin ? true : project.is_visible))
      .filter((project) => (options.featured ? project.is_featured : true))
      .sort((a, b) => a.sort_order - b.sort_order || a.slug.localeCompare(b.slug)),
  );
}

export async function getProjectBySlug(slug: string, admin = false) {
  const project = projects.find((row) => row.slug === slug && (admin || row.is_visible));
  return project ? clone(project) : null;
}

export async function getProjectById(id: string) {
  const project = projects.find((row) => row.id === id);
  return project ? clone(project) : null;
}

export async function upsertProject(input: Partial<Project> & { slug: string; title: string }) {
  const existingIndex = input.id ? projects.findIndex((row) => row.id === input.id) : -1;
  const existing = existingIndex >= 0 ? projects[existingIndex] : null;
  const next: Project = {
    ...(existing ?? {
      ...projectDefaults,
      id: crypto.randomUUID(),
      category: "Gestionale",
      short_description: "",
      overview: "",
      problem: "",
      solution: "",
      audience: "",
      features: [],
      impact_points: [],
      customizations: [],
      gradient: "",
      is_featured: false,
      sort_order: 100,
    }),
    ...input,
    id: existing?.id ?? input.id ?? crypto.randomUUID(),
    slug: input.slug,
    title: input.title,
  } as Project;
  const duplicate = projects.find((row) => row.slug === next.slug && row.id !== next.id);
  if (duplicate) throw new Error("Esiste già un progetto con questo slug.");
  if (existingIndex >= 0) projects[existingIndex] = next;
  else projects.push(next);
  return clone(next);
}

export async function deleteProject(id: string) {
  projects = projects.filter((row) => row.id !== id);
  variants = variants.filter((row) => row.project_id !== id);
  media = media.filter((row) => row.project_id !== id);
}

export async function patchProjectFlags(id: string, patch: { is_visible?: boolean; is_featured?: boolean; sort_order?: number }) {
  const index = projects.findIndex((row) => row.id === id);
  if (index < 0) throw new Error("Progetto non trovato.");
  projects[index] = { ...projects[index], ...patch };
}

export async function listVariants(projectId: string, admin = false) {
  const project = projects.find((row) => row.id === projectId);
  if (!project || (!admin && !project.is_visible)) return [];
  return clone(
    variants
      .filter((row) => row.project_id === projectId && (admin || row.publish_status === "published"))
      .sort((a, b) => a.sort_order - b.sort_order || a.plan.localeCompare(b.plan)),
  );
}

export async function replaceVariants(projectId: string, nextVariants: ProjectVariant[]) {
  if (!projects.some((row) => row.id === projectId)) throw new Error("Progetto non trovato.");
  variants = variants.filter((row) => row.project_id !== projectId);
  variants.push(
    ...nextVariants.map((row) => ({
      ...row,
      id: row.id || crypto.randomUUID(),
      project_id: projectId,
      publish_status: row.plan === "BUSINESS_PLUS" ? "draft" : row.publish_status,
    })),
  );
}

export async function listMedia(projectId: string) {
  return clone(
    media
      .filter((row) => row.project_id === projectId)
      .sort((a, b) => a.sort_order - b.sort_order || a.id.localeCompare(b.id)),
  );
}

export async function addMedia(input: Omit<ProjectMedia, "id" | "created_at" | "updated_at">) {
  if (!projects.some((row) => row.id === input.project_id)) throw new Error("Progetto non trovato.");
  const now = new Date().toISOString();
  const row: ProjectMedia = { ...input, id: crypto.randomUUID(), created_at: now, updated_at: now };
  media.push(row);
  return clone(row);
}

export async function updateMedia(id: string, patch: Partial<Pick<ProjectMedia, "type" | "url" | "caption" | "alt_text" | "sort_order">>) {
  const index = media.findIndex((row) => row.id === id);
  if (index < 0) throw new Error("Media non trovato.");
  media[index] = { ...media[index], ...patch, updated_at: new Date().toISOString() };
}

export async function deleteMedia(id: string) {
  media = media.filter((row) => row.id !== id);
}

export async function getSettings() {
  return clone(settings);
}

export async function updateSettings(next: SiteSettings) {
  settings = { ...next };
  return clone(settings);
}

export async function listContacts() {
  return clone(contacts.sort((a, b) => b.created_at.localeCompare(a.created_at)));
}

export async function updateContactStatus(id: string, status: ContactStatus) {
  const index = contacts.findIndex((row) => row.id === id);
  if (index < 0) throw new Error("Richiesta non trovata.");
  contacts[index] = { ...contacts[index], status, updated_at: new Date().toISOString() };
}

export async function deleteContact(id: string) {
  contacts = contacts.filter((row) => row.id !== id);
}

export async function analyticsSince(since: string) {
  return clone(analytics.filter((row) => row.created_at >= since));
}

export async function dashboardStats() {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  return {
    projects: projects.length,
    visible: projects.filter((row) => row.is_visible).length,
    featured: projects.filter((row) => row.is_featured).length,
    events7d: analytics.filter((row) => row.created_at >= since).length,
  };
}
