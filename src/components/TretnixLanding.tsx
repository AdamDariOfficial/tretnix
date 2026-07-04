import { useEffect, useState } from "react";
import {
  ArrowRight, ArrowDown, ArrowUp, Menu, X, Search, Bell,
  LayoutDashboard, BarChart3, ListChecks, Users, ShoppingBag,
  Package, UsersRound, Settings, Boxes, Layers, ShieldCheck,
  Home, PieChart, Activity, User, ShieldAlert, Timer, Gauge,
} from "lucide-react";
import { TretnixLogo } from "./TretnixLogo";

const NAV = [
  { href: "#servizi", label: "Servizi" },
  { href: "#perche-serve", label: "Perché serve" },
  { href: "#progetti", label: "Case study" },
  { href: "#processo", label: "Processo" },
  { href: "#studio", label: "Studio" },
  { href: "#contatti", label: "Contatti" },
];

/* ---------- Navbar ---------- */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
        <nav
          className={`glass-panel flex h-[62px] w-full max-w-5xl items-center justify-between rounded-full pl-5 pr-2 transition-all duration-300 ${
            scrolled ? "soft-glow" : ""
          }`}
        >
          <a href="#top" className="flex items-center">
            <TretnixLogo variant="horizontal" className="h-8" />
          </a>
          <ul className="hidden items-center gap-1 md:flex">
            {NAV.map((n) => (
              <li key={n.href}>
                <a
                  href={n.href}
                  className="group relative rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {n.label}
                  <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary-glow opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <a href="#contatti" className="btn-primary hidden md:inline-flex !py-2 !px-4 text-sm">
              Parliamo del tuo progetto <ArrowRight className="h-4 w-4" />
            </a>
            <button
              className="glass-panel flex h-11 w-11 items-center justify-center rounded-full md:hidden"
              onClick={() => setOpen(true)}
              aria-label="Apri menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl md:hidden">
          <div className="flex items-center justify-between p-6">
            <TretnixLogo variant="horizontal" className="h-7" />
            <button
              className="glass-panel flex h-11 w-11 items-center justify-center rounded-full"
              onClick={() => setOpen(false)}
              aria-label="Chiudi menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <ul className="flex flex-col gap-2 px-6 pt-8">
            {NAV.map((n) => (
              <li key={n.href}>
                <a
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-border py-4 font-serif text-3xl"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="p-6">
            <a href="#contatti" onClick={() => setOpen(false)} className="btn-primary w-full justify-center">
              Parliamo del tuo progetto <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------- Section Label ---------- */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-8 bg-primary-glow/60" />
      <span className="section-label">{children}</span>
    </div>
  );
}

/* ---------- Dashboard Mockup ---------- */
function DashboardMockup() {
  return (
    <div className="relative">
      {/* glow */}
      <div className="absolute -inset-10 -z-10 rounded-[3rem] bg-[radial-gradient(ellipse_at_center,rgba(11,99,255,0.35),transparent_60%)] blur-2xl animate-pulse-glow" />

      {/* laptop */}
      <div className="glass-panel relative overflow-hidden rounded-2xl border-border-strong shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <div className="ml-4 flex flex-1 items-center gap-2 rounded-md border border-border bg-white/[0.02] px-2.5 py-1 text-[10px] text-subtle">
            <Search className="h-3 w-3" />
            Cerca nel sistema...
          </div>
          <div className="ml-2 flex items-center gap-2">
            <Bell className="h-3.5 w-3.5 text-subtle" />
            <div className="h-5 w-5 rounded-full bg-gradient-to-br from-primary-glow to-primary" />
          </div>
        </div>

        <div className="grid grid-cols-[130px_1fr] gap-0 bg-bg-deep">
          {/* sidebar */}
          <aside className="border-r border-border p-3 text-[11px] text-muted-foreground">
            <div className="mb-4 flex items-center gap-2">
              <TretnixLogo variant="icon" className="h-5 w-5" />
              <span className="font-serif text-sm text-foreground">Tretnix</span>
            </div>
            <ul className="space-y-1.5">
              {[
                [LayoutDashboard, "Dashboard", true],
                [BarChart3, "Panoramica", false],
                [PieChart, "Report", false],
                [ListChecks, "Attività", false],
                [Users, "Clienti", false],
                [ShoppingBag, "Ordini", false],
                [Package, "Prodotti", false],
                [UsersRound, "Team", false],
                [Settings, "Impostazioni", false],
              ].map(([Icon, label, active]: any) => (
                <li
                  key={label}
                  className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${
                    active ? "bg-primary/15 text-foreground" : "hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  {label}
                </li>
              ))}
            </ul>
          </aside>

          {/* main */}
          <main className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="section-label !text-[9px]">Panoramica</div>
                <h4 className="font-serif text-base text-foreground">Buongiorno, Marco</h4>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                ["€ 1.250.000", "Fatturato", "+12,4%"],
                ["320", "Nuovi clienti", "+8,7%"],
                ["98,2%", "SLA", "+2,1%"],
              ].map(([v, l, d]) => (
                <div key={l} className="rounded-lg border border-border bg-white/[0.02] p-2.5">
                  <div className="text-[13px] font-medium text-foreground">{v}</div>
                  <div className="text-[9px] text-subtle">{l}</div>
                  <div className="mt-1 text-[9px] text-primary-glow">{d} vs mese prec.</div>
                </div>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-[1.6fr_1fr] gap-2">
              <div className="rounded-lg border border-border bg-white/[0.02] p-3">
                <div className="mb-2 flex items-center justify-between text-[10px]">
                  <span className="text-foreground">Andamento fatturato</span>
                  <span className="text-subtle">12 mesi</span>
                </div>
                <svg viewBox="0 0 200 70" className="h-16 w-full">
                  <defs>
                    <linearGradient id="ch" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0" stopColor="#1E7BFF" stopOpacity="0.4" />
                      <stop offset="1" stopColor="#1E7BFF" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[10, 30, 50, 70, 90, 110, 130, 150, 170, 190].map((x, i) => (
                    <rect key={i} x={x - 4} y={40 + (i % 3) * 6} width="3" height={30 - (i % 3) * 6} fill="rgba(255,255,255,0.08)" />
                  ))}
                  <path
                    d="M0,55 L20,48 L40,50 L60,38 L80,42 L100,30 L120,32 L140,22 L160,25 L180,15 L200,18"
                    fill="none"
                    stroke="#1E7BFF"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M0,55 L20,48 L40,50 L60,38 L80,42 L100,30 L120,32 L140,22 L160,25 L180,15 L200,18 L200,70 L0,70 Z"
                    fill="url(#ch)"
                  />
                </svg>
              </div>
              <div className="rounded-lg border border-border bg-white/[0.02] p-3">
                <div className="mb-2 text-[10px] text-foreground">Attività recenti</div>
                <ul className="space-y-1.5 text-[9px] text-muted-foreground">
                  <li className="flex gap-1.5"><span className="mt-1 h-1 w-1 rounded-full bg-primary-glow" />Nuovo cliente aggiunto</li>
                  <li className="flex gap-1.5"><span className="mt-1 h-1 w-1 rounded-full bg-primary-glow" />Ordine completato</li>
                  <li className="flex gap-1.5"><span className="mt-1 h-1 w-1 rounded-full bg-primary-glow" />Report generato</li>
                  <li className="flex gap-1.5"><span className="mt-1 h-1 w-1 rounded-full bg-primary-glow" />Team aggiornamento</li>
                </ul>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* phone */}
      <div className="absolute -bottom-10 -left-12 hidden w-[180px] rotate-[-6deg] sm:block animate-float-slow">
        <div className="glass-panel overflow-hidden rounded-[26px] border-border-strong p-2 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]">
          <div className="rounded-[20px] bg-bg-deep p-3">
            <div className="flex items-center justify-between text-[9px] text-subtle">
              <span>9:41</span>
              <div className="flex gap-1"><span>●</span><span>●●</span></div>
            </div>
            <div className="mt-3">
              <div className="text-[10px] text-subtle">Panoramica</div>
              <div className="font-serif text-sm text-foreground">Ciao, Anna</div>
            </div>
            <div className="mt-3 rounded-lg border border-border bg-white/[0.02] p-2.5">
              <div className="text-[13px] text-foreground">€ 128k</div>
              <div className="text-[9px] text-subtle">Fatturato mese</div>
            </div>
            <div className="mt-2 flex justify-center">
              <svg viewBox="0 0 60 60" className="h-16 w-16">
                <circle cx="30" cy="30" r="24" stroke="rgba(255,255,255,0.08)" strokeWidth="5" fill="none" />
                <circle cx="30" cy="30" r="24" stroke="#1E7BFF" strokeWidth="5" fill="none"
                  strokeDasharray="150" strokeDashoffset="40" strokeLinecap="round" transform="rotate(-90 30 30)" />
                <text x="30" y="34" textAnchor="middle" fontSize="10" fill="#F5F7FA">73%</text>
              </svg>
            </div>
            <div className="mt-2 space-y-1 text-[9px] text-muted-foreground">
              <div className="flex justify-between"><span>Nuovo ordine</span><span>2m</span></div>
              <div className="flex justify-between"><span>Report pronto</span><span>1h</span></div>
            </div>
            <div className="mt-3 flex justify-around border-t border-border pt-2 text-subtle">
              <Home className="h-3 w-3" />
              <BarChart3 className="h-3 w-3" />
              <Activity className="h-3 w-3" />
              <User className="h-3 w-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Hero ---------- */
function HeroSection() {
  return (
    <section id="top" className="relative overflow-hidden pt-40 pb-24 lg:pt-44 lg:pb-32">
      {/* bg */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(11,99,255,0.25),transparent_70%)] blur-3xl" />
        <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(30,123,255,0.18),transparent_70%)] blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:px-10">
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
          <div className="mt-16 flex items-center gap-3 text-subtle">
            <ArrowDown className="h-4 w-4 animate-bounce-y" />
            <span className="section-label !text-subtle">Scorri per esplorare</span>
          </div>
        </div>

        <div className="relative mt-8 lg:mt-0">
          <DashboardMockup />
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
            con attenzione maniacale ai dettagli, alla scalabilità e alla qualità del codice.
          </p>
        </div>
        <div className="border-t border-border">
          {services.map(({ n, Icon, title, desc }) => (
            <div
              key={n}
              className="group grid grid-cols-[auto_1fr_auto] items-start gap-6 border-b border-border py-8 transition-colors hover:bg-white/[0.015]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border-strong bg-white/[0.02] text-primary-glow transition-colors group-hover:border-primary-glow/60">
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
function ProjectCard({
  title, category, desc, gradient,
}: { title: string; category: string; desc: string; gradient: string }) {
  return (
    <a href="#contatti" className="group relative block overflow-hidden rounded-2xl border border-border transition-all hover:border-primary-glow/50 hover:shadow-[0_30px_80px_-20px_rgba(11,99,255,0.35)]">
      <div className={`aspect-[4/5] w-full ${gradient} transition-transform duration-700 group-hover:scale-105`}>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 opacity-30 bg-grid" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-7">
        <div className="section-label !text-primary-glow">{category}</div>
        <h3 className="mt-2 font-serif text-3xl text-foreground sm:text-4xl">{title}</h3>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">{desc}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm text-foreground">
          Scopri il progetto <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </a>
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
              desc="Concept di piattaforma digitale per centri fitness e wellness con gestione utenti, programmi di allenamento, community, messaggi, statistiche e area personale."
              gradient="bg-[radial-gradient(ellipse_at_top,#0B2A4A,#020814_70%),linear-gradient(135deg,#061326,#020814)]"
            />
            <ProjectCard
              title="SupplyFlow"
              category="Supplier & Operations System"
              desc="Concept di web app mobile-first per gestire fornitori, prodotti, sessioni d'acquisto, quantità, storico operativo e flussi interni da un'unica piattaforma."
              gradient="bg-[radial-gradient(ellipse_at_bottom_right,#123055,#020814_70%),linear-gradient(135deg,#030B1A,#061326)]"
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
              className="glass-panel group rounded-2xl p-7 transition-all duration-300 hover:border-primary-glow/50 hover:shadow-[0_20px_60px_-20px_rgba(11,99,255,0.4)]"
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
    { n: 3, t: "Sviluppiamo", d: "Realizziamo software di qualità con codice pulito, test rigorosi e cicli iterativi." },
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
                <div key={v.t} className="glass-panel rounded-2xl p-6 transition-all hover:border-border-strong">
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
  return (
    <section id="contatti" className="border-t border-border py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="glass-panel relative overflow-hidden rounded-3xl p-10 lg:p-16 soft-glow">
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
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer className="pb-10 pt-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="border-t border-white/10 pt-10">
          <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <TretnixLogo variant="horizontal" className="h-8" />
              <p className="mt-5 max-w-xs text-sm text-muted-foreground">
                Software su misura per aziende che vogliono lavorare meglio.
              </p>
            </div>
            <div className="flex flex-col gap-1.5 text-sm text-muted-foreground sm:text-right">
              <a href="tel:+390490000000" className="hover:text-foreground transition-colors">
                +39 049 000 0000
              </a>
              <a href="mailto:hello@tretnix.com" className="hover:text-primary-glow transition-colors">
                hello@tretnix.com
              </a>
              <span className="text-subtle">Padova, Italia</span>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-start justify-between gap-3 text-xs text-subtle sm:flex-row sm:items-center">
            <span>© 2026 Tretnix Studio</span>
            <div className="flex gap-5">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Cookie</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Back to top ---------- */
function BackToTopButton() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Torna in cima"
      className="glass-panel fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full text-foreground soft-glow hover:border-primary-glow/60"
    >
      <ArrowUp className="h-4 w-4" />
    </button>
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
