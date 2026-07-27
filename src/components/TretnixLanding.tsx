import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight, ArrowLeft, Check,
  ShieldAlert, Timer, Gauge,
  Sparkles, Bot, ListChecks, MessageSquareText,
  Plus, Minus, ChevronDown,
  Phone, Video, MoreVertical, Smile, Paperclip, Mic, Send,
} from "lucide-react";
import {
  Navbar,
  Footer,
  BackToTopButton,
  openContactForm,
  scrollToSection,
} from "./TretnixChrome";
import { StorageImage } from "./StorageMedia";
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
            <a
              href="#cosa-possiamo-costruire"
              className="btn-ghost"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection("cosa-possiamo-costruire", { history: "push" });
              }}
            >
              Cosa possiamo costruire
            </a>
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
      className="group relative block overflow-hidden rounded-2xl border border-border transition-all duration-200 ease-out hover:-translate-y-1 hover:border-primary-glow/60 hover:shadow-[0_30px_80px_-20px_rgba(11,99,255,0.35)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className={`aspect-[4/5] w-full ${p.gradient}`}>
        {p.image_url && (
          <StorageImage src={p.image_url} alt={p.title} className="absolute inset-0 h-full w-full object-cover opacity-60" />
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
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void listFeaturedProjects(2)
      .then((nextProjects) => {
        if (cancelled) return;
        setProjects(nextProjects);
        setLoadFailed(false);
      })
      .catch(() => {
        if (cancelled) return;
        setProjects([]);
        setLoadFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
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
            {loading && (
              <>
                <div className="aspect-[4/5] rounded-2xl border border-border bg-white/[0.02]" />
                <div className="aspect-[4/5] rounded-2xl border border-border bg-white/[0.02]" />
              </>
            )}
            {!loading && loadFailed && (
              <div
                role="status"
                className="glass-card col-span-full flex min-h-56 items-center justify-center rounded-2xl p-8 text-center text-sm text-muted-foreground"
              >
                I case study non sono disponibili in questo momento. Riprova più tardi.
              </div>
            )}
            {!loading &&
              !loadFailed &&
              projects.map((p, i) => (
                <Reveal key={p.id} delay={i * 100}>
                  <ProjectCard p={p} />
                </Reveal>
              ))}
            {!loading && !loadFailed && projects.length === 0 && (
              <div className="glass-card col-span-full flex min-h-56 items-center justify-center rounded-2xl p-8 text-center text-sm text-muted-foreground">
                I case study saranno disponibili a breve.
              </div>
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
          <div className="border-t border-border">
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
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ AI Automation Demo — WhatsApp-inspired ============ */
function AIAutomationSection() {
  type Msg = { from: "customer" | "ai"; text: string; time: string };
  const messages: Msg[] = [
    { from: "customer", text: "Buonasera! Siete aperti domani? Mi servirebbe anche un preventivo per un intervento.", time: "18:24" },
    { from: "ai", text: "Buonasera! Domani siamo aperti dalle 8:00 alle 17:00. Per preparare il preventivo, mi lascia nome, telefono e una breve descrizione della richiesta?", time: "18:24" },
    { from: "customer", text: "Marco Bianchi, 340 123 4567. Dovrei sistemare un impianto che perde.", time: "18:25" },
    { from: "ai", text: "Perfetto, ho raccolto la richiesta. Il team riceverà un riepilogo con contatto, problema e priorità.", time: "18:25" },
  ];
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setStep(messages.length);
      return;
    }
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const advance = (i: number) => {
      if (cancelled || i > messages.length) return;
      const next = messages[i];
      if (!next) return;
      if (next.from === "ai") {
        setTyping(true);
        timer = setTimeout(() => {
          if (cancelled) return;
          setTyping(false);
          setStep(i + 1);
          timer = setTimeout(() => advance(i + 1), 1400);
        }, 900);
      } else {
        setStep(i + 1);
        timer = setTimeout(() => advance(i + 1), 1100);
      }
    };
    timer = setTimeout(() => advance(0), 700);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
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
            <div className="space-y-3">
              {/* Phone-style chat */}
              <div className="glass-panel relative overflow-hidden rounded-[28px] p-0 shadow-[0_40px_100px_-30px_rgba(11,99,255,0.35)]">
                {/* Chat header */}
                <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.04] px-4 py-3">
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/50 to-primary/10 text-primary-glow ring-1 ring-primary/40">
                    <Bot className="h-4 w-4" />
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-foreground">Assistente della tua attività</div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-subtle">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      online · risponde in pochi secondi
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <button type="button" tabIndex={-1} aria-hidden="true" className="rounded-full p-1.5 hover:text-foreground"><Video className="h-4 w-4" /></button>
                    <button type="button" tabIndex={-1} aria-hidden="true" className="rounded-full p-1.5 hover:text-foreground"><Phone className="h-4 w-4" /></button>
                    <button type="button" tabIndex={-1} aria-hidden="true" className="rounded-full p-1.5 hover:text-foreground"><MoreVertical className="h-4 w-4" /></button>
                  </div>
                </div>

                {/* Chat body — subtle original wallpaper */}
                <div
                  className="relative min-h-[380px] max-h-[460px] space-y-1.5 overflow-hidden px-3 py-4"
                  style={{
                    backgroundColor: "#0a1220",
                    backgroundImage: [
                      "radial-gradient(circle at 15% 20%, rgba(11,99,255,0.10), transparent 60%)",
                      "radial-gradient(circle at 85% 85%, rgba(16,185,129,0.06), transparent 60%)",
                      "radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)",
                    ].join(","),
                    backgroundSize: "auto, auto, 18px 18px",
                  }}
                >
                  {messages.slice(0, step).map((m, i) => {
                    const mine = m.from === "customer";
                    return (
                      <div key={i} className={`animate-fade-up flex ${mine ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`relative max-w-[80%] px-3 py-2 text-[13px] leading-snug shadow-[0_1px_0_rgba(0,0,0,0.25)] ${
                            mine
                              ? "rounded-2xl rounded-br-sm bg-[#075e54]/85 text-emerald-50 border border-emerald-400/15"
                              : "rounded-2xl rounded-bl-sm bg-[#1c2733] text-foreground border border-white/5"
                          }`}
                        >
                          <p className="pr-10">{m.text}</p>
                          <div className="absolute bottom-1 right-2 flex items-center gap-1 text-[10px] text-emerald-100/60">
                            <span>{m.time}</span>
                            {mine && (
                              <svg viewBox="0 0 16 11" className="h-3 w-3 text-sky-300" fill="none">
                                <path d="M1 5.5l3 3L10 2M6 8.5l3 3L15 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {typing && step < messages.length && (
                    <div className="flex justify-start">
                      <div className="rounded-2xl rounded-bl-sm border border-white/5 bg-[#1c2733] px-3 py-2.5">
                        <span className="inline-flex gap-1">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground/70" />
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground/70 [animation-delay:150ms]" />
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground/70 [animation-delay:300ms]" />
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Fake input bar */}
                <div className="flex items-center gap-2 border-t border-white/10 bg-white/[0.02] px-3 py-2.5">
                  <div className="flex flex-1 items-center gap-2 rounded-full border border-white/10 bg-[#1c2733] px-3 py-2 text-xs text-subtle">
                    <Smile className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 truncate">Messaggio</span>
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/90 text-white">
                    {step >= messages.length ? <Send className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </div>
                </div>
              </div>

              {/* Automation outcome — visually separated from the chat */}
              <div className="glass-card rounded-2xl px-4 py-4">
                <div className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-subtle">
                  <Sparkles className="h-3 w-3 text-primary-glow" />
                  Azioni automatiche generate
                </div>
                <div className="grid grid-cols-2 gap-2">
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
            <div className="glass-card overflow-hidden rounded-2xl">
              <div className="divide-y divide-white/10">
                {primary.map((f, i) => (
                  <FAQItem
                    key={f.q}
                    q={f.q}
                    a={f.a}
                    open={openIdx === i}
                    onToggle={() => setOpenIdx(openIdx === i ? null : i)}
                  />
                ))}
                <FAQCollapse open={expanded}>
                  {secondary.map((f, i) => {
                    const idx = primary.length + i;
                    return (
                      <FAQItem
                        key={f.q}
                        q={f.q}
                        a={f.a}
                        open={openIdx === idx}
                        onToggle={() => setOpenIdx(openIdx === idx ? null : idx)}
                        withTopBorder
                      />
                    );
                  })}
                </FAQCollapse>
              </div>
            </div>
            <div className="mt-5 text-center lg:text-left">
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                aria-controls="faq-extra"
                className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {expanded ? "Nascondi domande" : "Mostra altre domande"}
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${expanded ? "rotate-180" : "rotate-0"}`}
                />
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Single FAQ row with smooth height + opacity + translate animation. */
function FAQItem({
  q,
  a,
  open,
  onToggle,
  withTopBorder = false,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
  withTopBorder?: boolean;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [maxH, setMaxH] = useState(0);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const measure = () => setMaxH(el.scrollHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [a]);

  return (
    <div className={withTopBorder ? "border-t border-white/10" : ""}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-base font-medium transition-colors sm:text-lg ${
          open ? "text-foreground" : "text-foreground/90 hover:text-primary-glow"
        }`}
      >
        <span>{q}</span>
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-primary-glow transition-all duration-300 ${
            open ? "border-primary/60 bg-primary/10 rotate-180" : "border-white/15"
          }`}
        >
          {open ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
        </span>
      </button>
      <div
        className="overflow-hidden transition-[max-height,opacity] duration-400 ease-[cubic-bezier(0.22,0.61,0.36,1)] motion-reduce:transition-none"
        style={{
          maxHeight: open ? `${maxH}px` : "0px",
          opacity: open ? 1 : 0,
        }}
        aria-hidden={!open}
      >
        <div
          ref={innerRef}
          className={`px-6 pb-5 text-sm leading-relaxed text-muted-foreground transition-transform duration-400 ease-[cubic-bezier(0.22,0.61,0.36,1)] sm:text-base motion-reduce:transition-none ${
            open ? "translate-y-0" : "-translate-y-1"
          }`}
        >
          {a}
        </div>
      </div>
    </div>
  );
}

/** Smooth collapse for the "extra questions" group. */
function FAQCollapse({ open, children }: { open: boolean; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setH(el.scrollHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [children]);

  return (
    <div
      id="faq-extra"
      className="overflow-hidden transition-[max-height,opacity] duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] motion-reduce:transition-none"
      style={{ maxHeight: open ? `${h}px` : "0px", opacity: open ? 1 : 0 }}
      aria-hidden={!open}
    >
      <div ref={ref}>{children}</div>
    </div>
  );
}

/* ============ Contact — step by step ============ */
const CONTACT_IDS = {
  form: "contact-form",
  honeypot: "contact-website",
  step1Heading: "contact-step-1-heading",
  step1Hint: "contact-step-1-hint",
  step2Heading: "contact-step-2-heading",
  step2Hint: "contact-step-2-hint",
  step3Heading: "contact-step-3-heading",
  step3Hint: "contact-step-3-hint",
  fullName: "contact-full-name",
  fullNameError: "contact-full-name-error",
  email: "contact-email",
  emailError: "contact-email-error",
  phone: "contact-phone",
  businessName: "contact-business-name",
  needsLabel: "contact-needs-label",
  startingPoint: "contact-starting-point",
  message: "contact-message",
  messageError: "contact-message-error",
  privacy: "contact-privacy",
  privacyError: "contact-privacy-error",
  rootError: "contact-form-error",
  successHeading: "contact-success-heading",
} as const;

const CONTACT_ERROR_FOCUS_ORDER = [
  "full_name",
  "email",
  "message",
  "privacy_accepted",
] as const;

type ContactInvalidFocusTarget = (typeof CONTACT_ERROR_FOCUS_ORDER)[number];
type ContactFocusTarget = ContactInvalidFocusTarget | "step-heading" | "success-heading";

function ariaDescribedBy(...ids: Array<string | false | undefined>) {
  const value = ids.filter((id): id is string => Boolean(id)).join(" ");
  return value || undefined;
}

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
  const [pendingFocus, setPendingFocus] = useState<ContactFocusTarget | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const privacyRef = useRef<HTMLInputElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!pendingFocus) return;

    const target =
      pendingFocus === "step-heading"
        ? stepHeadingRef.current
        : pendingFocus === "success-heading"
          ? successHeadingRef.current
          : pendingFocus === "full_name"
            ? fullNameRef.current
            : pendingFocus === "email"
              ? emailRef.current
              : pendingFocus === "message"
                ? messageRef.current
                : privacyRef.current;

    if (!target) return;

    if (pendingFocus === "step-heading" || pendingFocus === "success-heading") {
      target.focus({ preventScroll: true });
    } else {
      target.focus();
    }
    setPendingFocus(null);
  }, [done, pendingFocus, step]);

  useEffect(() => {
    function onOpen(e: Event) {
      const detail = (e as CustomEvent).detail as
        | { preselectNeed?: string; skipFocus?: boolean }
        | undefined;
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
      if (!detail?.skipFocus) {
        setPendingFocus("step-heading");
      }
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

  function focusFirstInvalid(errs: Record<string, string>, navigateToStep = false) {
    const firstInvalid = CONTACT_ERROR_FOCUS_ORDER.find((key) => Boolean(errs[key]));
    if (!firstInvalid) return;

    if (navigateToStep) {
      setStep(firstInvalid === "full_name" || firstInvalid === "email" ? 0 : 2);
    }
    setPendingFocus(firstInvalid);
  }

  function validateStep1() {
    const errs: Record<string, string> = {};
    if (form.full_name.trim().length < 2) errs.full_name = "Inserisci nome e cognome";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errs.email = "Email non valida";
    setErrors(errs);
    focusFirstInvalid(errs);
    return Object.keys(errs).length === 0;
  }
  function validateStep3() {
    const errs: Record<string, string> = {};
    if (form.message.trim().length < 10) errs.message = "Scrivi almeno 10 caratteri";
    if (!privacy) errs.privacy_accepted = "Devi accettare la privacy";
    setErrors(errs);
    focusFirstInvalid(errs);
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
      focusFirstInvalid(errs, true);
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
      setPendingFocus("success-heading");
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
                    <h3
                      ref={successHeadingRef}
                      id={CONTACT_IDS.successHeading}
                      tabIndex={-1}
                      className="mt-5 font-serif text-2xl"
                    >
                      Richiesta inviata
                    </h3>
                    <p className="mt-3 max-w-sm text-sm text-muted-foreground">
                      Ti risponderemo entro 24 ore con una prima direzione concreta.
                    </p>
                  </div>
                ) : (
                  <form
                    id={CONTACT_IDS.form}
                    onSubmit={onSubmit}
                    noValidate
                    aria-busy={submitting}
                    className="space-y-6"
                  >
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
                      <label htmlFor={CONTACT_IDS.honeypot}>
                        Website
                        <input
                          ref={honeypotRef}
                          id={CONTACT_IDS.honeypot}
                          type="text"
                          name="website"
                          tabIndex={-1}
                          autoComplete="off"
                        />
                      </label>
                    </div>

                    {step === 0 && (
                      <div
                        role="group"
                        aria-labelledby={CONTACT_IDS.step1Heading}
                        aria-describedby={CONTACT_IDS.step1Hint}
                        className="space-y-5"
                      >
                        <div>
                          <h3
                            ref={stepHeadingRef}
                            id={CONTACT_IDS.step1Heading}
                            tabIndex={-1}
                            className="text-xl font-medium text-foreground"
                          >
                            <span className="sr-only">Passaggio 1 di 3: </span>
                            Partiamo dai tuoi contatti
                          </h3>
                          <p id={CONTACT_IDS.step1Hint} className="mt-1 text-xs text-subtle">
                            Ci servono solo per risponderti.
                          </p>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <Field
                            controlId={CONTACT_IDS.fullName}
                            label="Nome e cognome"
                            error={errors.full_name}
                            errorId={CONTACT_IDS.fullNameError}
                          >
                            <input
                              ref={fullNameRef}
                              id={CONTACT_IDS.fullName}
                              type="text"
                              maxLength={120}
                              className="admin-input"
                              value={form.full_name}
                              onChange={(e) => update("full_name", e.target.value)}
                              autoComplete="name"
                              aria-invalid={errors.full_name ? true : undefined}
                              aria-describedby={
                                errors.full_name ? CONTACT_IDS.fullNameError : undefined
                              }
                            />
                          </Field>
                          <Field
                            controlId={CONTACT_IDS.email}
                            label="Email"
                            error={errors.email}
                            errorId={CONTACT_IDS.emailError}
                          >
                            <input
                              ref={emailRef}
                              id={CONTACT_IDS.email}
                              type="email"
                              maxLength={180}
                              className="admin-input"
                              value={form.email}
                              onChange={(e) => update("email", e.target.value)}
                              autoComplete="email"
                              aria-invalid={errors.email ? true : undefined}
                              aria-describedby={errors.email ? CONTACT_IDS.emailError : undefined}
                            />
                          </Field>
                          <Field controlId={CONTACT_IDS.phone} label="Telefono (opzionale)">
                            <input
                              id={CONTACT_IDS.phone}
                              type="tel"
                              maxLength={40}
                              className="admin-input"
                              value={form.phone ?? ""}
                              onChange={(e) => update("phone", e.target.value)}
                              autoComplete="tel"
                            />
                          </Field>
                          <Field
                            controlId={CONTACT_IDS.businessName}
                            label="Nome attività (opzionale)"
                          >
                            <input
                              id={CONTACT_IDS.businessName}
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
                            onClick={() => {
                              if (validateStep1()) {
                                setStep(1);
                                setPendingFocus("step-heading");
                              }
                            }}
                            className="btn-primary group"
                          >
                            Continua <ArrowIcon />
                          </button>
                        </div>
                      </div>
                    )}

                    {step === 1 && (
                      <div
                        role="group"
                        aria-labelledby={CONTACT_IDS.step2Heading}
                        aria-describedby={CONTACT_IDS.step2Hint}
                        className="space-y-5"
                      >
                        <div>
                          <h3
                            ref={stepHeadingRef}
                            id={CONTACT_IDS.step2Heading}
                            tabIndex={-1}
                            className="text-xl font-medium text-foreground"
                          >
                            <span className="sr-only">Passaggio 2 di 3: </span>
                            Cosa vuoi semplificare?
                          </h3>
                          <p id={CONTACT_IDS.step2Hint} className="mt-1 text-xs text-subtle">
                            Seleziona quello che ti interessa (facoltativo).
                          </p>
                        </div>
                        <div
                          role="group"
                          aria-labelledby={CONTACT_IDS.needsLabel}
                          aria-describedby={CONTACT_IDS.step2Hint}
                        >
                          <div id={CONTACT_IDS.needsLabel} className="admin-label">
                            Di cosa hai bisogno
                          </div>
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
                        <Field
                          controlId={CONTACT_IDS.startingPoint}
                          label="Punto di partenza"
                        >
                          <select
                            id={CONTACT_IDS.startingPoint}
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
                            onClick={() => {
                              setStep(0);
                              setPendingFocus("step-heading");
                            }}
                            className="btn-ghost"
                          >
                            <ArrowLeft className="h-4 w-4" /> Indietro
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setStep(2);
                              setPendingFocus("step-heading");
                            }}
                            className="btn-primary group"
                          >
                            Continua <ArrowIcon />
                          </button>
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div
                        role="group"
                        aria-labelledby={CONTACT_IDS.step3Heading}
                        aria-describedby={CONTACT_IDS.step3Hint}
                        className="space-y-5"
                      >
                        <div>
                          <h3
                            ref={stepHeadingRef}
                            id={CONTACT_IDS.step3Heading}
                            tabIndex={-1}
                            className="text-xl font-medium text-foreground"
                          >
                            <span className="sr-only">Passaggio 3 di 3: </span>
                            Raccontaci il problema
                          </h3>
                          <p id={CONTACT_IDS.step3Hint} className="mt-1 text-xs text-subtle">
                            Poche righe bastano: ti richiamiamo noi.
                          </p>
                        </div>
                        <Field
                          controlId={CONTACT_IDS.message}
                          label="Messaggio"
                          error={errors.message}
                          errorId={CONTACT_IDS.messageError}
                        >
                          <textarea
                            ref={messageRef}
                            id={CONTACT_IDS.message}
                            rows={5}
                            maxLength={3000}
                            className="admin-input resize-none"
                            value={form.message}
                            onChange={(e) => update("message", e.target.value)}
                            placeholder="Descrivi brevemente cosa vorresti risolvere o migliorare."
                            aria-invalid={errors.message ? true : undefined}
                            aria-describedby={ariaDescribedBy(
                              CONTACT_IDS.step3Hint,
                              errors.message && CONTACT_IDS.messageError,
                            )}
                          />
                        </Field>
                        <label
                          htmlFor={CONTACT_IDS.privacy}
                          className="flex items-start gap-3 text-sm text-muted-foreground"
                        >
                          <input
                            ref={privacyRef}
                            id={CONTACT_IDS.privacy}
                            type="checkbox"
                            className="mt-1 h-4 w-4 rounded border-border bg-transparent text-primary focus:ring-primary"
                            checked={privacy}
                            onChange={(e) => setPrivacy(e.target.checked)}
                            aria-invalid={errors.privacy_accepted ? true : undefined}
                            aria-describedby={
                              errors.privacy_accepted ? CONTACT_IDS.privacyError : undefined
                            }
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
                          <p id={CONTACT_IDS.privacyError} className="text-xs text-red-300">
                            {errors.privacy_accepted}
                          </p>
                        )}
                        {errors._root && (
                          <p
                            id={CONTACT_IDS.rootError}
                            role="alert"
                            className="text-xs text-red-300"
                          >
                            {errors._root}
                          </p>
                        )}
                        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
                          <button
                            type="button"
                            onClick={() => {
                              setStep(1);
                              setPendingFocus("step-heading");
                            }}
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
  controlId,
  label,
  error,
  errorId,
  children,
}: {
  controlId: string;
  label: string;
  error?: string;
  errorId?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={controlId} className="admin-label">
        {label}
      </label>
      {children}
      {error && (
        <p id={errorId} className="mt-1 text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

/* ============ Page ============ */
export default function TretnixLanding() {
  useEffect(() => {
    trackEvent("page_view", { path: "/" });
  }, []);

  // Support direct hashes and keep Back/Forward aligned with the fixed navbar.
  useEffect(() => {
    if (typeof window === "undefined") return;

    let frame = 0;

    const scrollFromLocationHash = () => {
      const rawHash = window.location.hash.slice(1);
      if (!rawHash) return;

      let id = rawHash;
      try {
        id = decodeURIComponent(rawHash);
      } catch {
        // Keep the raw id when an external URL contains malformed escaping.
      }

      if (frame) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        scrollToSection(id, { behavior: "auto" });
      });
    };

    const initialTimer = window.setTimeout(scrollFromLocationHash, 60);
    window.addEventListener("popstate", scrollFromLocationHash);
    window.addEventListener("hashchange", scrollFromLocationHash);

    return () => {
      if (initialTimer) window.clearTimeout(initialTimer);
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("popstate", scrollFromLocationHash);
      window.removeEventListener("hashchange", scrollFromLocationHash);
    };
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
