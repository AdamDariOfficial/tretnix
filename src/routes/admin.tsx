import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { BarChart3, Folders, Inbox, LayoutDashboard, LogOut, Settings } from "lucide-react";
import { useState } from "react";

import { TretnixLogo } from "@/components/TretnixLogo";
import { logoutAdminSession } from "@/features/tretnix/live.functions";
import { useAdminSession } from "@/lib/admin-auth";
import { requireAdminCsrfToken, setAdminCsrfToken } from "@/lib/admin-session";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Tretnix" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/projects", label: "Progetti", icon: Folders, exact: false },
  { to: "/admin/contact-requests", label: "Richieste", icon: Inbox, exact: false },
  { to: "/admin/settings", label: "Impostazioni", icon: Settings, exact: false },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3, exact: false },
] as const;

function AdminLayout() {
  const session = useAdminSession();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [logoutPending, setLogoutPending] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  async function signOut() {
    if (logoutPending) return;
    setLogoutPending(true);
    setLogoutError(null);
    try {
      await logoutAdminSession({ data: { csrfToken: await requireAdminCsrfToken() } });
    } catch {
      setLogoutError("Disconnessione non confermata. Riprova.");
      return;
    } finally {
      setLogoutPending(false);
    }
    setAdminCsrfToken(null);
    navigate({ to: "/auth" });
  }

  if (session.status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Verifica accesso…
      </div>
    );
  }

  if (session.status === "signed-out") {
    return (
      <NoticeScreen
        title="Accesso richiesto"
        message="Devi effettuare l'accesso per usare l'admin."
        action={
          <Link to="/auth" search={{ next: pathname }} className="btn-primary mt-6">
            Vai all'accesso
          </Link>
        }
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <aside className="hidden w-64 shrink-0 border-r border-border md:flex md:flex-col">
          <div className="p-6">
            <Link to="/" className="inline-flex items-center">
              <TretnixLogo variant="horizontal" className="h-7 w-[140px]" />
            </Link>
            <div className="mt-1 text-xs text-subtle">Admin</div>
          </div>

          <nav className="flex-1 px-3">
            <ul className="space-y-1">
              {NAV.map((item) => {
                const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors ${
                        active
                          ? "border-primary/40 bg-primary/10 text-foreground"
                          : "border-transparent text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-border p-4">
            <div className="mb-2 truncate text-xs text-subtle">{session.email}</div>
            <button
              type="button"
              onClick={signOut}
              disabled={logoutPending}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              {logoutPending ? "Uscita…" : "Esci"}
            </button>
            {logoutError && <p role="alert" className="mt-2 px-3 text-sm text-destructive">{logoutError}</p>}
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="flex items-center justify-between border-b border-border px-6 py-4 md:hidden">
            <Link to="/" className="inline-flex items-center">
              <TretnixLogo variant="horizontal" className="h-6 w-[120px]" />
            </Link>
            <button type="button" onClick={signOut} disabled={logoutPending} className="text-sm text-muted-foreground">
              {logoutPending ? "Uscita…" : "Esci"}
            </button>
          </header>
          {logoutError && <p role="alert" className="px-6 pt-3 text-sm text-destructive md:hidden">{logoutError}</p>}

          <nav className="flex gap-1 overflow-x-auto border-b border-border px-4 py-3 md:hidden">
            {NAV.map((item) => {
              const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-sm ${
                    active
                      ? "border-primary/40 bg-primary/15 text-foreground"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-6 lg:p-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function NoticeScreen({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="glass-panel max-w-md rounded-3xl p-10 text-center">
        <h1 className="font-serif text-3xl">{title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{message}</p>
        {action}
      </div>
    </div>
  );
}
