export type CaseStudy = {
  slug: string;
  title: string;
  subtitle: string;
  overview: string;
  problem: string;
  solution: string;
  features: string[];
  impact: string[];
  gradient: string;
  seo: { title: string; description: string };
};

export const CASE_STUDIES: Record<string, CaseStudy> = {
  fitzone: {
    slug: "fitzone",
    title: "FitZone",
    subtitle: "Piattaforma gestionale per centri fitness e wellness.",
    overview:
      "FitZone è un concept di piattaforma digitale pensata per palestre, personal trainer e centri wellness che vogliono gestire utenti, programmi, comunicazioni e attività da un unico sistema.",
    problem:
      "Molte strutture fitness usano strumenti separati per schede di allenamento, messaggi, prenotazioni, pagamenti e comunicazioni con gli iscritti. Questo crea confusione, dati sparsi e difficoltà nel seguire ogni cliente in modo ordinato.",
    solution:
      "La piattaforma centralizza profili utenti, programmi di allenamento, messaggi, community, statistiche e attività, offrendo al team una visione più chiara e agli utenti un'esperienza digitale più semplice.",
    features: [
      "Gestione utenti e profili",
      "Programmi di allenamento",
      "Community interna",
      "Messaggi e comunicazioni",
      "Dashboard statistiche",
      "Area personale mobile-first",
    ],
    impact: [
      "Meno comunicazioni sparse",
      "Maggiore controllo sugli iscritti",
      "Esperienza più professionale per i clienti",
      "Gestione più ordinata del lavoro quotidiano",
    ],
    gradient:
      "bg-[radial-gradient(ellipse_at_top,#0B2A4A,#020814_70%),linear-gradient(135deg,#061326,#020814)]",
    seo: {
      title: "FitZone Case Study — Tretnix",
      description:
        "Concept di piattaforma gestionale per centri fitness e wellness, progettata da Tretnix per mostrare sistemi digitali su misura.",
    },
  },
  supplyflow: {
    slug: "supplyflow",
    title: "SupplyFlow",
    subtitle: "Sistema operativo per fornitori, prodotti e sessioni d'acquisto.",
    overview:
      "SupplyFlow è un concept di web app mobile-first progettata per attività che devono gestire acquisti, fornitori, prodotti, quantità e storico operativo in modo rapido e ordinato.",
    problem:
      "Molte attività gestiscono ordini e acquisti con liste cartacee, messaggi WhatsApp o fogli Excel. Questo può causare dimenticanze, quantità sbagliate, poca tracciabilità e difficoltà nel coordinare il team.",
    solution:
      "SupplyFlow permette di creare sessioni d'acquisto, selezionare fornitori, aggiornare quantità, consultare lo storico e mantenere tutto il processo centralizzato in una piattaforma accessibile da telefono.",
    features: [
      "Gestione fornitori",
      "Gestione prodotti",
      "Sessioni d'acquisto",
      "Storico quantità",
      "Ricerca e filtri",
      "Interfaccia mobile-first",
      "Ruoli operativi",
    ],
    impact: [
      "Meno errori negli acquisti",
      "Ordini più veloci",
      "Storico sempre consultabile",
      "Migliore coordinamento del team",
    ],
    gradient:
      "bg-[radial-gradient(ellipse_at_bottom_right,#123055,#020814_70%),linear-gradient(135deg,#030B1A,#061326)]",
    seo: {
      title: "SupplyFlow Case Study — Tretnix",
      description:
        "Concept di sistema operativo per fornitori, prodotti e sessioni d'acquisto, progettato da Tretnix per mostrare software gestionali su misura.",
    },
  },
  wealthcore: {
    slug: "wealthcore",
    title: "WealthCore",
    subtitle: "Dashboard avanzata per patrimonio, transazioni e obiettivi finanziari.",
    overview:
      "WealthCore è un concept di dashboard finanziaria progettata per monitorare conti, transazioni, investimenti, obiettivi e andamento patrimoniale in modo centralizzato.",
    problem:
      "Quando dati finanziari, conti, investimenti e obiettivi sono sparsi tra più strumenti, diventa difficile avere una visione chiara e aggiornata della situazione.",
    solution:
      "La dashboard centralizza dati, grafici, movimenti, conti e obiettivi, offrendo una panoramica ordinata e analisi più leggibili.",
    features: [
      "Dashboard patrimonio",
      "Gestione conti",
      "Transazioni",
      "Obiettivi finanziari",
      "Grafici e report",
      "Storico andamento",
      "Filtri e categorie",
    ],
    impact: [
      "Dati più chiari",
      "Meno confusione tra strumenti",
      "Monitoraggio più veloce",
      "Migliore visione d'insieme",
    ],
    gradient:
      "bg-[radial-gradient(ellipse_at_top_left,#0B2A4A,#020814_70%),linear-gradient(135deg,#061326,#030B1A)]",
    seo: {
      title: "WealthCore Case Study — Tretnix",
      description:
        "Concept di dashboard finanziaria avanzata, progettata da Tretnix per mostrare sistemi digitali basati su dati e report.",
    },
  },
};
