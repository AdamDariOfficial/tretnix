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
    category: "Hospitality",
    short_description: "Concept Tretnix per una presenza digitale hospitality calda e riconoscibile, evoluta da una base essenziale a un’esperienza multipagina.",
    overview: "Forno Lume è un concept dimostrativo Tretnix dedicato al settore Hospitality. Esplora come identità, contenuti, contatto e navigazione possano crescere in modo coerente da una prima presenza digitale completa a una struttura pubblica più articolata.",
    problem: "Una realtà hospitality deve comunicare atmosfera, proposta e informazioni pratiche senza trasformare il sito in un catalogo impersonale o in un flusso difficile da usare su mobile.",
    solution: "Tretnix costruisce una direzione editoriale calda e mobile-first, con contenuti essenziali, contatti diretti e una progressione che mantiene la stessa identità mentre aumenta la profondità informativa.",
    audience: "Ristoranti, bistrot, pizzerie e piccole realtà hospitality che vogliono una presenza digitale riconoscibile e costruita intorno alla propria esperienza.",
    features: ["Identità visiva hospitality distinta e coerente", "Esperienza mobile-first senza overflow intenzionale", "Contatti e prenotazione attraverso canali esterni chiari", "Contenuti editoriali e informazioni pratiche organizzati per priorità", "Evoluzione START → BUSINESS senza cambio di personalità"],
    impact_points: ["Una stessa identità può sostenere scope differenti senza sembrare un template riutilizzato", "La struttura può crescere da one-page a multipage senza perdere chiarezza", "Le demo restano trasparenti: niente recensioni o prove commerciali inventate"],
    customizations: ["Palette, tipografia, fotografia e tono adattabili alla reale identità del cliente", "Canali di contatto e contenuti configurabili senza imporre un processo standard"],
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
    short_description: "Concept Tretnix per Beauty & Wellness: un’identità editoriale premium che cresce da un’esperienza essenziale a un percorso multipagina di scoperta dei trattamenti.",
    overview: "RITO Studio è un concept dimostrativo Tretnix per attività Beauty & Wellness su appuntamento. La famiglia preserva un linguaggio visivo intimo e preciso mentre BUSINESS approfondisce catalogo, studio, galleria, FAQ e contatto.",
    problem: "Un’attività Beauty & Wellness deve trasmettere fiducia, metodo e sensibilità visiva, rendendo i trattamenti facili da esplorare senza assumere l’aspetto di un marketplace, di una clinica o di un template beauty generico.",
    solution: "Tretnix usa una composizione editoriale, una gerarchia tattile e interazioni misurate. START concentra il racconto in una one-page; BUSINESS estende la stessa famiglia con superfici dedicate e dettaglio query-driven.",
    audience: "Beauty centre, hair salon, barber shop, nail studio, spa, massage e piccole attività wellness che lavorano principalmente su appuntamento.",
    features: ["Sistema visivo Beauty & Wellness riconoscibile e non generico", "Navigazione e interazioni accessibili con comportamento mobile-first", "Contatto e booking esterni senza fingere disponibilità o persistenza dati", "Catalogo trattamenti e contenuti editoriali più profondi nella variante BUSINESS", "Evoluzione START → BUSINESS preservando la stessa famiglia"],
    impact_points: ["Un concept può essere premium senza usare prove sociali o credenziali inventate", "L’architettura multipagina aggiunge informazione, non rumore decorativo", "Dettaglio, gallery e filtri possono mantenere Back, Forward, refresh e direct URL"],
    customizations: ["Palette, tipografia, fotografia e catalogo trattamenti sostituibili con quelli della reale attività", "Canali di booking e contatto adattabili al processo effettivo del cliente"],
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
    sort_order: 110 + index * 10,
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
      .sort((a, b) => a.sort_order - b.sort_order),
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
      .sort((a, b) => a.sort_order - b.sort_order),
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
  return clone(media.filter((row) => row.project_id === projectId).sort((a, b) => a.sort_order - b.sort_order));
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
