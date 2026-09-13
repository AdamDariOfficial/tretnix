import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { Navbar, Footer, BackToTopButton, Breadcrumb } from "@/components/TretnixChrome";
import { StorageImage } from "@/components/StorageMedia";
import { ProjectPortfolioCover } from "@/components/ProjectPortfolioCover";
import { listVisibleProjects, type Project } from "@/lib/projects";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/case-studies/")({
  head: () => ({
    meta: [
      { title: "Progetti e concept — Tretnix" },
      {
        name: "description",
        content:
          "Una selezione di progetti e concept digitali Tretnix: siti, sistemi e percorsi progettati per mostrare come una soluzione può adattarsi a esigenze reali.",
      },
      { property: "og:title", content: "Progetti e concept — Tretnix" },
      {
        property: "og:description",
        content:
          "Una selezione di progetti e concept digitali Tretnix, con scope e natura del lavoro indicati in modo trasparente.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://tretnix.com/case-studies" },
      { name: "twitter:title", content: "Progetti e concept — Tretnix" },
      {
        name: "twitter:description",
        content:
          "Una selezione di progetti e concept digitali Tretnix, con scope e natura del lavoro indicati in modo trasparente.",
      },
    ],
    links: [{ rel: "canonical", href: "https://tretnix.com/case-studies" }],
  }),
  component: CaseStudiesIndex,
});

function categoryMatches(category: string, filter: string): boolean {
  return filter === "Tutti" || category === filter;
}

function CaseStudiesIndex() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [filter, setFilter] = useState("Tutti");
  const [q, setQ] = useState("");

  useEffect(() => {
    let cancelled = false;
    trackEvent("page_view", { path: "/case-studies" });

    void listVisibleProjects()
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

  const filters = useMemo(
    () => ["Tutti", ...Array.from(new Set(projects.map((project) => project.category))).filter(Boolean)],
    [projects],
  );

  useEffect(() => {
    if (!filters.includes(filter)) setFilter("Tutti");
  }, [filter, filters]);

  const filtered = useMemo(() => {
    const lower = q.trim().toLowerCase();
    return projects.filter((project) => {
      if (!categoryMatches(project.category, filter)) return false;
      if (!lower) return true;
      return (
        project.title.toLowerCase().includes(lower) ||
        project.short_description.toLowerCase().includes(lower) ||
        project.category.toLowerCase().includes(lower)
      );
    });
  }, [projects, filter, q]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="relative overflow-hidden pt-36 pb-24 lg:pt-44">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
          <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(11,99,255,0.22),transparent_70%)] blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Progetti" }]} />
          <header className="mt-6 max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-primary-glow/60" />
              <span className="section-label">Progetti</span>
            </div>
            <h1 className="font-serif mt-6 text-5xl leading-[1.02] sm:text-6xl lg:text-[72px]">
              Lavori, sistemi e <span className="text-accent italic">concept.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              Una raccolta di soluzioni progettate da Tretnix. Quando un progetto è dimostrativo,
              lo indichiamo esplicitamente: il portfolio mostra ciò che è stato progettato, senza
              inventare clienti o risultati.
            </p>
          </header>

          <div className="mt-12 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2" aria-label="Filtra progetti per categoria">
              {filters.map((value) => {
                const active = value === filter;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFilter(value)}
                    aria-pressed={active}
                    className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                      active
                        ? "border-primary-glow/70 bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground"
                    }`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
            <label className="glass-panel relative flex items-center gap-2 rounded-full px-4 py-2 text-sm lg:w-72">
              <Search className="h-4 w-4 text-subtle" />
              <input
                type="search"
                value={q}
                onChange={(event) => setQ(event.target.value)}
                placeholder="Cerca un progetto…"
                className="w-full bg-transparent text-sm text-foreground placeholder:text-subtle focus:outline-none"
                aria-label="Cerca progetti"
              />
            </label>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading &&
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="aspect-[4/5] rounded-2xl border border-border bg-white/[0.02]" />
              ))}

            {!loading && loadFailed && (
              <div
                role="status"
                className="glass-card col-span-full rounded-2xl p-10 text-center text-muted-foreground"
              >
                I progetti non sono disponibili in questo momento. Riprova più tardi.
              </div>
            )}

            {!loading &&
              !loadFailed &&
              filtered.map((project) => (
                <Link
                  key={project.id}
                  to="/case-studies/$slug"
                  params={{ slug: project.slug }}
                  onClick={() => trackEvent("project_card_click", { project_slug: project.slug })}
                  className="group relative block overflow-hidden rounded-2xl border border-border transition-all duration-200 ease-out hover:-translate-y-1 hover:border-primary-glow/60 hover:shadow-[0_30px_80px_-20px_rgba(11,99,255,0.35)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <div className={`relative aspect-[4/5] w-full ${project.gradient}`}>
                    {project.image_url ? (
                      <StorageImage
                        src={project.image_url}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover opacity-70"
                      />
                    ) : (
                      <ProjectPortfolioCover
                        title={project.title}
                        category={project.category}
                        compact
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-transparent" />
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-6">
                    {(project.badge || project.is_concept) && (
                      <span className="inline-flex items-center rounded-full border border-primary/40 bg-background/65 px-2.5 py-0.5 text-[0.65rem] uppercase tracking-[0.18em] text-primary-glow backdrop-blur-md">
                        {project.badge || "Concept Tretnix"}
                      </span>
                    )}
                    <div className="section-label mt-3 !text-primary-glow">{project.category}</div>
                    <h2 className="font-serif mt-1.5 text-2xl text-foreground sm:text-3xl">
                      {project.title}
                    </h2>
                    <p className="mt-3 max-w-md text-sm text-muted-foreground line-clamp-3">
                      {project.short_description}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm text-foreground">
                      {project.is_concept ? "Esplora il concept" : "Leggi il case study"}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                    </span>
                  </div>
                </Link>
              ))}

            {!loading && !loadFailed && filtered.length === 0 && (
              <div className="col-span-full py-16 text-center text-muted-foreground">
                Nessun progetto trovato per questa selezione.
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <BackToTopButton />
    </div>
  );
}
