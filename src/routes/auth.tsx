import { createFileRoute, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TretnixLogo } from "@/components/TretnixLogo";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Accesso — Tretnix Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const next = useRouterState({ select: (s) => new URLSearchParams(s.location.searchStr).get("next") || "/admin" });
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: next });
    });
  }, [navigate, next]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    setMsg(null);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: next });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth` },
        });
        if (error) throw error;
        setMsg("Account creato. Contatta l'amministratore per abilitare l'accesso admin.");
      }
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Errore di autenticazione");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(11,99,255,0.22),transparent_70%)] blur-3xl" />
        <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      </div>

      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 inline-flex items-center">
          <TretnixLogo variant="horizontal" className="h-8 w-[150px]" />
        </Link>
        <div className="glass-panel rounded-3xl p-8">
          <h1 className="font-serif text-3xl">
            {mode === "signin" ? "Accesso admin" : "Crea account"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Accedi per gestire progetti e impostazioni del sito."
              : "L'account verrà creato ma l'accesso admin va abilitato manualmente."}
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="admin-label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input"
              />
            </div>

            {err && (
              <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground">
                {err}
              </div>
            )}
            {msg && (
              <div className="rounded-lg border border-primary-glow/30 bg-primary/10 px-3 py-2 text-sm text-foreground">
                {msg}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? "Attendere…" : mode === "signin" ? "Accedi" : "Crea account"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setMode((m) => (m === "signin" ? "signup" : "signin"));
              setErr(null);
              setMsg(null);
            }}
            className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-foreground"
          >
            {mode === "signin" ? "Non hai un account? Registrati" : "Torna all'accesso"}
          </button>
        </div>
      </div>
    </div>
  );
}
