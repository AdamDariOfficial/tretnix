import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Folders, Settings, BarChart3, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [stats, setStats] = useState({ projects: 0, visible: 0, featured: 0, events7d: 0 });

  useEffect(() => {
    void (async () => {
      const [all, vis, feat, ev] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("projects").select("id", { count: "exact", head: true }).eq("is_visible", true),
        supabase.from("projects").select("id", { count: "exact", head: true }).eq("is_featured", true),
        supabase
          .from("analytics_events")
          .select("id", { count: "exact", head: true })
          .gte("created_at", new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString()),
      ]);
      setStats({
        projects: all.count ?? 0,
        visible: vis.count ?? 0,
        featured: feat.count ?? 0,
        events7d: ev.count ?? 0,
      });
    })();
  }, []);

  const cards = [
    { label: "Progetti totali", value: stats.projects },
    { label: "Progetti visibili", value: stats.visible },
    { label: "In homepage (featured)", value: stats.featured },
    { label: "Eventi ultimi 7 giorni", value: stats.events7d },
  ];

  const shortcuts = [
    { to: "/admin/projects", label: "Gestisci progetti", icon: Folders, desc: "Crea, modifica, riordina e mostra/nascondi case study." },
    { to: "/admin/settings", label: "Impostazioni sito", icon: Settings, desc: "Aggiorna email, telefono, sede e oggetto CTA." },
    { to: "/admin/analytics", label: "Analytics", icon: BarChart3, desc: "Visualizza traffico anonimo aggregato." },
  ];

  return (
    <div>
      <h1 className="font-serif text-4xl">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">Panoramica rapida del sito.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="glass-card rounded-2xl p-5">
            <div className="text-xs uppercase tracking-widest text-subtle">{c.label}</div>
            <div className="mt-2 font-serif text-3xl">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {shortcuts.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.to}
              to={s.to}
              className="glass-card group rounded-2xl p-6 transition-all hover:border-primary-glow/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/40 bg-primary/10 text-primary-glow">
                <Icon className="h-4 w-4" />
              </div>
              <div className="mt-5 flex items-center justify-between">
                <div className="text-lg font-medium">{s.label}</div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
