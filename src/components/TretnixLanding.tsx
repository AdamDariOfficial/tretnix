import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight, ArrowLeft, Check,
  ShieldAlert, Timer, Gauge,
  Sparkles, Bot, ListChecks, MessageSquareText,
  Plus, Minus,
} from "lucide-react";
import { Navbar, Footer, BackToTopButton, openContactForm } from "./TretnixChrome";
import { HeroMockup } from "./HeroMockup";
import { listFeaturedProjects, type Project } from "@/lib/projects";
import { trackEvent } from "@/lib/analytics";
import {
  contactRequestSchema,
  submitContactRequest,
  NEEDS_OPTIONS,
  STARTING_POINTS,
  type ContactRequestInput,
} from "@/lib/contact-requests";

/* ============ Small primitives ============ */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-8 bg-primary-glow/60" />
      <span className="section-label">{children}</span>
    </div>
  );
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <ArrowRight
      className={`h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 ${className}`}
    />
  );
}

/** Fade-up reveal when element enters viewport. */
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      }),
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } motion-reduce:transition-none motion-reduce:translate-y-0 motion-reduce:opacity-100 ${className}`}
    >
      {children}
    </div>
  );
}

/* ============ Hero ============ */
function HeroSection() {
  return (
    <section id="top" className="relative overflow-hidden pt-40 pb-28 lg:pt-44 lg:pb-36">
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
            riduce gli errori e fa crescere la tua azienda nel tempo.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => { trackEvent("cta_click"); openContactForm(); }}
              className="btn-primary group"
            >
              Parliamo del tuo progetto <ArrowIcon />
            </button>
            <a href="#cosa-possiamo-costruire" className="btn-ghost">Cosa possiamo costruire</a>
          </div>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-subtle">
            Non sai ancora cosa ti serve? Partiamo dal tuo processo e troviamo insieme
            la prima versione utile.
          </p>
        </div>

        <div className="relative mt-8 lg:mt-0">
          <HeroMockup />
        </div>
      </div>
    </section>
  );
}

/* ============ Perché serve ============ */
function PercheServeSection() {
  const cards = [
    { Icon: ShieldAlert, t: "Meno errori", d: "Centralizza dati e processi per evitare informazioni duplicate, dimenticate o difficili da trovare." },
    { Icon: Timer, t: "Meno tempo perso", d: "Automatizza attività ripetitive e semplifica il lavoro quotidiano del team." },
    { Icon: Gauge, t: "Più controllo", d: "Dashboard e report per una visione chiara di clienti, ordini, attività e risultati." },
  ];
  return (
    <section id="perche-serve" className="border-t border-border py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.4fr]">
          <Reveal>
            <SectionLabel>Perché serve</SectionLabel>
            <h2 className="font-serif mt-6 text-4xl leading-[1.05] sm:text-5xl lg:text-[56px]">
              Meno caos operativo.<br />
              Più <span className="text-accent italic">controllo</span> sul lavoro.
            </h2>
          </Reveal>
          <Reveal delay={80} className="space-y-6 text-muted-foreground">
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
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {cards.map(({ Icon, t, d }, i) => (
            <Reveal key={t} delay={i * 80}>
              <div className="glass-card rounded-2xl p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/40 bg-primary/10 text-primary-glow">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <h3 className="mt-5 text-xl font-medium text-foreground">{t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ Soluzioni: 3 blocchi compatti ============ */
function SolutionsSection() {
  const blocks = [
    {
      t: "Gestione operativa",
      d: "Clienti, ordini, prenotazioni, fornitori, magazzino e attività quotidiane in un sistema unico.",
      tags: ["Clienti", "Ordini", "Prenotazioni", "Fornitori", "Magazzino", "Attività"],
    },
    {
      t: "Dati e controllo",
      d: "Dashboard, report, storico e statistiche per capire cosa succede davvero nella tua azienda.",
      tags: ["Dashboard", "Report", "Statistiche", "Storico", "PDF", "Esportazioni"],
    },
    {
      t: "Automazioni e AI",
      d: "Automazioni per ridurre attività ripetitive, organizzare richieste e trasformare messaggi in azioni.",
      tags: ["Email", "WhatsApp", "Notifiche", "Task", "AI", "Workflow"],
    },
  ];
  return (
    <section id="cosa-possiamo-costruire" className="border-t border-border py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="max-w-3xl">
          <SectionLabel>Soluzioni</SectionLabel>
          <h2 className="font-serif mt-6 text-4xl leading-[1.05] sm:text-5xl lg:text-[56px]">
            Sistemi concreti<br />
            per problemi <span className="text-accent italic">reali.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-muted-foreground">
            Tre aree in cui Tretnix costruisce sistemi su misura, in modo modulare:
            si parte dall'essenziale e si cresce nel tempo.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {blocks.map((b, i) => (
            <Reveal key={b.t} delay={i * 90}>
              <div className="glass-card flex h-full flex-col rounded-2xl p-7">
                <div className="section-label !text-primary-glow">0{i + 1}</div>
                <h3 className="mt-4 text-xl font-medium text-foreground sm:text-2xl">{b.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{b.d}</p>
                <div className="mt-6 flex flex-wrap gap-1.5">
                  {b.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] tracking-wide text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ Progetti ============ */
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
          Visualizza concept <ArrowIcon />
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
          <Reveal>
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
              className="group mt-8 inline-flex items-center gap-2 text-sm text-foreground hover:text-primary-glow transition-colors"
            >
              Vedi tutti i progetti <ArrowIcon />
            </Link>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {projects.map((p, i) => (
              <Reveal key={p.id} delay={i * 100}>
                <ProjectCard p={p} />
              </Reveal>
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

/* ============ Metodo (merged) ============ */
function MetodoSection() {
  const rows = [
    { n: "01", t: "Ascoltiamo", d: "Analizziamo come lavori oggi, quali strumenti usi e dove perdi più tempo." },
    { n: "02", t: "Progettiamo la prima versione", d: "Definiamo una soluzione essenziale, utile subito e pensata per crescere nel tempo." },
    { n: "03", t: "Sviluppiamo e testiamo", d: "Costruiamo il sistema, raccogliamo feedback e miglioriamo il flusso prima del rilascio." },
    { n: "04", t: "Rilasciamo e restiamo", d: "Mettiamo online, ti aiutiamo a usarlo e restiamo disponibili per supporto e nuove funzioni." },
  ];
  return (
    <section id="metodo" className="border-t border-border py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.95fr_1.4fr]">
          <Reveal>
            <SectionLabel>Metodo</SectionLabel>
            <h2 className="font-serif mt-6 text-4xl leading-[1.05] sm:text-5xl lg:text-[56px]">
              Un processo chiaro,<br />
              senza complicazioni <span className="text-accent italic">inutili.</span>
            </h2>
            <p className="mt-6 max-w-md text-muted-foreground">
              Un progetto digitale funziona quando parte dal modo reale in cui lavora la tua
              azienda. Ascolto diretto, un solo referente, approccio modulare e supporto
              dopo la consegna.
            </p>
          </Reveal>
          <ul className="border-t border-border">
            {rows.map((r, i) => (
              <Reveal key={r.n} delay={i * 70}
                className="grid grid-cols-[auto_1fr] items-start gap-6 border-b border-border py-7"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/40 bg-background text-primary-glow soft-glow">
                  <span className="font-serif text-sm">{r.n}</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground sm:text-xl">{r.t}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{r.d}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ============ AI Automation Demo ============ */
function AIAutomationSection() {
  const [step, setStep] = useState(0);
  const messages = [
    { from: "customer", text: "Buonasera! Siete aperti domani? Mi servirebbe anche un preventivo per un intervento." },
    { from: "ai", text: "Buonasera! Domani siamo aperti dalle 8:00 alle 17:00. Per preparare il preventivo, mi lascia nome, telefono e una breve descrizione della richiesta?" },
    { from: "customer", text: "Marco Bianchi, 340 123 4567. Dovrei sistemare un impianto che perde." },
    { from: "ai", text: "Perfetto, ho raccolto la richiesta. Il team riceverà un riepilogo con contatto, problema e priorità." },
  ];

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setStep(messages.length);
      return;
    }
    const t = setInterval(() => {
      setStep((s) => (s < messages.length ? s + 1 : s));
    }, 900);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const benefits = [
    "Risponde alle domande frequenti",
    "Raccoglie dati utili dal cliente",
    "Crea attività e riepiloghi per il team",
    "Riduce messaggi ripetitivi e tempo perso",
  ];
  const statuses = [
    { Icon: ListChecks, t: "Richiesta classificata" },
    { Icon: Check, t: "Contatto salvato" },
    { Icon: Sparkles, t: "Task creato" },
    { Icon: MessageSquareText, t: "Riepilogo inviato al team" },
  ];

  return (
    <section id="automazioni-ai" className="border-t border-border py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1.05fr] lg:items-center">
          <Reveal>
            <SectionLabel>Automazioni AI</SectionLabel>
            <h2 className="font-serif mt-6 text-4xl leading-[1.05] sm:text-5xl lg:text-[56px]">
              Un assistente digitale<br />
              che alleggerisce il <span className="text-accent italic">lavoro.</span>
            </h2>
            <p className="mt-6 max-w-xl text-muted-foreground">
              Molte richieste arrivano via WhatsApp, email o form: orari, preventivi,
              appuntamenti, informazioni e problemi da gestire. Un assistente AI può rispondere
              alle domande ripetitive, raccogliere i dati importanti e trasformare ogni messaggio
              in un'attività ordinata per il tuo team.
            </p>
            <div className="mt-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[0.7rem] uppercase tracking-[0.22em] text-primary-glow">
                <Bot className="h-3 w-3" /> Demo simulata
              </span>
            </div>
            <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-2.5">
                  <span className="mt-[3px] flex h-4 w-4 items-center justify-center rounded-full border border-primary/50 bg-primary/15 text-primary-glow">
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-xl text-xs leading-relaxed text-subtle">
              L'AI non sostituisce il tuo lavoro: elimina le richieste ripetitive
              e prepara tutto ciò che serve al tuo team.
            </p>
            <div className="mt-8">
              <button
                type="button"
                onClick={() => { trackEvent("cta_click"); openContactForm("Automazioni"); }}
                className="btn-primary group"
              >
                Voglio automatizzare le richieste <ArrowIcon />
              </button>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="glass-panel relative overflow-hidden rounded-3xl p-5 sm:p-6">
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(11,99,255,0.25),transparent_70%)] blur-2xl" />

              <div className="relative flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary-glow">
                  <Bot className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-foreground">Assistente della tua attività</div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-subtle">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                    online · risponde in pochi secondi
                  </div>
                </div>
              </div>

              <div className="relative mt-4 max-h-[360px] space-y-3 overflow-hidden">
                {messages.slice(0, step).map((m, i) => (
                  <div
                    key={i}
                    className={`animate-fade-up flex ${m.from === "customer" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        m.from === "customer"
                          ? "bg-white/[0.06] text-foreground border border-white/10"
                          : "bg-primary/15 text-foreground border border-primary/30"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                {step < messages.length && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl border border-primary/30 bg-primary/10 px-3.5 py-2.5">
                      <span className="inline-flex gap-1">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary-glow" />
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary-glow [animation-delay:150ms]" />
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary-glow [animation-delay:300ms]" />
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2 border-t border-white/10 pt-4">
                {statuses.map(({ Icon, t }, i) => {
                  const done = step > i;
                  return (
                    <div
                      key={t}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-[11px] transition-colors ${
                        done
                          ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                          : "border-white/10 bg-white/[0.02] text-subtle"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {t}
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ============ FAQ compatta ============ */
function FAQSection() {
  const primary = [
    { q: "Quanto costa un software su misura?",
      a: "Dipende da cosa deve fare il sistema. Dopo una prima analisi gratuita ricevi una proposta chiara con funzionalità, tempi e ambito di lavoro, così puoi valutare tutto con calma." },
    { q: "Posso partire da una prima versione?",
      a: "Sì. Possiamo iniziare da una versione essenziale, concentrata sul problema più importante, e farla crescere nel tempo con nuove funzioni." },
    { q: "Quanto tempo serve?",
      a: "Una prima versione può richiedere poche settimane; progetti più complessi vengono divisi in fasi. Prima di iniziare definiamo sempre cosa verrà consegnato e in quali tempi." },
    { q: "Dopo la consegna mi seguite?",
      a: "Sì. Possiamo occuparci di manutenzione, aggiornamenti, modifiche, nuove funzionalità e supporto operativo anche dopo la pubblicazione." },
  ];
  const secondary = [
    { q: "Il software sarà mio?",
      a: "Il progetto viene costruito per la tua azienda e i dati restano tuoi. L'obiettivo è creare una soluzione chiara, mantenibile e senza vincoli inutili." },
    { q: "Serve avere già tutto chiaro?",
      a: "No. Basta raccontarci come lavori oggi, quali strumenti usi e cosa ti fa perdere più tempo. Ti aiutiamo noi a trasformare il problema in una soluzione concreta." },
  ];
  const [expanded, setExpanded] = useState(false);
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const all = expanded ? [...primary, ...secondary] : primary;

  return (
    <section id="faq" className="border-t border-border py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.9fr_1.4fr]">
          <Reveal>
            <SectionLabel>Domande frequenti</SectionLabel>
            <h2 className="font-serif mt-6 text-4xl leading-[1.05] sm:text-5xl lg:text-[56px]">
              Le domande più comuni<br />
              prima di <span className="text-accent italic">iniziare.</span>
            </h2>
            <p className="mt-6 max-w-md text-muted-foreground">
              Se hai altre domande, scrivici direttamente: rispondiamo entro 24 ore
              con una prima direzione concreta.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <div className="glass-card divide-y divide-white/10 rounded-2xl">
              {all.map((f, i) => {
                const open = openIdx === i;
                return (
                  <div key={f.q}>
                    <button
                      type="button"
                      onClick={() => setOpenIdx(open ? null : i)}
                      aria-expanded={open}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-base font-medium text-foreground transition-colors hover:text-primary-glow sm:text-lg"
                    >
                      <span>{f.q}</span>
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 text-primary-glow">
                        {open ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                      </span>
                    </button>
                    <div
                      className={`grid overflow-hidden px-6 transition-[grid-template-rows,padding] duration-300 ease-out ${
                        open ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="min-h-0 text-sm leading-relaxed text-muted-foreground sm:text-base">
                        {f.a}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {!expanded && (
              <div className="mt-5 text-center lg:text-left">
                <button
                  type="button"
                  onClick={() => setExpanded(true)}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Mostra altre domande →
                </button>
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ============ Contact — step by step ============ */
function ContactSection() {
  const [form, setForm] = useState<Omit<ContactRequestInput, "privacy_accepted">>({
    full_name: "",
    email: "",
    phone: "",
    business_name: "",
    needs: [],
    starting_point: "",
    message: "",
  });
  const [privacy, setPrivacy] = useState(false);
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onOpen(e: Event) {
      const detail = (e as CustomEvent).detail as { preselectNeed?: string } | undefined;
      setStep(0);
      setDone(false);
      setErrors({});
      if (detail?.preselectNeed) {
        setForm((f) =>
          f.needs.includes(detail.preselectNeed!)
            ? f
            : { ...f, needs: [...f.needs, detail.preselectNeed!] },
        );
      }
      setTimeout(() => firstFieldRef.current?.focus(), 250);
    }
    window.addEventListener("tretnix:openContact", onOpen);
    return () => window.removeEventListener("tretnix:openContact", onOpen);
  }, []);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }
  function toggleNeed(v: string) {
    setForm((f) => ({
      ...f,
      needs: f.needs.includes(v) ? f.needs.filter((x) => x !== v) : [...f.needs, v],
    }));
  }

  function validateStep1() {
    const errs: Record<string, string> = {};
    if (form.full_name.trim().length < 2) errs.full_name = "Inserisci nome e cognome";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errs.email = "Email non valida";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }
  function validateStep3() {
    const errs: Record<string, string> = {};
    if (form.message.trim().length < 10) errs.message = "Scrivi almeno 10 caratteri";
    if (!privacy) errs.privacy_accepted = "Devi accettare la privacy";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    if (!validateStep3()) return;
    const parsed = contactRequestSchema.safeParse({ ...form, privacy_accepted: privacy as true });
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
      await submitContactRequest(
        parsed.data,
        window.location.pathname,
        honeypotRef.current?.value ?? "",
      );
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
        <Reveal>
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
                  Tre passaggi rapidi. Ti risponderemo entro 24 ore con una prima direzione concreta,
                  senza impegno.
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
                      Ti risponderemo entro 24 ore con una prima direzione concreta.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} noValidate className="space-y-6">
                    {/* Progress */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-[0.2em] text-subtle">
                        Step {step + 1} di 3
                      </span>
                      <div className="flex flex-1 items-center gap-1.5 pl-4">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className={`h-[3px] flex-1 rounded-full transition-colors ${
                              i <= step ? "bg-primary-glow" : "bg-white/10"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Honeypot — hidden from users */}
                    <div className="hidden" aria-hidden="true">
                      <label>
                        Website
                        <input
                          ref={honeypotRef}
                          type="text"
                          name="website"
                          tabIndex={-1}
                          autoComplete="off"
                        />
                      </label>
                    </div>

                    {step === 0 && (
                      <div className="space-y-5">
                        <div>
                          <h3 className="text-xl font-medium text-foreground">Partiamo dai tuoi contatti</h3>
                          <p className="mt-1 text-xs text-subtle">Ci servono solo per risponderti.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <Field label="Nome e cognome" error={errors.full_name}>
                            <input
                              ref={firstFieldRef}
                              type="text"
                              maxLength={120}
                              className="admin-input"
                              value={form.full_name}
                              onChange={(e) => update("full_name", e.target.value)}
                              autoComplete="name"
                            />
                          </Field>
                          <Field label="Email" error={errors.email}>
                            <input
                              type="email"
                              maxLength={180}
                              className="admin-input"
                              value={form.email}
                              onChange={(e) => update("email", e.target.value)}
                              autoComplete="email"
                            />
                          </Field>
                          <Field label="Telefono (opzionale)">
                            <input
                              type="tel"
                              maxLength={40}
                              className="admin-input"
                              value={form.phone ?? ""}
                              onChange={(e) => update("phone", e.target.value)}
                              autoComplete="tel"
                            />
                          </Field>
                          <Field label="Nome attività (opzionale)">
                            <input
                              type="text"
                              maxLength={160}
                              className="admin-input"
                              value={form.business_name ?? ""}
                              onChange={(e) => update("business_name", e.target.value)}
                              autoComplete="organization"
                            />
                          </Field>
                        </div>
                        <div className="flex justify-end pt-2">
                          <button
                            type="button"
                            onClick={() => { if (validateStep1()) setStep(1); }}
                            className="btn-primary group"
                          >
                            Continua <ArrowIcon />
                          </button>
                        </div>
                      </div>
                    )}

                    {step === 1 && (
                      <div className="space-y-5">
                        <div>
                          <h3 className="text-xl font-medium text-foreground">Cosa vuoi semplificare?</h3>
                          <p className="mt-1 text-xs text-subtle">Seleziona quello che ti interessa (facoltativo).</p>
                        </div>
                        <div>
                          <div className="admin-label">Di cosa hai bisogno</div>
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
                        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
                          <button
                            type="button"
                            onClick={() => setStep(0)}
                            className="btn-ghost"
                          >
                            <ArrowLeft className="h-4 w-4" /> Indietro
                          </button>
                          <button
                            type="button"
                            onClick={() => setStep(2)}
                            className="btn-primary group"
                          >
                            Continua <ArrowIcon />
                          </button>
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-5">
                        <div>
                          <h3 className="text-xl font-medium text-foreground">Raccontaci il problema</h3>
                          <p className="mt-1 text-xs text-subtle">Poche righe bastano: ti richiamiamo noi.</p>
                        </div>
                        <Field label="Messaggio" error={errors.message}>
                          <textarea
                            rows={5}
                            maxLength={3000}
                            className="admin-input resize-none"
                            value={form.message}
                            onChange={(e) => update("message", e.target.value)}
                            placeholder="Descrivi brevemente cosa vorresti risolvere o migliorare."
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
                        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="btn-ghost"
                          >
                            <ArrowLeft className="h-4 w-4" /> Indietro
                          </button>
                          <button
                            type="submit"
                            disabled={submitting}
                            className="btn-primary group disabled:opacity-60"
                          >
                            {submitting ? "Invio in corso…" : "Invia la richiesta"}
                            {!submitting && <ArrowIcon />}
                          </button>
                        </div>
                        <p className="text-xs text-subtle">
                          Nessuna newsletter, nessuno spam: solo una risposta alla tua richiesta.
                        </p>
                      </div>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>
        </Reveal>
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

/* ============ Page ============ */
export default function TretnixLanding() {
  useEffect(() => {
    trackEvent("page_view", { path: "/" });
  }, []);

  // Support anchor navigation from other pages (/#faq etc.)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          const top = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: "smooth" });
        }, 60);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <PercheServeSection />
        <SolutionsSection />
        <ProjectsSection />
        <MetodoSection />
        <AIAutomationSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
      <BackToTopButton />
    </div>
  );
}
