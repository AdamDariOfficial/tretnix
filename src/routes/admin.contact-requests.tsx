import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Mail, Phone, Search, Trash2 } from "lucide-react";
import {
  adminListContactRequests,
  adminUpdateStatus,
  adminDeleteContactRequest,
  CONTACT_STATUSES,
  type ContactRequest,
  type ContactStatus,
} from "@/lib/contact-requests";

export const Route = createFileRoute("/admin/contact-requests")({
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  component: ContactRequestsPage,
});

const STATUS_LABEL: Record<ContactStatus, string> = {
  new: "Nuovo",
  contacted: "Contattato",
  archived: "Archiviato",
};

function ContactRequestsPage() {
  const [items, setItems] = useState<ContactRequest[]>([]);
  const [filter, setFilter] = useState<ContactStatus | "all">("all");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactRequest | null>(null);

  async function reload() {
    setLoading(true);
    try {
      setItems(await adminListContactRequests());
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void reload();
  }, []);

  const newCount = items.filter((i) => i.status === "new").length;
  const filtered = useMemo(() => {
    const lower = q.trim().toLowerCase();
    return items.filter((i) => {
      if (filter !== "all" && i.status !== filter) return false;
      if (!lower) return true;
      return (
        i.full_name.toLowerCase().includes(lower) ||
        i.email.toLowerCase().includes(lower) ||
        (i.business_name ?? "").toLowerCase().includes(lower) ||
        i.message.toLowerCase().includes(lower)
      );
    });
  }, [items, filter, q]);

  async function setStatus(id: string, status: ContactStatus) {
    await adminUpdateStatus(id, status);
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    if (selected?.id === id) setSelected({ ...selected, status });
  }
  async function remove(id: string) {
    if (!confirm("Eliminare definitivamente questa richiesta?")) return;
    await adminDeleteContactRequest(id);
    setItems((prev) => prev.filter((r) => r.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl">Richieste di contatto</h1>
          <p className="mt-2 text-muted-foreground">
            Messaggi inviati tramite il form di contatto sulla homepage.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["all", ...CONTACT_STATUSES] as const).map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                filter === k
                  ? "border-primary/50 bg-primary/15 text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {k === "all" ? "Tutti" : STATUS_LABEL[k]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="glass-card overflow-hidden rounded-2xl">
          {loading ? (
            <div className="p-8 text-muted-foreground">Caricamento…</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-muted-foreground">Nessuna richiesta.</div>
          ) : (
            <ul className="divide-y divide-white/10">
              {filtered.map((r) => (
                <li key={r.id}>
                  <button
                    onClick={() => setSelected(r)}
                    className={`flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-white/[0.03] ${
                      selected?.id === r.id ? "bg-white/[0.04]" : ""
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium text-foreground">{r.full_name}</span>
                        <StatusBadge status={r.status} />
                      </div>
                      <div className="mt-1 truncate text-xs text-muted-foreground">
                        {r.business_name ? `${r.business_name} · ` : ""}
                        {r.email}
                      </div>
                      <div className="mt-1 line-clamp-1 text-xs text-subtle">{r.message}</div>
                    </div>
                    <div className="shrink-0 text-right text-[11px] text-subtle">
                      {new Date(r.created_at).toLocaleDateString("it-IT")}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="glass-card rounded-2xl p-6">
          {!selected ? (
            <div className="text-muted-foreground">Seleziona una richiesta per vederne i dettagli.</div>
          ) : (
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl">{selected.full_name}</h2>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {selected.business_name ?? "—"}
                  </div>
                </div>
                <StatusBadge status={selected.status} />
              </div>

              <div className="mt-5 flex flex-wrap gap-3 text-sm">
                <a
                  href={`mailto:${selected.email}`}
                  className="btn-ghost !py-2 !px-3 text-xs"
                >
                  <Mail className="h-3.5 w-3.5" /> {selected.email}
                </a>
                {selected.phone && (
                  <a
                    href={`tel:${selected.phone.replace(/\s+/g, "")}`}
                    className="btn-ghost !py-2 !px-3 text-xs"
                  >
                    <Phone className="h-3.5 w-3.5" /> {selected.phone}
                  </a>
                )}
              </div>

              <dl className="mt-6 space-y-4 text-sm">
                <Row label="Punto di partenza" value={selected.starting_point ?? "—"} />
                <Row
                  label="Di cosa ha bisogno"
                  value={selected.needs.length ? selected.needs.join(", ") : "—"}
                />
                <Row label="Pagina di provenienza" value={selected.source_path ?? "—"} />
                <Row
                  label="Data"
                  value={new Date(selected.created_at).toLocaleString("it-IT")}
                />
              </dl>

              <div className="mt-6">
                <div className="admin-label">Messaggio</div>
                <div className="whitespace-pre-wrap rounded-xl border border-border bg-black/30 p-4 text-sm text-foreground">
                  {selected.message}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                {CONTACT_STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(selected.id, s)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                      selected.status === s
                        ? "border-primary/60 bg-primary/20 text-foreground"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Segna come {STATUS_LABEL[s].toLowerCase()}
                  </button>
                ))}
                <button
                  onClick={() => remove(selected.id)}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-red-500/30 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Elimina
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="admin-label">{label}</dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  );
}

function StatusBadge({ status }: { status: ContactStatus }) {
  const styles: Record<ContactStatus, string> = {
    new: "border-primary/50 bg-primary/15 text-primary-glow",
    contacted: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
    archived: "border-border text-muted-foreground",
  };
  return (
    <span className={`inline-flex shrink-0 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-widest ${styles[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}
