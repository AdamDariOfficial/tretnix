import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { LogOut, LayoutDashboard, Folders, Settings, BarChart3, Inbox } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { TretnixLogo } from "@/components/TretnixLogo";
import { useAdminSession } from "@/lib/admin-auth";

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
  { to: "/admin/projects", label: "Progetti", icon: Folders },
  { to: "/admin/contact-requests", label: "Richieste", icon: Inbox },
  { to: "/admin/settings", label: "Impostazioni", icon: Settings },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

function AdminLayout() {
  const session = useAdminSession();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

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
        action={<Link to="/auth" search={{ next: pathname }} className="btn-primary mt-6">Vai all'accesso</Link>}
      />
    );
  }
  if (session.status === "not-admin") {
    return (
      <NoticeScreen
        title="Accesso non autorizzato"
        message={`L'account ${session.email ?? ""} non ha il ruolo admin. Contatta il proprietario del sito per essere abilitato.`}
        action={
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/auth" });
            }}
            className="btn-ghost mt-6"
          >
            <LogOut className="h-4 w-4" /> Esci
          </button>
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
              {NAV.map((n) => {
                const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
                const Icon = n.icon;
                return (
                  <li key={n.to}>
                    <Link
                      to={n.to}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                        active
                          ? "bg-primary/10 text-foreground border border-primary/40"
                          : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground border border-transparent"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {n.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="border-t border-border p-4">
            <div className="mb-2 truncate text-xs text-subtle">{session.email}</div>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                navigate({ to: "/auth" });
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
            >
              <LogOut className="h-4 w-4" /> Esci
            </button>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <header className="flex items-center justify-between border-b border-border px-6 py-4 md:hidden">
            <Link to="/" className="inline-flex items-center">
              <TretnixLogo variant="horizontal" className="h-6 w-[120px]" />
            </Link>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                navigate({ to: "/auth" });
              }}
              className="text-sm text-muted-foreground"
            >
              Esci
            </button>
          </header>
          <nav className="flex gap-1 overflow-x-auto border-b border-border px-4 py-3 md:hidden">
            {NAV.map((n) => {
              const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-sm ${
                    active ? "bg-primary/15 text-foreground border border-primary/40" : "text-muted-foreground border border-border"
                  }`}
                >
                  {n.label}
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
