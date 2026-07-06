/**
 * Placeholder cookie consent banner.
 *
 * NOT rendered by default. Import and mount from the app root only when
 * non-technical cookies, analytics, marketing pixels or tracking tools
 * are actually installed on the site.
 *
 * Design intent when enabled:
 * - dark glassmorphism, consistent with the Tretnix identity
 * - accept / reject / manage-preferences buttons (no dark patterns)
 * - no pre-selected non-technical cookies
 */
import { useState } from "react";

const STORAGE_KEY = "tretnix.cookie-consent";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(STORAGE_KEY) === null;
  });

  if (!visible) return null;

  const decide = (choice: "accepted" | "rejected") => {
    try {
      window.localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      /* storage unavailable */
    }
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Preferenze cookie"
      className="glass-panel fixed bottom-4 left-1/2 z-50 w-[min(680px,calc(100%-2rem))] -translate-x-1/2 rounded-2xl p-5 soft-glow"
    >
      <p className="text-sm text-muted-foreground">
        Utilizziamo cookie tecnici per il funzionamento del sito. Se in futuro attiveremo
        strumenti di analytics o marketing, potrai gestire le tue preferenze da qui.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="btn-primary !py-2 !px-4 text-sm" onClick={() => decide("accepted")}>
          Accetta
        </button>
        <button className="btn-ghost !py-2 !px-4 text-sm" onClick={() => decide("rejected")}>
          Rifiuta
        </button>
        <a href="/cookie-policy" className="btn-ghost !py-2 !px-4 text-sm">
          Gestisci preferenze
        </a>
      </div>
    </div>
  );
}
