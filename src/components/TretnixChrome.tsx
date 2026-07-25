import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight, ArrowUp, Menu, X } from "lucide-react";
import { TretnixLogo } from "./TretnixLogo";
import { trackEvent } from "@/lib/analytics";
import { useSiteSettings } from "@/lib/site-settings";

/* Nav sections shown on the homepage. */
const NAV = [
  { hash: "perche-serve", label: "Perché serve" },
  { hash: "cosa-possiamo-costruire", label: "Soluzioni" },
  { hash: "progetti", label: "Case study" },
  { hash: "metodo", label: "Metodo" },
  { hash: "automazioni-ai", label: "Automazioni AI" },
  { hash: "faq", label: "FAQ" },
  { hash: "contatti", label: "Contatti" },
];

/** Scroll-spy: return the id of the section currently in view. Offset-based, stable, sequential. */
function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (ids.length === 0) {
      setActive(null);
      return;
    }

    let raf = 0;
    const compute = () => {
      raf = 0;
      const els = ids
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => Boolean(el));
      if (!els.length) {
        setActive(null);
        return;
      }

      const scrollY = window.scrollY;
      const activationLine = scrollY + window.innerHeight * 0.35;

      const firstTop = els[0].getBoundingClientRect().top + scrollY;
      // Hero threshold: nothing active until we approach the first section.
      if (scrollY + 120 < firstTop) {
        setActive(null);
        return;
      }

      // Bottom-of-page: activate the last section.
      const docHeight = document.documentElement.scrollHeight;
      if (scrollY + window.innerHeight >= docHeight - 4) {
        setActive(els[els.length - 1].id);
        return;
      }

      let currentId: string | null = els[0].id;
      for (const el of els) {
        const top = el.getBoundingClientRect().top + scrollY;
        if (top <= activationLine) currentId = el.id;
        else break;
      }
      setActive(currentId);
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(compute);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    compute();
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids.join("|")]); // eslint-disable-line react-hooks/exhaustive-deps

  return active;
}

/** Smoothly scroll to a section by id (used on-page). */
function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top, behavior: "smooth" });
}

/** Trigger the contact form to reset to step 1 and focus. */
export function openContactForm(preselectNeed?: string) {
  if (typeof window === "undefined") return;
  // Scroll first — same helper the navbar uses — so no layout jump can interrupt it.
  scrollToId("contatti");
  // Reset/open the form only after the smooth scroll has settled.
  // ContactSection then orients focus without triggering a second page jump.
  window.setTimeout(() => {
    window.dispatchEvent(
      new CustomEvent("tretnix:openContact", {
        detail: { preselectNeed },
      }),
    );
  }, 650);
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";
  const isCaseStudies = pathname.startsWith("/case-studies");

  const activeSection = useActiveSection(isHome ? NAV.map((n) => n.hash) : []);
  const activeHash = isHome ? activeSection : isCaseStudies ? "progetti" : null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
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

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const linkHref = (hash: string) => (isHome ? `#${hash}` : `/#${hash}`);

  function onNavClick(e: React.MouseEvent<HTMLAnchorElement>, hash: string) {
    if (!isHome) return; // let browser navigate to /#hash
    e.preventDefault();
    scrollToId(hash);
  }

  function onCtaClick(e: React.MouseEvent<HTMLAnchorElement>) {
    trackEvent("cta_click", { path: pathname });
    if (isHome) {
      e.preventDefault();
      openContactForm();
    }
    // On other pages, the anchor href "/#contatti" navigates home then anchor logic scrolls.
  }

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
              className="h-[30px] w-[130px] sm:h-[34px] sm:w-[150px]"
            />
          </Link>

          <ul className="hidden items-center gap-0.5 md:flex">
            {NAV.map((n) => {
              const isActive = activeHash === n.hash;
              return (
                <li key={n.hash}>
                  <a
                    href={linkHref(n.hash)}
                    onClick={(e) => onNavClick(e, n.hash)}
                    aria-current={isActive ? "true" : undefined}
                    className={`group relative rounded-full px-3 py-2 text-[13px] transition-colors ${
                      isActive ? "nav-link-active" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {n.label}
                    <span
                      className={`pointer-events-none absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary-glow transition-opacity ${
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
              href={linkHref("contatti")}
              onClick={onCtaClick}
              className="btn-primary group hidden md:inline-flex !py-2 !px-4 text-sm"
            >
              Parliamo del tuo progetto
              <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
            </a>
            <button
              type="button"
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
                    style={{ animationDelay: `${60 + i * 40}ms` }}
                  >
                    <a
                      href={linkHref(n.hash)}
                      aria-current={isActive ? "true" : undefined}
                      onClick={(e) => {
                        onNavClick(e, n.hash);
                        setOpen(false);
                      }}
                      className={`group flex items-center justify-between rounded-2xl px-4 py-3 text-base transition-colors ${
                        isActive
                          ? "bg-white/[0.05] text-foreground"
                          : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {isActive && <span className="h-1.5 w-1.5 rounded-full bg-primary-glow" />}
                        {n.label}
                      </span>
                      <ArrowRight className="h-4 w-4 text-subtle transition-transform duration-200 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
                    </a>
                  </li>
                );
              })}
            </ul>
            <div
              className="animate-menu-item-in mt-2 px-1 pb-1"
              style={{ animationDelay: `${60 + NAV.length * 40}ms` }}
            >
              <a
                href={linkHref("contatti")}
                onClick={(e) => {
                  onCtaClick(e);
                  setOpen(false);
                }}
                className="btn-primary group w-full justify-center"
              >
                Parliamo del tuo progetto
                <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Breadcrumb: minimal, muted, above the page title. */
export function Breadcrumb({
  items,
}: {
  items: Array<{ label: string; to?: string }>;
}) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-subtle">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true" className="text-subtle/60">/</span>}
            {it.to && i < items.length - 1 ? (
              <Link to={it.to} className="transition-colors hover:text-foreground">
                {it.label}
              </Link>
            ) : (
              <span className={i === items.length - 1 ? "text-muted-foreground" : ""}>
                {it.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Footer() {
  const telClean = "+390490000000";
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
              <FooterContact />
              <a
                href={`tel:${telClean}`}
                onClick={() => trackEvent("phone_click")}
                className="hover:text-foreground transition-colors sr-only"
              >
                phone fallback
              </a>
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

function FooterContact() {
  const s = useSiteSettings();
  const telClean = s.contact_phone.replace(/\s+/g, "");
  return (
    <>
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
    </>
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
      type="button"
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
