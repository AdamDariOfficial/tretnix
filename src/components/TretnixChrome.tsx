import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight, ArrowUp, Menu, X } from "lucide-react";
import { TretnixLogo } from "./TretnixLogo";
import { useSiteSettings, mailtoHref } from "@/lib/site-settings";
import { trackEvent } from "@/lib/analytics";

/* Nav sections shown on the homepage. */
const NAV = [
  { hash: "servizi", label: "Servizi" },
  { hash: "perche-serve", label: "Perché serve" },
  { hash: "progetti", label: "Case study" },
  { hash: "processo", label: "Processo" },
  { hash: "studio", label: "Studio" },
  { hash: "contatti", label: "Contatti" },
];

/** Scroll-spy: return the id of the section currently in view. */
function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const settings = useSiteSettings();

  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";
  const isCaseStudies = pathname.startsWith("/case-studies");

  const activeSection = useActiveSection(isHome ? NAV.map((n) => n.hash) : []);
  const activeHash = isHome ? activeSection : isCaseStudies ? "progetti" : null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const linkHref = (hash: string) => `/#${hash}`;

  const onCtaClick = () => trackEvent("cta_click", { path: pathname });

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <div className="relative w-full max-w-5xl">
        <nav
          className={`glass-navbar flex h-[62px] items-center justify-between rounded-full pl-5 pr-2 transition-all duration-300 ${
            scrolled ? "soft-glow" : ""
          }`}
          aria-label="Navigazione principale"
        >
          <Link to="/" className="flex items-center" aria-label="Vai alla homepage Tretnix">
            <TretnixLogo
              variant="horizontal"
              className="h-[30px] w-[130px] sm:h-[34px] sm:w-[160px]"
            />
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {NAV.map((n) => {
              const isActive = activeHash === n.hash;
              return (
                <li key={n.hash}>
                  <a
                    href={linkHref(n.hash)}
                    aria-current={isActive ? "true" : undefined}
                    className={`group relative rounded-full px-4 py-2 text-sm transition-colors ${
                      isActive ? "nav-link-active" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {n.label}
                    <span
                      className={`absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary-glow transition-opacity ${
                        isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={mailtoHref(settings)}
              onClick={onCtaClick}
              className="btn-primary hidden md:inline-flex !py-2 !px-4 text-sm"
            >
              Parliamo del tuo progetto <ArrowRight className="h-4 w-4" />
            </a>
            <button
              className="glass-panel flex h-11 w-11 items-center justify-center rounded-full md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Chiudi menu" : "Apri menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <span className="relative block h-5 w-5">
                <Menu
                  className={`absolute inset-0 h-5 w-5 transition-all duration-200 ${
                    open ? "rotate-45 opacity-0" : "rotate-0 opacity-100"
                  }`}
                />
                <X
                  className={`absolute inset-0 h-5 w-5 transition-all duration-200 ${
                    open ? "rotate-0 opacity-100" : "-rotate-45 opacity-0"
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>

        {open && (
          <div
            id="mobile-menu"
            className="glass-menu animate-menu-in absolute left-0 right-0 top-[74px] rounded-3xl p-3 md:hidden"
          >
            <ul className="flex flex-col">
              {NAV.map((n, i) => {
                const isActive = activeHash === n.hash;
                return (
                  <li
                    key={n.hash}
                    className="animate-menu-item-in"
                    style={{ animationDelay: `${60 + i * 45}ms` }}
                  >
                    <a
                      href={linkHref(n.hash)}
                      aria-current={isActive ? "true" : undefined}
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between rounded-2xl px-4 py-3 text-base transition-colors ${
                        isActive
                          ? "bg-white/[0.05] text-foreground"
                          : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {isActive && <span className="h-1.5 w-1.5 rounded-full bg-primary-glow" />}
                        {n.label}
                      </span>
                      <ArrowRight className="h-4 w-4 text-subtle" />
                    </a>
                  </li>
                );
              })}
            </ul>
            <div
              className="animate-menu-item-in mt-2 px-1 pb-1"
              style={{ animationDelay: `${60 + NAV.length * 45}ms` }}
            >
              <a
                href={mailtoHref(settings)}
                onClick={() => {
                  onCtaClick();
                  setOpen(false);
                }}
                className="btn-primary w-full justify-center"
              >
                Parliamo del tuo progetto <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function Footer() {
  const s = useSiteSettings();
  const telClean = s.contact_phone.replace(/\s+/g, "");
  return (
    <footer className="pb-10 pt-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="border-t border-white/10 pt-12">
          <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Link to="/" aria-label="Vai alla homepage Tretnix" className="inline-block">
                <TretnixLogo variant="horizontal" className="h-9 w-[170px]" />
              </Link>
              <p className="mt-5 max-w-xs text-sm text-muted-foreground">
                Software su misura per aziende che vogliono lavorare meglio.
              </p>
            </div>
            <div className="flex flex-col gap-1.5 text-sm text-muted-foreground sm:text-right">
              <a
                href={`tel:${telClean}`}
                onClick={() => trackEvent("phone_click")}
                className="hover:text-foreground transition-colors"
              >
                {s.contact_phone}
              </a>
              <a
                href={`mailto:${s.contact_email}`}
                onClick={() => trackEvent("email_click")}
                className="hover:text-primary-glow transition-colors"
              >
                {s.contact_email}
              </a>
              <span className="text-subtle">{s.location}</span>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-start justify-between gap-3 text-xs text-subtle sm:flex-row sm:items-center">
            <span>© {new Date().getFullYear()} Tretnix Studio</span>
            <div className="flex items-center gap-2">
              <Link to="/case-studies" className="hover:text-foreground transition-colors">
                Case study
              </Link>
              <span aria-hidden="true">·</span>
              <Link to="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <span aria-hidden="true">·</span>
              <Link to="/cookie-policy" className="hover:text-foreground transition-colors">
                Cookie
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function BackToTopButton() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const pct = height > 0 ? Math.min(100, Math.max(0, (scrollTop / height) * 100)) : 0;
      setProgress(pct);
      setVisible(scrollTop > 600);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  const R = 22;
  const CIRC = 2 * Math.PI * R;
  const offset = CIRC * (1 - progress / 100);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Torna all'inizio"
      className="animate-btt-in glass-panel fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full text-foreground transition-colors hover:border-primary-glow/60 sm:bottom-6 sm:right-6"
    >
      <svg
        className="pointer-events-none absolute inset-0 -rotate-90"
        viewBox="0 0 48 48"
        aria-hidden="true"
      >
        <circle cx="24" cy="24" r={R} stroke="rgba(255,255,255,0.08)" strokeWidth="2" fill="none" />
        <circle
          cx="24"
          cy="24"
          r={R}
          stroke="var(--primary-glow)"
          strokeWidth="2"
          fill="none"
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.15s linear" }}
        />
      </svg>
      <ArrowUp className="relative h-4 w-4" />
    </button>
  );
}
