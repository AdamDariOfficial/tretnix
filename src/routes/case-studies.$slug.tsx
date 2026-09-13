import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Navbar, Footer, BackToTopButton, Breadcrumb } from "@/components/TretnixChrome";
import { StorageImage } from "@/components/StorageMedia";
import { ProjectGallery } from "@/components/ProjectGallery";
import { ProjectPortfolioCover } from "@/components/ProjectPortfolioCover";
import { ProjectVariantTimeline } from "@/components/ProjectVariantTimeline";
import { getProjectBySlug } from "@/lib/projects";
import { listProjectMedia } from "@/lib/project-media";
import { listPublishedProjectVariants } from "@/lib/project-variants";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/case-studies/$slug")({
  loader: async ({ params }) => {
    const project = await getProjectBySlug(params.slug);
    if (!project) throw notFound();

    const [variants, media] = await Promise.all([
      listPublishedProjectVariants(project.id),
      listProjectMedia(project.id),
    ]);

    return { project, variants, media };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Progetto non trovato — Tretnix" },
          { name: "robots", content: "noindex" },
        ],
      };
    }

    const { project } = loaderData;
    const canonicalUrl = `https://tretnix.com/case-studies/${encodeURIComponent(project.slug)}`;
    const socialImage = project.image_url?.startsWith("media:")
      ? `https://tretnix.com/api/tretnix/media/${encodeURIComponent(project.image_url.slice(6))}`
      : project.image_url;
    const pageTitle = project.is_concept
      ? `${project.title} — Concept Tretnix`
      : `${project.title} — Case study Tretnix`;

    return {
      meta: [
        { title: pageTitle },
        { name: "description", content: project.short_description },
        { property: "og:title", content: pageTitle },
        { property: "og:description", content: project.short_description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: canonicalUrl },
        { name: "twitter:title", content: pageTitle },
        { name: "twitter:description", content: project.short_description },
        ...(socialImage
          ? [
              { property: "og:image", content: socialImage },
              { name: "twitter:image", content: socialImage },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: canonicalUrl }],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex min-h-[70vh] items-center justify-center px-6 pt-40">
        <div className="text-center">
          <h1 className="font-serif text-4xl">Progetto non trovato</h1>
          <p className="mt-3 text-muted-foreground">
            Il progetto richiesto non esiste o è stato spostato.
          </p>
          <Link to="/case-studies" className="btn-primary mt-8">
            Vedi tutti i progetti
          </Link>
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
          <button type="button" onClick={reset} className="btn-primary mt-8">
            Riprova
          </button>
        </div>
      </main>
      <Footer />
    </div>
  ),
  component: CaseStudyPage,
});

function CaseStudyPage() {
  const { project, variants, media } = Route.useLoaderData();

  useEffect(() => {
    trackEvent("case_study_view", {
      path: `/case-studies/${project.slug}`,
      project_slug: project.slug,
    });
  }, [project.slug]);

  const includes = [...new Set([...project.modules, ...project.features])].slice(0, 12);

  function goToContact(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    trackEvent("cta_click", { project_slug: project.slug });
    if (typeof window !== "undefined") window.location.href = "/#contatti";
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
              { label: "Progetti", to: "/case-studies" },
              { label: project.title },
            ]}
          />

          <header className="mt-6">
            {(project.badge || project.is_concept) && (
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[0.7rem] uppercase tracking-[0.2em] text-primary-glow">
                {project.badge || "Concept Tretnix"}
              </span>
            )}
            <div className="mt-4 section-label !text-primary-glow">{project.category}</div>
            <h1 className="font-serif mt-3 text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-[64px]">
              {project.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
              {project.short_description}
            </p>
            {project.is_concept && (
              <p className="mt-5 max-w-2xl border-l border-primary/45 pl-4 text-sm leading-relaxed text-subtle">
                Progetto dimostrativo progettato e sviluppato da Tretnix. Non rappresenta un cliente
                o un&apos;attività reale e non attribuisce risultati commerciali non verificati.
              </p>
            )}
          </header>

          <div className={`relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-3xl border border-border ${project.gradient}`}>
            {project.image_url ? (
              <StorageImage
                src={project.image_url}
                alt={`Anteprima del progetto ${project.title}`}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <ProjectPortfolioCover title={project.title} category={project.category} />
            )}
          </div>

          {project.overview && (
            <section className="mt-16 max-w-3xl">
              <div className="section-label">{project.is_concept ? "Il concept" : "Il progetto"}</div>
              <h2 className="font-serif mt-4 text-3xl sm:text-4xl">
                Una soluzione costruita intorno al <span className="text-accent italic">contesto.</span>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
                {project.overview}
              </p>
            </section>
          )}

          <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-14">
            {project.problem && (
              <Block title={project.is_concept ? "L'esigenza esplorata" : "Il problema"}>
                {project.problem}
              </Block>
            )}
            {project.solution && <Block title="La direzione">{project.solution}</Block>}
          </div>

          <ProjectVariantTimeline variants={variants} />

          {includes.length > 0 && (
            <section className="mt-20">
              <h2 className="text-2xl font-medium sm:text-3xl">
                {project.is_concept ? "Cosa dimostra" : "Cosa include"}
              </h2>
              <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {includes.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 rounded-xl border border-border bg-white/[0.02] px-4 py-3 text-sm text-foreground"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-glow" strokeWidth={2.4} />
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {project.impact_points.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-medium sm:text-3xl">
                {project.is_concept ? "Principi del progetto" : "Impatto sul lavoro"}
              </h2>
              <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {project.impact_points.map((item) => (
                  <li
                    key={item}
                    className="border-l border-primary-glow/60 bg-white/[0.02] px-5 py-4 text-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {media.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-medium sm:text-3xl">Galleria</h2>
              <ProjectGallery items={media} projectTitle={project.title} />
            </section>
          )}

          <section className="mt-20">
            <div className="glass-card relative overflow-hidden rounded-3xl p-8 sm:p-10 lg:p-14 soft-glow">
              <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(11,99,255,0.35),transparent_70%)] blur-2xl" />
              <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.4fr_auto]">
                <div>
                  <h2 className="font-serif text-3xl leading-[1.05] sm:text-4xl">
                    Hai un&apos;attività con esigenze <span className="text-accent italic">simili?</span>
                  </h2>
                  <p className="mt-5 max-w-2xl text-muted-foreground lg:text-lg">
                    Non replichiamo il concept: partiamo dalla tua identità, dai contenuti e dal modo
                    in cui lavori per definire la soluzione adatta al tuo progetto.
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
      <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">{children}</p>
    </div>
  );
}
