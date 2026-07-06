import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Navbar, Footer, BackToTopButton, Breadcrumb } from "./TretnixChrome";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _keep = { Link, ArrowLeft };

type Props = {
  title: string;
  subtitle: string;
  intro: string;
  lastUpdated?: string;
  children: React.ReactNode;
};

export function LegalPageLayout({
  title,
  subtitle,
  intro,
  lastUpdated = "Luglio 2026",
  children,
}: Props) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="relative overflow-hidden pt-36 pb-24 lg:pt-44">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(11,99,255,0.18),transparent_70%)] blur-3xl" />
        </div>

        <div className="mx-auto w-full max-w-[850px] px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Home", to: "/" }, { label: title }]} />

          <header className="mt-6 border-b border-border pb-10">
            <h1 className="text-4xl leading-[1.05] sm:text-5xl lg:text-[56px]">{title}</h1>
            <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
              {subtitle}
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.22em] text-subtle">
              Ultimo aggiornamento: {lastUpdated}
            </p>
          </header>

          <div className="glass-card mt-10 rounded-2xl p-5 text-sm leading-relaxed text-muted-foreground sm:p-6">
            {intro}
          </div>

          <article className="prose-legal mt-12 space-y-10">{children}</article>

          <div className="mt-16 border-t border-border pt-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Torna alla homepage
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <BackToTopButton />
    </div>
  );
}

export function LegalSection({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-baseline gap-4">
        <span className="font-serif text-lg text-primary-glow">{String(n).padStart(2, "0")}</span>
        <h2 className="font-serif text-2xl text-foreground sm:text-3xl">{title}</h2>
      </div>
      <div className="mt-4 space-y-4 pl-0 text-base leading-relaxed text-muted-foreground sm:pl-10">
        {children}
      </div>
    </section>
  );
}
