import { createFileRoute, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

import { TretnixLogo } from "@/components/TretnixLogo";
import { getAdminSession, loginAdminSession } from "@/features/tretnix/live.functions";
import { setAdminCsrfToken } from "@/lib/admin-session";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Accesso — Tretnix Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AuthPage,
});

function safeAdminNext(value: string | null) {
  return value?.startsWith("/admin") && !value.startsWith("//") ? value : "/admin";
}

function AuthPage() {
  const navigate = useNavigate();
  const next = useRouterState({
    select: (state) =>
      safeAdminNext(new URLSearchParams(state.location.searchStr).get("next")),
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void getAdminSession()
      .then((session) => {
        if (cancelled || !session.authenticated) return;
        setAdminCsrfToken(session.csrfToken);
        navigate({ to: next });
      })
      .catch(() => {
        // The login form remains available when no valid session exists.
      });
    return () => {
      cancelled = true;
    };
  }, [navigate, next]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const result = await loginAdminSession({ data: { email, password } });
      setAdminCsrfToken(result.csrfToken);
      navigate({ to: next });
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Errore di autenticazione");
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
          <h1 className="font-serif text-3xl">Accesso admin</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Accedi per gestire progetti, richieste e impostazioni Tretnix.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="admin-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="admin-input"
              />
            </div>

            {err && (
              <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm">
                {err}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? "Attendere…" : "Accedi"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
