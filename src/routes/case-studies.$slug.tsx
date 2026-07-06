import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Navbar, Footer, BackToTopButton } from "@/components/TretnixChrome";
import { getProjectBySlug, type Project } from "@/lib/projects";
import { useSiteSettings, mailtoHref } from "@/lib/site-settings";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/case-studies/$slug")({
  loader: async ({ params }) => {
    const project = await getProjectBySlug(params.slug);
    if (!project) throw notFound();
    return { project };
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
    const { project } = loaderData;
    return {
      meta: [
        { title: `${project.title} Case Study — Tretnix` },
        { name: "description", content: project.short_description },
        { property: "og:title", content: `${project.title} Case Study — Tretnix` },
        { property: "og:description", content: project.short_description },
        { property: "og:type", content: "article" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex min-h-[70vh] items-center justify-center px-6 pt-40">
        <div className="text-center">
          <h1 className="font-serif text-4xl">Case study non trovato</h1>
          <p className="mt-3 text-muted-foreground">
            Il concept richiesto non esiste o è stato spostato.
          </p>
          <Link to="/case-studies" className="btn-primary mt-8">Vedi tutti i case study</Link>
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
  const { project } = Route.useLoaderData();
  const [p, setP] = useState<Project>(project);
  const s = useSiteSettings();

  useEffect(() => {
    trackEvent("case_study_view", { path: `/case-studies/${p.slug}`, project_slug: p.slug });
  }, [p.slug]);

  // Re-fetch client-side to pick up admin edits without SSR
  useEffect(() => {
    void getProjectBySlug(project.slug).then((fresh) => {
      if (fresh) setP(fresh);
    });
  }, [project.slug]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="relative overflow-hidden pt-36 pb-24 lg:pt-44">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
          <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(11,99,255,0.22),transparent_70%)] blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <Link
            to="/case-studies"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Torna ai case study
          </Link>

          <header className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-end">
            <div>
              {p.badge && (
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[0.7rem] uppercase tracking-[0.22em] text-primary-glow">
                  {p.badge}
                </span>
              )}
              <div className="mt-4 section-label !text-primary-glow">{p.category}</div>
              <h1 className="font-serif mt-3 text-5xl leading-[1.02] tracking-tight sm:text-6xl lg:text-[76px]">
                {p.title}
              </h1>
              <p className="mt-5 max-w-xl text-lg text-muted-foreground">{p.short_description}</p>
            </div>
            <div className={`relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border ${p.gradient}`}>
              {p.image_url ? (
                <img src={p.image_url} alt={p.title} className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <>
                  <div className="absolute inset-0 bg-grid opacity-30" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="section-label">{p.title}</div>
                    <div className="mt-1 font-serif text-2xl text-foreground">Concept visivo</div>
                  </div>
                </>
              )}
            </div>
          </header>

          <div className="mt-20 grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-12">
            <Block title="Panoramica">{p.overview}</Block>
            {p.audience && <Block title="Per chi è pensato">{p.audience}</Block>}
            <Block title="Il problema">{p.problem}</Block>
            <Block title="La soluzione">{p.solution}</Block>
          </div>

          {p.modules.length > 0 && (
            <List title="Moduli principali" items={p.modules} />
          )}

          {p.workflow_steps.length > 0 && (
            <section className="mt-20">
              <h2 className="text-2xl font-medium sm:text-3xl">Flusso operativo di esempio</h2>
              <ol className="mt-8 space-y-3">
                {p.workflow_steps.map((step, i) => (
                  <li key={step} className="glass-card flex items-start gap-4 rounded-2xl p-5">
                    <span className="font-serif text-lg text-primary-glow">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {p.customizations.length > 0 && (
            <List title="Cosa si può personalizzare" items={p.customizations} />
          )}

          {p.features.length > 0 && (
            <section className="mt-20">
              <h2 className="text-2xl font-medium sm:text-3xl">Funzionalità principali</h2>
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {p.features.map((f) => (
                  <div key={f} className="glass-card flex items-start gap-3 rounded-2xl p-5">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-primary/40 bg-primary/10 text-primary-glow">
                      <Check className="h-3.5 w-3.5" strokeWidth={2.4} />
                    </div>
                    <span className="text-sm text-foreground sm:text-base">{f}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {p.impact_points.length > 0 && (
            <section className="mt-20">
              <h2 className="text-2xl font-medium sm:text-3xl">Impatto sul lavoro</h2>
              <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {p.impact_points.map((i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 border-l border-primary-glow/60 bg-white/[0.02] px-5 py-4 text-foreground"
                  >
                    {i}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {p.tech_stack.length > 0 && (
            <section className="mt-20">
              <h2 className="text-2xl font-medium sm:text-3xl">Tecnologie e approccio</h2>
              <div className="mt-6 flex flex-wrap gap-2">
                {p.tech_stack.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border bg-white/[0.02] px-3 py-1.5 text-xs text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section className="mt-24">
            <div className="glass-card relative overflow-hidden rounded-3xl p-10 lg:p-14 soft-glow">
              <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(11,99,255,0.35),transparent_70%)] blur-2xl" />
              <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.4fr_auto]">
                <div>
                  <h2 className="font-serif text-3xl leading-[1.05] sm:text-4xl lg:text-[44px]">
                    Vuoi un sistema simile per la <span className="text-accent italic">tua azienda?</span>
                  </h2>
                  <p className="mt-5 max-w-2xl text-muted-foreground lg:text-lg">
                    Raccontaci il tuo processo. Ti aiuteremo a capire quale soluzione può semplificarlo.
                  </p>
                </div>
                <a
                  href={mailtoHref(s)}
                  onClick={() => trackEvent("cta_click", { project_slug: p.slug })}
                  className="btn-primary shrink-0"
                >
                  Parliamo del tuo progetto <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </section>

          <div className="mt-16 border-t border-border pt-8">
            <Link
              to="/case-studies"
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

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-2xl font-medium sm:text-3xl">{title}</h2>
      <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
        {children}
      </p>
    </div>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="mt-20">
      <h2 className="text-2xl font-medium sm:text-3xl">{title}</h2>
      <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((i) => (
          <li
            key={i}
            className="glass-card rounded-2xl px-5 py-4 text-sm text-foreground sm:text-base"
          >
            {i}
          </li>
        ))}
      </ul>
    </section>
  );
}
