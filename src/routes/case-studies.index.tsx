import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { Navbar, Footer, BackToTopButton, Breadcrumb } from "@/components/TretnixChrome";
import { StorageImage } from "@/components/StorageMedia";
import { listVisibleProjects, type Project } from "@/lib/projects";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/case-studies/")({
  head: () => ({
    meta: [
      { title: "Case study e concept — Tretnix" },
      {
        name: "description",
        content:
          "Raccolta di concept e sistemi digitali progettati da Tretnix per mostrare software gestionali, dashboard e automazioni su misura.",
      },
      { property: "og:title", content: "Case study e concept — Tretnix" },
      {
        property: "og:description",
        content:
          "Raccolta di concept e sistemi digitali progettati da Tretnix per mostrare software gestionali, dashboard e automazioni su misura.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: CaseStudiesIndex,
});

const FILTERS = ["Tutti", "Gestionale", "Dashboard", "Operations", "CRM", "Finance", "Fitness"];

function categoryMatches(cat: string, filter: string): boolean {
  if (filter === "Tutti") return true;
  return cat.toLowerCase().includes(filter.toLowerCase());
}

function CaseStudiesIndex() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Tutti");
  const [q, setQ] = useState("");

  useEffect(() => {
    trackEvent("page_view", { path: "/case-studies" });
    void listVisibleProjects().then((p) => {
      setProjects(p);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    const lower = q.trim().toLowerCase();
    return projects.filter((p) => {
      if (!categoryMatches(p.category, filter)) return false;
      if (!lower) return true;
      return (
        p.title.toLowerCase().includes(lower) ||
        p.short_description.toLowerCase().includes(lower) ||
        p.category.toLowerCase().includes(lower)
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
          <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Case study" }]} />
          <header className="mt-6 max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-primary-glow/60" />
              <span className="section-label">Case study</span>
            </div>
            <h1 className="font-serif mt-6 text-5xl leading-[1.02] sm:text-6xl lg:text-[72px]">
              Case study e <span className="text-accent italic">concept.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              Una raccolta di sistemi digitali progettati per mostrare come Tretnix può
              trasformare processi reali in software su misura.
            </p>
          </header>

          {/* Filters + search */}
          <div className="mt-12 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => {
                const active = f === filter;
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    aria-pressed={active}
                    className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                      active
                        ? "border-primary-glow/70 bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:text-foreground hover:border-border-strong"
                    }`}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
            <label className="glass-panel relative flex items-center gap-2 rounded-full px-4 py-2 text-sm lg:w-72">
              <Search className="h-4 w-4 text-subtle" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cerca un concept…"
                className="w-full bg-transparent text-sm text-foreground placeholder:text-subtle focus:outline-none"
                aria-label="Cerca case study"
              />
            </label>
          </div>

          {/* Grid */}
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading &&
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] rounded-2xl border border-border bg-white/[0.02]" />
              ))}
            {!loading &&
              filtered.map((p) => (
                <Link
                  key={p.id}
                  to="/case-studies/$slug"
                  params={{ slug: p.slug }}
                  onClick={() => trackEvent("project_card_click", { project_slug: p.slug })}
                  className="group relative block overflow-hidden rounded-2xl border border-border transition-all hover:border-primary-glow/50 hover:shadow-[0_30px_80px_-20px_rgba(11,99,255,0.35)]"
                >
                  <div className={`aspect-[4/5] w-full ${p.gradient} transition-transform duration-700 group-hover:scale-105`}>
                    {p.image_url && (
                      <StorageImage src={p.image_url} alt={p.title} className="absolute inset-0 h-full w-full object-cover opacity-60" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                    <div className="absolute inset-0 opacity-30 bg-grid" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    {p.badge && (
                      <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 text-[0.65rem] uppercase tracking-[0.2em] text-primary-glow">
                        {p.badge}
                      </span>
                    )}
                    <div className="section-label mt-3 !text-primary-glow">{p.category}</div>
                    <h3 className="font-serif mt-1.5 text-2xl text-foreground sm:text-3xl">{p.title}</h3>
                    <p className="mt-3 max-w-md text-sm text-muted-foreground line-clamp-3">
                      {p.short_description}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm text-foreground">
                      Visualizza concept <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            {!loading && filtered.length === 0 && (
              <div className="col-span-full py-16 text-center text-muted-foreground">
                Nessun concept trovato per questa selezione.
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
