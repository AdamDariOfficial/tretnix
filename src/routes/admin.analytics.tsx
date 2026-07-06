import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/analytics")({
  component: AdminAnalytics,
});

type EventRow = {
  event_type: string;
  path: string | null;
  project_slug: string | null;
  device_type: string | null;
  referrer_host: string | null;
  created_at: string;
};

function AdminAnalytics() {
  const [rows, setRows] = useState<EventRow[]>([]);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const since = new Date(Date.now() - days * 24 * 3600 * 1000).toISOString();
    void supabase
      .from("analytics_events")
      .select("event_type,path,project_slug,device_type,referrer_host,created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(5000)
      .then(({ data }) => {
        setRows((data ?? []) as EventRow[]);
        setLoading(false);
      });
  }, [days]);

  const summary = useMemo(() => {
    const byType: Record<string, number> = {};
    const byPath: Record<string, number> = {};
    const byDevice: Record<string, number> = {};
    const byRef: Record<string, number> = {};
    const byDay: Record<string, number> = {};
    for (const r of rows) {
      byType[r.event_type] = (byType[r.event_type] ?? 0) + 1;
      if (r.path) byPath[r.path] = (byPath[r.path] ?? 0) + 1;
      if (r.device_type) byDevice[r.device_type] = (byDevice[r.device_type] ?? 0) + 1;
      if (r.referrer_host) byRef[r.referrer_host] = (byRef[r.referrer_host] ?? 0) + 1;
      const d = r.created_at.slice(0, 10);
      byDay[d] = (byDay[d] ?? 0) + 1;
    }
    return { byType, byPath, byDevice, byRef, byDay };
  }, [rows]);

  const top = (m: Record<string, number>, n = 10) =>
    Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, n);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-4xl">Analytics</h1>
          <p className="mt-2 text-muted-foreground">
            Eventi anonimi aggregati. Nessun cookie, nessun ID visitatore, nessun IP registrato.
          </p>
        </div>
        <select value={days} onChange={(e) => setDays(parseInt(e.target.value))} className="admin-input w-auto">
          <option value={1}>Ultime 24h</option>
          <option value={7}>Ultimi 7 giorni</option>
          <option value={30}>Ultimi 30 giorni</option>
          <option value={90}>Ultimi 90 giorni</option>
        </select>
      </div>

      {loading ? (
        <div className="mt-8 text-muted-foreground">Caricamento…</div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Panel title="Totale eventi">
            <div className="font-serif text-5xl">{rows.length}</div>
            <div className="mt-2 text-sm text-subtle">Ultimi {days} giorni</div>
          </Panel>
          <Panel title="Per giorno">
            <ul className="space-y-1 text-sm">
              {Object.entries(summary.byDay).sort().map(([d, c]) => (
                <li key={d} className="flex justify-between border-b border-border py-1.5">
                  <span className="text-muted-foreground">{d}</span>
                  <span className="text-foreground">{c}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Per tipo di evento">
            <StatList data={top(summary.byType)} />
          </Panel>
          <Panel title="Per device">
            <StatList data={top(summary.byDevice)} />
          </Panel>
          <Panel title="Pagine più visitate">
            <StatList data={top(summary.byPath)} />
          </Panel>
          <Panel title="Referrer">
            <StatList data={top(summary.byRef)} empty="Traffico diretto" />
          </Panel>
        </div>
      )}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="text-xs uppercase tracking-widest text-subtle">{title}</div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function StatList({ data, empty }: { data: [string, number][]; empty?: string }) {
  if (data.length === 0) return <div className="text-sm text-muted-foreground">{empty ?? "Nessun dato"}</div>;
  const max = Math.max(...data.map((d) => d[1]));
  return (
    <ul className="space-y-2 text-sm">
      {data.map(([k, v]) => (
        <li key={k}>
          <div className="flex justify-between">
            <span className="truncate pr-2 text-muted-foreground">{k}</span>
            <span className="text-foreground">{v}</span>
          </div>
          <div className="mt-1 h-1 w-full rounded bg-white/[0.05]">
            <div
              className="h-1 rounded bg-primary-glow"
              style={{ width: `${(v / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
