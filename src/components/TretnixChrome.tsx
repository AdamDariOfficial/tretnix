import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUp, Menu, X } from "lucide-react";
import { TretnixLogo } from "./TretnixLogo";

/* Nav items link to landing anchors. When we're not on the landing page,
   they resolve to "/#anchor" so the browser navigates home and scrolls. */
const NAV = [
  { hash: "servizi", label: "Servizi" },
  { hash: "perche-serve", label: "Perché serve" },
  { hash: "progetti", label: "Case study" },
  { hash: "processo", label: "Processo" },
  { hash: "studio", label: "Studio" },
  { hash: "contatti", label: "Contatti" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change (Escape / outside click)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const linkHref = (hash: string) => `/#${hash}`;

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <div className="relative w-full max-w-5xl">
        <nav
          className={`glass-panel flex h-[62px] items-center justify-between rounded-full pl-5 pr-2 transition-all duration-300 ${
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
            {NAV.map((n) => (
              <li key={n.hash}>
                <a
                  href={linkHref(n.hash)}
                  className="group relative rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {n.label}
                  <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary-glow opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a href="/#contatti" className="btn-primary hidden md:inline-flex !py-2 !px-4 text-sm">
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
            className="glass-panel animate-menu-in absolute left-0 right-0 top-[74px] rounded-3xl p-3 md:hidden"
          >
            <ul className="flex flex-col">
              {NAV.map((n, i) => (
                <li
                  key={n.hash}
                  className="animate-menu-item-in"
                  style={{ animationDelay: `${60 + i * 45}ms` }}
                >
                  <a
                    href={linkHref(n.hash)}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-2xl px-4 py-3 text-base text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
                  >
                    {n.label}
                    <ArrowRight className="h-4 w-4 text-subtle" />
                  </a>
                </li>
              ))}
            </ul>
            <div
              className="animate-menu-item-in mt-2 px-1 pb-1"
              style={{ animationDelay: `${60 + NAV.length * 45}ms` }}
            >
              <a
                href="/#contatti"
                onClick={() => setOpen(false)}
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
              <a href="tel:+390490000000" className="hover:text-foreground transition-colors">
                +39 049 000 0000
              </a>
              <a
                href="mailto:hello@tretnix.com"
                className="hover:text-primary-glow transition-colors"
              >
                hello@tretnix.com
              </a>
              <span className="text-subtle">Padova, Italia</span>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-start justify-between gap-3 text-xs text-subtle sm:flex-row sm:items-center">
            <span>© 2026 Tretnix Studio</span>
            <div className="flex items-center gap-2">
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
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Torna in cima"
      className="glass-panel fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full text-foreground soft-glow hover:border-primary-glow/60"
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}
