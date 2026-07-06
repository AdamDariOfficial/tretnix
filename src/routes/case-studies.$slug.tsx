import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Navbar, Footer, BackToTopButton } from "@/components/TretnixChrome";
import { CASE_STUDIES, type CaseStudy } from "@/lib/case-studies";

export const Route = createFileRoute("/case-studies/$slug")({
  loader: ({ params }) => {
    const study = CASE_STUDIES[params.slug];
    if (!study) throw notFound();
    return { study };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Case study non trovato — Tretnix" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { study } = loaderData;
    const url = `https://tretnix.lovable.app/case-studies/${study.slug}`;
    return {
      meta: [
        { title: study.seo.title },
        { name: "description", content: study.seo.description },
        { property: "og:title", content: study.seo.title },
        { property: "og:description", content: study.seo.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex min-h-[70vh] items-center justify-center px-6 pt-40">
        <div className="text-center">
          <h1 className="text-4xl">Case study non trovato</h1>
          <p className="mt-3 text-muted-foreground">
            Il concept richiesto non esiste o è stato spostato.
          </p>
          <Link to="/" className="btn-primary mt-8">Torna alla homepage</Link>
        </div>
      </main>
      <Footer />
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex min-h-[70vh] items-center justify-center px-6 pt-40">
        <div className="text-center">
          <h1 className="text-3xl">Errore di caricamento</h1>
          <button onClick={reset} className="btn-primary mt-8">Riprova</button>
        </div>
      </main>
      <Footer />
    </div>
  ),
  component: CaseStudyPage,
});

function CaseStudyPage() {
  const { study } = Route.useLoaderData();
  return <CaseStudyView study={study} />;
}

function CaseStudyView({ study }: { study: CaseStudy }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="relative overflow-hidden pt-36 pb-24 lg:pt-44">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
          <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(11,99,255,0.22),transparent_70%)] blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          {/* Back link */}
          <Link
            to="/"
            hash="progetti"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Torna ai case study
          </Link>

          {/* Header */}
          <header className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[0.7rem] uppercase tracking-[0.22em] text-primary-glow">
                Concept interno / Demo portfolio
              </span>
              <h1 className="mt-6 text-5xl leading-[1.02] tracking-tight sm:text-6xl lg:text-[76px]">
                {study.title}
              </h1>
              <p className="mt-5 max-w-xl text-lg text-muted-foreground">
                {study.subtitle}
              </p>
            </div>
            <div
              className={`relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border ${study.gradient}`}
            >
              <div className="absolute inset-0 bg-grid opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="section-label">{study.title}</div>
                <div className="mt-1 font-serif text-2xl text-foreground">Concept visivo</div>
              </div>
            </div>
          </header>

          {/* Content grid */}
          <div className="mt-20 grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-12">
            <Block title="Panoramica">{study.overview}</Block>
            <Block title="Il problema">{study.problem}</Block>
            <Block title="La soluzione" className="lg:col-span-2">
              {study.solution}
            </Block>
          </div>

          {/* Features */}
          <section className="mt-20">
            <h2 className="font-serif text-3xl sm:text-4xl">Funzionalità principali</h2>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {study.features.map((f) => (
                <div
                  key={f}
                  className="glass-card flex items-start gap-3 rounded-2xl p-5"
                >
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-primary/40 bg-primary/10 text-primary-glow">
                    <Check className="h-3.5 w-3.5" strokeWidth={2.4} />
                  </div>
                  <span className="text-sm text-foreground sm:text-base">{f}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Impact */}
          <section className="mt-20">
            <h2 className="font-serif text-3xl sm:text-4xl">Impatto sul lavoro</h2>
            <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {study.impact.map((i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 border-l border-primary-glow/60 bg-white/[0.02] px-5 py-4 text-muted-foreground"
                >
                  <span className="text-foreground">{i}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* CTA */}
          <section className="mt-24">
            <div className="glass-card relative overflow-hidden rounded-3xl p-10 lg:p-14 soft-glow">
              <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(11,99,255,0.35),transparent_70%)] blur-2xl" />
              <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.4fr_auto]">
                <div>
                  <h2 className="text-3xl leading-[1.05] sm:text-4xl lg:text-[44px]">
                    Vuoi un sistema simile per la <span className="text-accent italic">tua azienda?</span>
                  </h2>
                  <p className="mt-5 max-w-2xl text-muted-foreground lg:text-lg">
                    Raccontaci il tuo processo. Ti aiuteremo a capire quale soluzione può semplificarlo.
                  </p>
                </div>
                <a
                  href="mailto:hello@tretnix.com?subject=Nuovo progetto Tretnix"
                  className="btn-primary shrink-0"
                >
                  Parliamo del tuo progetto <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </section>

          <div className="mt-16 border-t border-border pt-8">
            <Link
              to="/"
              hash="progetti"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Torna ai case study
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <BackToTopButton />
    </div>
  );
}

function Block({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <h2 className="font-serif text-3xl sm:text-4xl">{title}</h2>
      <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
        {children}
      </p>
    </div>
  );
}
