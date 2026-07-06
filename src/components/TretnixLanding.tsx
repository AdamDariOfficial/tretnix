import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight, ArrowDown, Check,
  Boxes, Layers, ShieldCheck,
  ShieldAlert, Timer, Gauge,
  Users, ShoppingCart, LayoutDashboard, Kanban,
  Warehouse, Zap, LockKeyhole, FileText,
} from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Navbar, Footer, BackToTopButton } from "./TretnixChrome";
import { HeroMockup } from "./HeroMockup";
import { listFeaturedProjects, type Project } from "@/lib/projects";
import { useSiteSettings, mailtoHref } from "@/lib/site-settings";
import { trackEvent } from "@/lib/analytics";
import {
  contactRequestSchema,
  submitContactRequest,
  NEEDS_OPTIONS,
  STARTING_POINTS,
  type ContactRequestInput,
} from "@/lib/contact-requests";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-8 bg-primary-glow/60" />
      <span className="section-label">{children}</span>
    </div>
  );
}

/* ---------- Hero ---------- */
function HeroSection() {
  const s = useSiteSettings();
  return (
    <section id="top" className="relative overflow-hidden pt-40 pb-32 lg:pt-44 lg:pb-40">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(11,99,255,0.25),transparent_70%)] blur-3xl" />
        <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(30,123,255,0.18),transparent_70%)] blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-8 lg:px-10">
        <div className="animate-fade-up">
          <SectionLabel>Software su misura</SectionLabel>
          <h1 className="font-serif mt-6 text-[44px] leading-[1.02] tracking-tight sm:text-[54px] lg:text-[72px]">
            Soluzioni digitali<br />
            su misura per aziende<br />
            che vogliono lavorare <span className="text-accent italic">meglio.</span>
          </h1>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Progettiamo e sviluppiamo software personalizzato che semplifica i processi,
            riduce gli errori e fa crescere la tua azienda in modo sostenibile.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#contatti" onClick={() => trackEvent("cta_click")} className="btn-primary">
              Parliamo del tuo progetto <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#cosa-possiamo-costruire" className="btn-ghost">Cosa possiamo costruire</a>
          </div>
          <p className="mt-6 max-w-xl text-xs leading-relaxed text-subtle sm:text-sm">
            Ideale per aziende che vogliono sostituire Excel, WhatsApp e processi manuali
            con un sistema unico. Prima analisi gratuita, senza impegno.
          </p>
          <div className="mt-14 flex items-center gap-3 text-subtle">
            <ArrowDown className="h-4 w-4 animate-bounce-y" />
            <span className="section-label !text-subtle">Scorri per esplorare</span>
          </div>
        </div>

        <div className="relative mt-8 lg:mt-0">
          <HeroMockup />
        </div>
      </div>
      {/* keep settings referenced for future direct-mail CTA variants */}
      <span className="sr-only">{s.contact_email}</span>
    </section>
  );
}

/* ---------- Services ---------- */
function ServicesSection() {
  const services = [
    { n: "01", Icon: Boxes, title: "Software su misura",
      desc: "Sviluppiamo gestionali, CRM, dashboard e piattaforme interne progettate sulle esigenze operative della tua azienda." },
    { n: "02", Icon: Layers, title: "Integrazioni e automazioni",
      desc: "Colleghiamo strumenti, eliminiamo attività ripetitive e costruiamo flussi digitali che fanno risparmiare tempo." },
    { n: "03", Icon: ShieldCheck, title: "Consulenza e supporto",
      desc: "Ti aiutiamo a capire cosa serve davvero e restiamo al tuo fianco anche dopo il rilascio, con manutenzione e miglioramenti." },
  ];
  return (
    <section id="servizi" className="border-t border-border py-28 lg:py-36">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 lg:grid-cols-[0.9fr_1.4fr] lg:px-10">
        <div>
          <SectionLabel>Servizi</SectionLabel>
          <h2 className="font-serif mt-6 text-4xl leading-[1.05] sm:text-5xl lg:text-[56px]">
            Tecnologia su misura.<br />
            Impatto <span className="text-accent italic">reale.</span>
          </h2>
          <p className="mt-6 max-w-md text-muted-foreground">
            Ogni soluzione è progettata attorno ai processi reali della tua azienda,
            con attenzione ai dettagli e alla semplicità d'uso quotidiano.
          </p>
        </div>
        <div className="border-t border-border">
          {services.map(({ n, Icon, title, desc }) => (
            <div
              key={n}
              className="group grid grid-cols-[auto_1fr_auto] items-start gap-6 border-b border-border py-8 transition-colors hover:bg-white/[0.02]"
            >
              <div className="glass-card flex h-12 w-12 items-center justify-center rounded-full text-primary-glow transition-colors group-hover:border-primary-glow/60">
                <Icon className="h-5 w-5" strokeWidth={1.4} />
              </div>
              <div>
                <h3 className="text-xl font-medium text-foreground sm:text-2xl">{title}</h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">{desc}</p>
              </div>
              <div className="font-serif text-lg text-subtle">{n}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Perché serve ---------- */
function PercheServeSection() {
  const cards = [
    { Icon: ShieldAlert, t: "Meno errori", d: "Centralizza dati e processi per evitare informazioni duplicate, dimenticate o difficili da trovare." },
    { Icon: Timer, t: "Meno tempo perso", d: "Automatizza attività ripetitive e semplifica il lavoro quotidiano del team." },
    { Icon: Gauge, t: "Più controllo", d: "Dashboard e report per avere una visione chiara di clienti, ordini, attività e risultati." },
  ];
  return (
    <section id="perche-serve" className="border-t border-border py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.4fr]">
          <div>
            <SectionLabel>Perché serve</SectionLabel>
            <h2 className="font-serif mt-6 text-4xl leading-[1.05] sm:text-5xl lg:text-[56px]">
              Meno caos operativo.<br />
              Più <span className="text-accent italic">controllo</span> sul lavoro.
            </h2>
          </div>
          <div className="space-y-6 text-muted-foreground">
            <p className="text-base leading-relaxed sm:text-lg">
              Molte aziende gestiscono ancora ordini, clienti, documenti e attività interne
              con Excel, WhatsApp o strumenti scollegati. Questo crea errori, rallentamenti
              e poca visibilità sui processi.
            </p>
            <p className="text-base leading-relaxed sm:text-lg">
              Tretnix trasforma questi flussi in un sistema unico, chiaro e costruito
              su misura, così ogni informazione è al posto giusto e ogni attività diventa
              più semplice da gestire.
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3">
          {cards.map(({ Icon, t, d }) => (
            <div
              key={t}
              className="glass-card group rounded-2xl p-7 transition-all duration-300 hover:border-primary-glow/50 hover:shadow-[0_20px_60px_-20px_rgba(11,99,255,0.4)]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/40 bg-primary/10 text-primary-glow transition-colors group-hover:border-primary-glow/70">
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <h3 className="mt-5 text-xl font-medium text-foreground">{t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Cosa possiamo costruire ---------- */
function SolutionsSection() {
  const items = [
    { Icon: Users, t: "Gestionale clienti", d: "Clienti, contatti, storico, note, attività e follow-up in un unico sistema." },
    { Icon: ShoppingCart, t: "Ordini e prenotazioni", d: "Richieste, ordini, appuntamenti, stati di avanzamento e notifiche." },
    { Icon: LayoutDashboard, t: "Dashboard aziendali", d: "Numeri, report e dati operativi leggibili da un'unica schermata." },
    { Icon: Kanban, t: "CRM operativo", d: "Pipeline, trattative, attività commerciali e comunicazioni organizzate." },
    { Icon: Warehouse, t: "Fornitori e magazzino", d: "Prodotti, quantità, riordini, storico e gestione dei fornitori." },
    { Icon: Zap, t: "Automazioni", d: "Flussi automatici per ridurre operazioni ripetitive, errori e tempo perso." },
    { Icon: LockKeyhole, t: "Area clienti", d: "Portali riservati per documenti, richieste, comunicazioni e aggiornamenti." },
    { Icon: FileText, t: "Report automatici", d: "PDF, esportazioni, riepiloghi e statistiche generate in modo ordinato." },
  ];
  return (
    <section id="cosa-possiamo-costruire" className="border-t border-border py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl">
          <SectionLabel>Cosa possiamo costruire</SectionLabel>
          <h2 className="font-serif mt-6 text-4xl leading-[1.05] sm:text-5xl lg:text-[56px]">
            Sistemi concreti<br />
            per problemi <span className="text-accent italic">reali.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-muted-foreground">
            Ogni azienda lavora in modo diverso. Per questo Tretnix progetta strumenti su misura
            che possono partire da una funzione semplice e crescere nel tempo insieme al tuo business.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ Icon, t, d }) => (
            <div
              key={t}
              className="glass-card group rounded-2xl p-6 transition-all duration-300 hover:border-primary-glow/50 hover:shadow-[0_20px_50px_-20px_rgba(11,99,255,0.35)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/40 bg-primary/10 text-primary-glow transition-colors group-hover:border-primary-glow/70">
                <Icon className="h-4.5 w-4.5" strokeWidth={1.5} />
              </div>
              <h3 className="mt-5 text-base font-medium text-foreground">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Projects ---------- */
function ProjectCard({ p }: { p: Project }) {
  return (
    <Link
      to="/case-studies/$slug"
      params={{ slug: p.slug }}
      onClick={() => trackEvent("project_card_click", { project_slug: p.slug })}
      className="group relative block overflow-hidden rounded-2xl border border-border transition-all hover:border-primary-glow/50 hover:shadow-[0_30px_80px_-20px_rgba(11,99,255,0.35)]"
    >
      <div className={`aspect-[4/5] w-full ${p.gradient} transition-transform duration-700 group-hover:scale-105`}>
        {p.image_url && (
          <img src={p.image_url} alt={p.title} className="absolute inset-0 h-full w-full object-cover opacity-60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 opacity-30 bg-grid" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-7">
        <div className="section-label !text-primary-glow">{p.category}</div>
        <h3 className="font-serif mt-2 text-3xl text-foreground sm:text-4xl">{p.title}</h3>
        <p className="mt-3 max-w-md text-sm text-muted-foreground line-clamp-3">{p.short_description}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm text-foreground">
          Visualizza concept <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  useEffect(() => {
    void listFeaturedProjects(2).then(setProjects);
  }, []);

  return (
    <section id="progetti" className="border-t border-border py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.4fr]">
          <div>
            <SectionLabel>Case study selezionati</SectionLabel>
            <h2 className="font-serif mt-6 text-4xl leading-[1.05] sm:text-5xl lg:text-[56px]">
              Sistemi digitali<br />
              pensati per il <span className="text-accent italic">lavoro reale.</span>
            </h2>
            <p className="mt-6 max-w-md text-muted-foreground">
              Esempi di sistemi digitali progettati per mostrare il tipo di soluzioni
              che Tretnix può realizzare per aziende e team operativi.
            </p>
            <Link
              to="/case-studies"
              className="mt-8 inline-flex items-center gap-2 text-sm text-foreground hover:text-primary-glow transition-colors"
            >
              Vedi tutti i progetti <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {projects.map((p) => (
              <ProjectCard key={p.id} p={p} />
            ))}
            {projects.length === 0 && (
              <>
                <div className="aspect-[4/5] rounded-2xl border border-border bg-white/[0.02]" />
                <div className="aspect-[4/5] rounded-2xl border border-border bg-white/[0.02]" />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Perché Tretnix (process + studio compact) ---------- */
function WhyTretnixSection() {
  const rows = [
    { n: "01", t: "Un solo referente",
      d: "Parli direttamente con chi segue il progetto, senza passaggi inutili o comunicazioni confuse." },
    { n: "02", t: "Partiamo dal tuo processo reale",
      d: "Prima capiamo come lavori oggi, quali strumenti usi e dove perdi più tempo." },
    { n: "03", t: "Puoi partire da una prima versione",
      d: "Non serve sviluppare tutto subito: iniziamo da ciò che crea valore immediato e cresciamo per step." },
    { n: "04", t: "Restiamo dopo la consegna",
      d: "Supporto, modifiche, manutenzione e miglioramenti possono continuare nel tempo." },
  ];
  return (
    <section id="processo" className="border-t border-border py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.95fr_1.4fr]">
          <div>
            <SectionLabel>Perché Tretnix</SectionLabel>
            <h2 className="font-serif mt-6 text-4xl leading-[1.05] sm:text-5xl lg:text-[56px]">
              Software su misura,<br />
              senza complicazioni <span className="text-accent italic">inutili.</span>
            </h2>
            <p className="mt-6 max-w-md text-muted-foreground">
              Un progetto digitale funziona quando parte dal modo reale in cui lavora la tua
              azienda. Per questo Tretnix non propone soluzioni generiche: ascolta, progetta
              e costruisce strumenti pensati intorno ai tuoi processi.
            </p>
          </div>
          <ul className="border-t border-border">
            {rows.map((r) => (
              <li
                key={r.n}
                className="group grid grid-cols-[auto_1fr] items-start gap-6 border-b border-border py-7 transition-colors hover:bg-white/[0.02]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/40 bg-background text-primary-glow soft-glow">
                  <span className="font-serif text-sm">{r.n}</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground sm:text-xl">{r.t}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{r.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
function FAQSection() {
  const faqs = [
    { q: "Quanto costa un software su misura?",
      a: "Dipende da cosa deve fare il sistema. Una dashboard semplice o un gestionale interno leggero richiede un lavoro diverso da una piattaforma completa con utenti, ruoli, automazioni e report. Dopo una prima analisi gratuita ricevi una proposta chiara con funzionalità, tempi e costo stimato." },
    { q: "Posso partire da una prima versione?",
      a: "Sì. Possiamo iniziare da una versione essenziale, concentrata sul problema più importante, e farla crescere nel tempo. In questo modo parti da ciò che serve davvero e aggiungi nuove funzioni quando ha senso." },
    { q: "Quanto tempo serve per andare online?",
      a: "Dipende dal tipo di sistema. Una prima versione può richiedere poche settimane, mentre progetti più complessi vengono divisi in fasi. Prima di iniziare definiamo sempre cosa verrà consegnato e in quali tempi." },
    { q: "Il software sarà mio?",
      a: "Il progetto viene costruito per la tua azienda e i dati restano tuoi. L'obiettivo è creare una soluzione chiara, mantenibile e senza vincoli inutili." },
    { q: "Dopo la consegna mi seguite?",
      a: "Sì. Possiamo occuparci di manutenzione, aggiornamenti, modifiche, nuove funzionalità e supporto operativo anche dopo la pubblicazione." },
    { q: "Serve avere già tutto chiaro?",
      a: "No. Basta raccontarci come lavori oggi, quali strumenti usi e cosa ti fa perdere più tempo. Ti aiutiamo noi a trasformare il problema in una soluzione concreta." },
  ];
  return (
    <section id="faq" className="border-t border-border py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.9fr_1.4fr]">
          <div>
            <SectionLabel>Domande frequenti</SectionLabel>
            <h2 className="font-serif mt-6 text-4xl leading-[1.05] sm:text-5xl lg:text-[56px]">
              Le domande più comuni<br />
              prima di <span className="text-accent italic">iniziare.</span>
            </h2>
            <p className="mt-6 max-w-md text-muted-foreground">
              Se hai altre domande, scrivici direttamente: rispondiamo entro 24 ore con una prima
              direzione concreta.
            </p>
          </div>
          <Accordion type="single" collapsible className="glass-card divide-y divide-white/10 rounded-2xl">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-none px-6">
                <AccordionTrigger className="py-5 text-left text-base font-medium text-foreground hover:no-underline sm:text-lg">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

/* ---------- Contact form ---------- */
function ContactSection() {
  const [form, setForm] = useState<ContactRequestInput>({
    full_name: "",
    email: "",
    phone: "",
    business_name: "",
    needs: [],
    starting_point: "",
    message: "",
    privacy_accepted: true as unknown as true, // zod literal(true) shape; toggled below
  });
  // real toggle state
  const [privacy, setPrivacy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  function update<K extends keyof ContactRequestInput>(key: K, value: ContactRequestInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }
  function toggleNeed(v: string) {
    setForm((f) => ({
      ...f,
      needs: f.needs.includes(v) ? f.needs.filter((x) => x !== v) : [...f.needs, v],
    }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    const parsed = contactRequestSchema.safeParse({ ...form, privacy_accepted: privacy });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0]?.toString();
        if (k && !errs[k]) errs[k] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      await submitContactRequest(parsed.data, window.location.pathname);
      trackEvent("contact_form_submit");
      setDone(true);
    } catch (err) {
      console.error(err);
      setErrors({ _root: "Qualcosa è andato storto. Riprova o scrivici via email." });
    } finally {
      setSubmitting(false);
    }
  }

  const trust = [
    "Prima analisi gratuita",
    "Risposta entro 24 ore",
    "Puoi partire da una prima versione",
    "Nessuna competenza tecnica richiesta",
  ];

  return (
    <section id="contatti" className="border-t border-border py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="glass-card relative overflow-hidden rounded-3xl p-8 sm:p-10 lg:p-14 soft-glow">
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(11,99,255,0.35),transparent_70%)] blur-2xl" />
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-20 [mask-image:radial-gradient(ellipse_at_left,black,transparent_75%)]" />

          <div className="relative grid grid-cols-1 gap-12 lg:grid-cols-[0.95fr_1.1fr]">
            <div>
              <SectionLabel>Contatti</SectionLabel>
              <h2 className="font-serif mt-6 text-4xl leading-[1.05] sm:text-5xl lg:text-[56px]">
                Raccontaci<br />
                il tuo <span className="text-accent italic">processo.</span>
              </h2>
              <p className="mt-6 max-w-md text-muted-foreground">
                Descrivi la tua attività, il problema che vuoi risolvere o il processo che vorresti
                semplificare. Ti risponderemo entro 24 ore con una prima direzione concreta.
              </p>
              <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
                {trust.map((t) => (
                  <li key={t} className="flex items-start gap-2.5">
                    <span className="mt-[3px] flex h-4 w-4 items-center justify-center rounded-full border border-primary/50 bg-primary/15 text-primary-glow">
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              {done ? (
                <div className="glass-panel flex h-full min-h-[300px] flex-col items-center justify-center rounded-2xl p-10 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-primary/15 text-primary-glow">
                    <Check className="h-5 w-5" strokeWidth={2.5} />
                  </div>
                  <h3 className="mt-5 font-serif text-2xl">Richiesta inviata</h3>
                  <p className="mt-3 max-w-sm text-sm text-muted-foreground">
                    Grazie! Ti risponderemo entro 24 ore con una prima direzione concreta.
                  </p>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Nome e cognome" error={errors.full_name}>
                      <input
                        type="text"
                        required
                        className="admin-input"
                        value={form.full_name}
                        onChange={(e) => update("full_name", e.target.value)}
                        autoComplete="name"
                      />
                    </Field>
                    <Field label="Email" error={errors.email}>
                      <input
                        type="email"
                        required
                        className="admin-input"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        autoComplete="email"
                      />
                    </Field>
                    <Field label="Telefono (opzionale)">
                      <input
                        type="tel"
                        className="admin-input"
                        value={form.phone ?? ""}
                        onChange={(e) => update("phone", e.target.value)}
                        autoComplete="tel"
                      />
                    </Field>
                    <Field label="Nome attività">
                      <input
                        type="text"
                        className="admin-input"
                        value={form.business_name ?? ""}
                        onChange={(e) => update("business_name", e.target.value)}
                        autoComplete="organization"
                      />
                    </Field>
                  </div>

                  <div>
                    <div className="admin-label">Di cosa hai bisogno?</div>
                    <div className="flex flex-wrap gap-2">
                      {NEEDS_OPTIONS.map((n) => {
                        const active = form.needs.includes(n);
                        return (
                          <button
                            type="button"
                            key={n}
                            onClick={() => toggleNeed(n)}
                            aria-pressed={active}
                            className={`rounded-full border px-3 py-1.5 text-xs transition-all ${
                              active
                                ? "border-primary/60 bg-primary/20 text-foreground"
                                : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground"
                            }`}
                          >
                            {n}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <Field label="Punto di partenza">
                    <select
                      className="admin-input"
                      value={form.starting_point ?? ""}
                      onChange={(e) => update("starting_point", e.target.value)}
                    >
                      <option value="">Seleziona…</option>
                      {STARTING_POINTS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Messaggio" error={errors.message}>
                    <textarea
                      required
                      rows={5}
                      className="admin-input resize-none"
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                      placeholder="Raccontaci brevemente cosa vorresti risolvere o migliorare."
                    />
                  </Field>

                  <label className="flex items-start gap-3 text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-border bg-transparent text-primary focus:ring-primary"
                      checked={privacy}
                      onChange={(e) => setPrivacy(e.target.checked)}
                    />
                    <span>
                      Ho letto la{" "}
                      <Link to="/privacy" className="text-primary-glow underline decoration-primary/40 underline-offset-2 hover:text-foreground">
                        Privacy Policy
                      </Link>{" "}
                      e acconsento al trattamento dei dati per rispondere alla mia richiesta.
                    </span>
                  </label>
                  {errors.privacy_accepted && (
                    <p className="text-xs text-red-300">{errors.privacy_accepted}</p>
                  )}
                  {errors._root && <p className="text-xs text-red-300">{errors._root}</p>}

                  <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
                      {submitting ? "Invio in corso…" : "Invia la richiesta"}
                      {!submitting && <ArrowRight className="h-4 w-4" />}
                    </button>
                    <span className="text-xs text-subtle">
                      Nessuna newsletter, nessuno spam: solo una risposta alla tua richiesta.
                    </span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="admin-label">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-300">{error}</p>}
    </div>
  );
}

/* ---------- Page ---------- */
export default function TretnixLanding() {
  useEffect(() => {
    trackEvent("page_view", { path: "/" });
  }, []);

  // support anchor navigation from other pages (/#faq etc.)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      const el = document.getElementById(id);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <PercheServeSection />
        <SolutionsSection />
        <ProjectsSection />
        <WhyTretnixSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
      <BackToTopButton />
    </div>
  );
}
