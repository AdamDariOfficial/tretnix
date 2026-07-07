import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Navbar, Footer, BackToTopButton, Breadcrumb } from "@/components/TretnixChrome";
import { StorageImage, StorageVideo } from "@/components/StorageMedia";
import { getProjectBySlug, type Project } from "@/lib/projects";
import { listProjectMedia, type ProjectMedia } from "@/lib/project-media";
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
        ...(project.image_url
          ? [
              { property: "og:image", content: project.image_url },
              { name: "twitter:image", content: project.image_url },
            ]
          : []),
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
  const [media, setMedia] = useState<ProjectMedia[]>([]);

  useEffect(() => {
    trackEvent("case_study_view", { path: `/case-studies/${p.slug}`, project_slug: p.slug });
  }, [p.slug]);

  useEffect(() => {
    void getProjectBySlug(project.slug).then((fresh) => {
      if (fresh) {
        setP(fresh);
        void listProjectMedia(fresh.id).then(setMedia).catch(() => setMedia([]));
      }
    });
  }, [project.slug]);

  const includes = [...new Set([...p.modules, ...p.features])].slice(0, 12);

  function goToContact(e: React.MouseEvent) {
    e.preventDefault();
    trackEvent("cta_click", { project_slug: p.slug });
    // If on home already this scrolls; otherwise fall back to hash nav.
    if (typeof window !== "undefined") {
      window.location.href = "/#contatti";
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="relative overflow-hidden pt-32 pb-24 lg:pt-40">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
          <div className="absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(11,99,255,0.2),transparent_70%)] blur-3xl" />
        </div>

        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          <Breadcrumb
            items={[
              { label: "Home", to: "/" },
              { label: "Case study", to: "/case-studies" },
              { label: p.title },
            ]}
          />

          {/* Compact hero */}
          <header className="mt-6">
            {p.badge && (
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[0.7rem] uppercase tracking-[0.22em] text-primary-glow">
                {p.badge}
              </span>
            )}
            <div className="mt-4 section-label !text-primary-glow">{p.category}</div>
            <h1 className="font-serif mt-3 text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-[64px]">
              {p.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{p.short_description}</p>
          </header>

          {/* Main visual */}
          <div className={`relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-3xl border border-border ${p.gradient}`}>
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

          {/* Problem / Solution */}
          <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-14">
            {p.problem && <Block title="Il problema">{p.problem}</Block>}
            {p.solution && <Block title="La soluzione">{p.solution}</Block>}
          </div>

          {/* Cosa include */}
          {includes.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-medium sm:text-3xl">Cosa include</h2>
              <ul className="mt-6 flex flex-wrap gap-2">
                {includes.map((f) => (
                  <li
                    key={f}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.03] px-3.5 py-1.5 text-sm text-foreground"
                  >
                    <Check className="h-3.5 w-3.5 text-primary-glow" strokeWidth={2.4} />
                    {f}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Impatto */}
          {p.impact_points.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-medium sm:text-3xl">Impatto sul lavoro</h2>
              <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
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

          {/* Galleria */}
          {media.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-medium sm:text-3xl">Galleria</h2>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {media.map((m) => (
                  <figure
                    key={m.id}
                    className="group overflow-hidden rounded-2xl border border-border bg-white/[0.02]"
                  >
                    {m.type === "video" ? (
                      <video
                        src={m.url}
                        controls
                        className="aspect-video w-full object-cover"
                        aria-label={m.alt_text ?? m.caption ?? "Video del progetto"}
                      />
                    ) : (
                      <img
                        src={m.url}
                        alt={m.alt_text ?? m.caption ?? p.title}
                        className="aspect-video w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                        loading="lazy"
                      />
                    )}
                    {m.caption && (
                      <figcaption className="border-t border-border px-4 py-2.5 text-xs text-subtle">
                        {m.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </section>
          )}

          {/* Final CTA */}
          <section className="mt-20">
            <div className="glass-card relative overflow-hidden rounded-3xl p-8 sm:p-10 lg:p-14 soft-glow">
              <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(11,99,255,0.35),transparent_70%)] blur-2xl" />
              <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.4fr_auto]">
                <div>
                  <h2 className="font-serif text-3xl leading-[1.05] sm:text-4xl">
                    Vuoi un sistema simile per la <span className="text-accent italic">tua azienda?</span>
                  </h2>
                  <p className="mt-5 max-w-2xl text-muted-foreground lg:text-lg">
                    Raccontaci il tuo processo. Ti aiuteremo a capire quale prima versione può semplificarlo.
                  </p>
                </div>
                <a href="/#contatti" onClick={goToContact} className="btn-primary shrink-0 group">
                  Parliamo del tuo progetto
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
                </a>
              </div>
            </div>
          </section>
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
      <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
        {children}
      </p>
    </div>
  );
}
