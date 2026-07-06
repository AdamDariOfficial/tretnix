import { Link } from "@tanstack/react-router";
import {
  ArrowRight, ArrowDown,
  Boxes, Layers, ShieldCheck,
  ShieldAlert, Timer, Gauge,
  Check,
} from "lucide-react";
import { Navbar, Footer, BackToTopButton } from "./TretnixChrome";
import { HeroMockup } from "./HeroMockup";

/* ---------- Section Label ---------- */
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
  return (
    <section id="top" className="relative overflow-hidden pt-40 pb-32 lg:pt-44 lg:pb-40">
      {/* bg */}
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
          <h1 className="mt-6 text-[44px] leading-[1.02] tracking-tight sm:text-[54px] lg:text-[72px]">
            Soluzioni digitali<br />
            su misura per aziende<br />
            che vogliono lavorare <span className="text-accent italic">meglio.</span>
          </h1>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Progettiamo e sviluppiamo software personalizzato che semplifica i processi,
            riduce gli errori e fa crescere la tua azienda in modo sostenibile.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#contatti" className="btn-primary">
              Parliamo del tuo progetto <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#servizi" className="btn-ghost">Scopri i nostri servizi</a>
          </div>
          <p className="mt-6 max-w-xl text-xs leading-relaxed text-subtle sm:text-sm">
            Ideale per aziende che vogliono sostituire Excel, WhatsApp e processi manuali
            con un sistema unico.
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
    { n: "03", Icon: ShieldCheck, title: "Consulenza tecnologica",
      desc: "Ti aiutiamo a scegliere architettura, tecnologie e processi per costruire soluzioni scalabili, sicure e facili da mantenere." },
  ];
  return (
    <section id="servizi" className="border-t border-border py-28 lg:py-36">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 lg:grid-cols-[0.9fr_1.4fr] lg:px-10">
        <div>
          <SectionLabel>Servizi</SectionLabel>
          <h2 className="mt-6 text-4xl leading-[1.05] sm:text-5xl lg:text-[56px]">
            Tecnologia su misura.<br />
            Impatto <span className="text-accent italic">reale.</span>
          </h2>
          <p className="mt-6 max-w-md text-muted-foreground">
            Ogni soluzione è progettata attorno ai tuoi obiettivi di business,
            con attenzione precisa ai dettagli, alla scalabilità e alla qualità del codice.
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
                <h3 className="font-serif text-2xl text-foreground sm:text-3xl">{title}</h3>
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

/* ---------- Projects ---------- */
type ProjectCardProps = {
  title: string;
  category: string;
  desc: string;
  gradient: string;
  to: string;
};

function ProjectCard({ title, category, desc, gradient, to }: ProjectCardProps) {
  return (
    <Link
      to={to}
      className="group relative block overflow-hidden rounded-2xl border border-border transition-all hover:border-primary-glow/50 hover:shadow-[0_30px_80px_-20px_rgba(11,99,255,0.35)]"
    >
      <div className={`aspect-[4/5] w-full ${gradient} transition-transform duration-700 group-hover:scale-105`}>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 opacity-30 bg-grid" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-7">
        <div className="section-label !text-primary-glow">{category}</div>
        <h3 className="mt-2 font-serif text-3xl text-foreground sm:text-4xl">{title}</h3>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">{desc}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm text-foreground">
          Visualizza concept <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

function ProjectsSection() {
  return (
    <section id="progetti" className="border-t border-border py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.4fr]">
          <div>
            <SectionLabel>Case study selezionati</SectionLabel>
            <h2 className="mt-6 text-4xl leading-[1.05] sm:text-5xl lg:text-[56px]">
              Sistemi digitali<br />
              pensati per il <span className="text-accent italic">lavoro reale.</span>
            </h2>
            <p className="mt-6 max-w-md text-muted-foreground">
              Esempi di sistemi digitali progettati per mostrare il tipo di soluzioni
              che Tretnix può realizzare per aziende e team operativi.
            </p>
            <a href="#contatti" className="mt-8 inline-flex items-center gap-2 text-sm text-foreground hover:text-primary-glow transition-colors">
              Parliamo del tuo caso <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <ProjectCard
              title="FitZone"
              category="Fitness Management Platform"
              desc="Concept di piattaforma digitale per centri fitness e wellness con gestione utenti, programmi, community, messaggi e statistiche."
              gradient="bg-[radial-gradient(ellipse_at_top,#0B2A4A,#020814_70%),linear-gradient(135deg,#061326,#020814)]"
              to="/case-studies/fitzone"
            />
            <ProjectCard
              title="SupplyFlow"
              category="Supplier & Operations System"
              desc="Concept di web app mobile-first per gestire fornitori, prodotti, sessioni d'acquisto, quantità e storico operativo."
              gradient="bg-[radial-gradient(ellipse_at_bottom_right,#123055,#020814_70%),linear-gradient(135deg,#030B1A,#061326)]"
              to="/case-studies/supplyflow"
            />
          </div>
        </div>

        {/* strip */}
        <div className="mt-20 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-y border-border py-5 text-xs text-subtle">
          {["Gestionale palestra", "Sistema fornitori", "Dashboard finanziaria", "Gestionale ristorante", "CRM operativo"].map((s, i) => (
            <span key={s} className="flex items-center gap-6">
              {i > 0 && <span className="h-1 w-1 rounded-full bg-subtle/60" />}
              {s}
            </span>
          ))}
          <span className="flex items-center gap-6">
            <span className="h-1 w-1 rounded-full bg-subtle/60" />
            <a href="#contatti" className="text-muted-foreground hover:text-foreground transition-colors">E altri sistemi →</a>
          </span>
        </div>
      </div>
    </section>
  );
}

/* ---------- Perché serve ---------- */
function PercheServeSection() {
  const cards = [
    { Icon: ShieldAlert, t: "Riduci gli errori", d: "Centralizza dati e processi per evitare informazioni duplicate, dimenticate o difficili da trovare." },
    { Icon: Timer, t: "Risparmia tempo", d: "Automatizza attività ripetitive e semplifica il lavoro quotidiano del team." },
    { Icon: Gauge, t: "Controlla meglio", d: "Usa dashboard e report per avere una visione chiara di attività, clienti, ordini e risultati." },
  ];
  return (
    <section id="perche-serve" className="border-t border-border py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.4fr]">
          <div>
            <SectionLabel>Perché serve</SectionLabel>
            <h2 className="mt-6 text-4xl leading-[1.05] sm:text-5xl lg:text-[56px]">
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
              Tretnix trasforma questi flussi in software chiari, centralizzati e costruiti
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
              <h3 className="mt-5 font-serif text-2xl text-foreground">{t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Process ---------- */
function ProcessSection() {
  const steps = [
    { n: 1, t: "Ascoltiamo", d: "Analizziamo obiettivi, processi e sfide per definire la direzione migliore." },
    { n: 2, t: "Progettiamo", d: "Disegniamo soluzioni su misura con attenzione precisa a flussi, interfaccia ed esperienza utente." },
    { n: 3, t: "Sviluppiamo", d: "Realizziamo software con sviluppo controllato, revisioni continue e cicli iterativi." },
    { n: 4, t: "Consegniamo e supportiamo", d: "Rilasciamo, monitoriamo e restiamo al tuo fianco per far crescere la soluzione." },
  ];
  return (
    <section id="processo" className="border-t border-border py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl">
          <SectionLabel>Come lavoriamo</SectionLabel>
          <h2 className="mt-6 text-4xl leading-[1.05] sm:text-5xl lg:text-[56px]">
            Un processo chiaro.<br />
            Dalla visione al <span className="text-accent italic">risultato.</span>
          </h2>
        </div>
        <div className="relative mt-20">
          <div className="absolute left-6 top-6 hidden h-px w-[calc(100%-3rem)] bg-gradient-to-r from-transparent via-border-strong to-transparent lg:block" />
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-4 lg:gap-6">
            {steps.map((s) => (
              <div key={s.n} className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary-glow soft-glow">
                  <span className="font-serif text-lg">{s.n}</span>
                </div>
                <h3 className="mt-6 font-serif text-2xl text-foreground">{s.t}</h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Studio ---------- */
function StudioSection() {
  const values = [
    { t: "Precisione tecnica", d: "Ogni scelta viene progettata per creare sistemi ordinati, affidabili e mantenibili." },
    { t: "Focus sul business", d: "Partiamo sempre dai processi reali dell'azienda, non dalla tecnologia fine a sé stessa." },
    { t: "Sviluppo rapido", d: "Usiamo strumenti moderni e un processo AI-first per ridurre tempi e costi senza sacrificare la qualità." },
  ];
  return (
    <section id="studio" className="border-t border-border py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[0.9fr_1.4fr]">
          <div>
            <SectionLabel>Studio</SectionLabel>
            <h2 className="mt-6 text-4xl leading-[1.05] sm:text-5xl lg:text-[56px]">
              Piccolo studio.<br />
              Standard <span className="text-accent italic">elevati.</span>
            </h2>
          </div>
          <div>
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Tretnix nasce per aiutare aziende e attività operative a costruire strumenti digitali
              realmente utili, senza complessità inutili. Uniamo progettazione, sviluppo e tecnologie
              AI-first per trasformare processi manuali in software chiari, scalabili e facili da usare.
            </p>
            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {values.map((v) => (
                <div key={v.t} className="glass-card rounded-2xl p-6 transition-all hover:border-border-strong">
                  <div className="mb-4 h-8 w-8 rounded-md border border-primary/40 bg-primary/10" />
                  <h3 className="font-serif text-xl text-foreground">{v.t}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- CTA ---------- */
function CTASection() {
  const trust = [
    "Prima analisi gratuita",
    "Risposta entro 24 ore",
    "Soluzione pensata sul tuo processo reale",
  ];
  return (
    <section id="contatti" className="border-t border-border py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="glass-card relative overflow-hidden rounded-3xl p-10 lg:p-16 soft-glow">
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(11,99,255,0.35),transparent_70%)] blur-2xl" />
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_left,black,transparent_75%)]" />
          <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.2fr_1fr_auto]">
            <h2 className="text-4xl leading-[1.05] sm:text-5xl lg:text-[56px]">
              Costruiamo qualcosa<br />
              di <span className="text-accent italic">straordinario</span> insieme.
            </h2>
            <p className="text-muted-foreground lg:text-lg">
              Raccontaci la tua idea. Ti risponderemo entro 24 ore con una prima direzione concreta.
            </p>
            <a
              href="mailto:hello@tretnix.com?subject=Nuovo progetto Tretnix"
              className="btn-primary shrink-0"
            >
              Parliamo del tuo progetto <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <ul className="relative mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8 sm:gap-y-3">
            {trust.map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary-glow" strokeWidth={2.2} />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------- Page ---------- */
export default function TretnixLanding() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <PercheServeSection />
        <ProjectsSection />
        <ProcessSection />
        <StudioSection />
        <CTASection />
      </main>
      <Footer />
      <BackToTopButton />
    </div>
  );
}
