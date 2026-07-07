import { createFileRoute, Link, useNavigate, useBlocker } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload, ArrowUp, ArrowDown, Trash2, Plus, AlertCircle } from "lucide-react";
import { adminGetProject, adminUpsertProject, type Project } from "@/lib/projects";
import {
  listProjectMedia,
  adminAddMedia,
  adminUpdateMedia,
  adminDeleteMedia,
  type ProjectMedia,
} from "@/lib/project-media";
import { uploadToProjectImages, useResolvedUrl } from "@/lib/storage";
import { StorageImage, StorageVideo } from "@/components/StorageMedia";

const GRADIENTS = [
  { label: "Blu profondo (top)", value: "bg-[radial-gradient(ellipse_at_top,#0B2A4A,#020814_70%),linear-gradient(135deg,#061326,#020814)]" },
  { label: "Blu profondo (bottom-right)", value: "bg-[radial-gradient(ellipse_at_bottom_right,#123055,#020814_70%),linear-gradient(135deg,#030B1A,#061326)]" },
  { label: "Blu profondo (top-left)", value: "bg-[radial-gradient(ellipse_at_top_left,#0B2A4A,#020814_70%),linear-gradient(135deg,#061326,#030B1A)]" },
];

function emptyProject(): Partial<Project> {
  return {
    slug: "",
    title: "",
    category: "Gestionale",
    short_description: "",
    overview: "",
    problem: "",
    solution: "",
    audience: "",
    features: [],
    impact_points: [],
    modules: [],
    workflow_steps: [],
    customizations: [],
    tech_stack: [],
    image_url: null,
    gradient: GRADIENTS[0].value,
    badge: "Concept interno / Demo portfolio",
    is_concept: true,
    is_visible: true,
    is_featured: false,
    sort_order: 100,
  };
}

/* Local staged media item — before commit to DB */
type StagedMedia = {
  key: string;
  id?: string; // present if already exists in DB
  type: "image" | "video";
  url: string;
  caption: string | null;
  alt_text: string | null;
  sort_order: number;
  _dirty?: boolean;      // modified from DB
  _new?: boolean;        // added in this session
  _deleted?: boolean;    // marked for deletion
};

export const Route = createFileRoute("/admin/projects/new")({
  component: () => <ProjectForm mode="new" />,
});

export function ProjectForm({ mode, id }: { mode: "new" | "edit"; id?: string }) {
  const navigate = useNavigate();
  const [p, setP] = useState<Partial<Project> | null>(mode === "new" ? emptyProject() : null);
  const [initialP, setInitialP] = useState<string>("");
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [tab, setTab] = useState<"base" | "content" | "media" | "visibility">("base");
  const [uploadingMain, setUploadingMain] = useState(false);

  const [media, setMedia] = useState<StagedMedia[]>([]);
  const [initialMedia, setInitialMedia] = useState<string>("");

  useEffect(() => {
    if (mode === "edit" && id) {
      void (async () => {
        const data = await adminGetProject(id);
        const proj = data ?? emptyProject();
        setP(proj);
        setInitialP(JSON.stringify(proj));
        try {
          const m = await listProjectMedia(id);
          const staged: StagedMedia[] = m.map((row) => ({
            key: row.id,
            id: row.id,
            type: row.type,
            url: row.url,
            caption: row.caption,
            alt_text: row.alt_text,
            sort_order: row.sort_order,
          }));
          setMedia(staged);
          setInitialMedia(JSON.stringify(staged));
        } catch {
          setMedia([]);
          setInitialMedia("[]");
        }
        setLoading(false);
      })();
    } else {
      setInitialP(JSON.stringify(p));
      setInitialMedia("[]");
    }
  }, [mode, id]); // eslint-disable-line react-hooks/exhaustive-deps

  const dirty = useMemo(() => {
    if (!p) return false;
    return JSON.stringify(p) !== initialP || JSON.stringify(media) !== initialMedia;
  }, [p, media, initialP, initialMedia]);

  // Warn on tab close / navigation away with unsaved changes
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  useBlocker({
    shouldBlockFn: () =>
      dirty ? !window.confirm("Ci sono modifiche non salvate. Uscire comunque?") : false,
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!p) return;
    setSaving(true);
    setErr(null);
    setOk(null);
    try {
      const payload = { ...p, slug: (p.slug || "").trim().toLowerCase() } as Partial<Project> & { slug: string; title: string };
      const saved = await adminUpsertProject(payload);

      // Commit staged media changes
      const toDelete = media.filter((m) => m._deleted && m.id);
      const toInsert = media.filter((m) => m._new && !m._deleted);
      const toUpdate = media.filter((m) => m._dirty && !m._new && !m._deleted && m.id);

      for (const m of toDelete) await adminDeleteMedia(m.id!);
      for (const m of toInsert) {
        await adminAddMedia({
          project_id: saved.id,
          type: m.type,
          url: m.url,
          caption: m.caption,
          alt_text: m.alt_text,
          sort_order: m.sort_order,
        });
      }
      for (const m of toUpdate) {
        await adminUpdateMedia(m.id!, {
          type: m.type,
          url: m.url,
          caption: m.caption,
          alt_text: m.alt_text,
          sort_order: m.sort_order,
        });
      }

      // Reload media to normalize state
      const fresh = await listProjectMedia(saved.id);
      const stagedFresh: StagedMedia[] = fresh.map((row) => ({
        key: row.id, id: row.id, type: row.type, url: row.url,
        caption: row.caption, alt_text: row.alt_text, sort_order: row.sort_order,
      }));
      setP(saved);
      setInitialP(JSON.stringify(saved));
      setMedia(stagedFresh);
      setInitialMedia(JSON.stringify(stagedFresh));
      setOk("Progetto salvato");
      if (mode === "new") {
        navigate({ to: "/admin/projects/$id", params: { id: saved.id } });
      }
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Errore salvataggio");
    } finally {
      setSaving(false);
    }
  }

  function onCancel() {
    if (dirty && !window.confirm("Annullare le modifiche non salvate?")) return;
    if (mode === "new") {
      navigate({ to: "/admin/projects" });
    } else {
      // reset from initial snapshots
      setP(JSON.parse(initialP));
      setMedia(JSON.parse(initialMedia));
      setErr(null);
      setOk(null);
    }
  }

  async function onMainImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !p) return;
    setUploadingMain(true);
    setErr(null);
    try {
      const marker = await uploadToProjectImages(file, p.slug || "unnamed");
      setP({ ...p, image_url: marker });
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Errore upload");
    } finally {
      setUploadingMain(false);
      e.target.value = "";
    }
  }

  if (loading || !p) return <div className="text-muted-foreground">Caricamento…</div>;

  const list = (key: keyof Project) => (p[key] as string[] | undefined)?.join("\n") ?? "";
  const setList = (key: keyof Project, v: string) =>
    setP({ ...p, [key]: v.split("\n").map((s) => s.trim()).filter(Boolean) });

  const tabs: { id: typeof tab; label: string }[] = [
    { id: "base", label: "Base" },
    { id: "content", label: "Contenuto" },
    { id: "media", label: "Media" },
    { id: "visibility", label: "Visibilità" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <Link to="/admin/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Torna ai progetti
        </Link>
        {dirty && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-1 text-[11px] text-amber-200">
            <AlertCircle className="h-3 w-3" /> Modifiche non salvate
          </span>
        )}
      </div>
      <h1 className="mt-4 font-serif text-4xl">{mode === "new" ? "Nuovo progetto" : "Modifica progetto"}</h1>

      {/* Tabs */}
      <div className="mt-6 flex flex-wrap gap-1 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-current={tab === t.id}
            className={`-mb-px rounded-t-lg border-b-2 px-4 py-2 text-sm transition-colors ${
              tab === t.id
                ? "border-primary-glow text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="mt-8 space-y-6">
        {tab === "base" && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <F label="Titolo">
              <input required value={p.title ?? ""} onChange={(e) => setP({ ...p, title: e.target.value })} className="admin-input" />
            </F>
            <F label="Slug (URL)">
              <input required value={p.slug ?? ""} onChange={(e) => setP({ ...p, slug: e.target.value })} className="admin-input" placeholder="es. mio-progetto" />
            </F>
            <F label="Categoria">
              <input value={p.category ?? ""} onChange={(e) => setP({ ...p, category: e.target.value })} className="admin-input" />
            </F>
            <F label="Badge">
              <input value={p.badge ?? ""} onChange={(e) => setP({ ...p, badge: e.target.value })} className="admin-input" />
            </F>
            <F label="Descrizione breve" full>
              <textarea rows={2} value={p.short_description ?? ""} onChange={(e) => setP({ ...p, short_description: e.target.value })} className="admin-input" />
            </F>
            <F label="Gradient di sfondo card" full>
              <select
                value={p.gradient ?? GRADIENTS[0].value}
                onChange={(e) => setP({ ...p, gradient: e.target.value })}
                className="admin-input"
              >
                {GRADIENTS.map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </F>
            <F label="Stato" full>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={!!p.is_concept} onChange={(e) => setP({ ...p, is_concept: e.target.checked })} />
                È un concept
              </label>
            </F>
          </div>
        )}

        {tab === "content" && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <F label="Panoramica" full>
              <textarea rows={3} value={p.overview ?? ""} onChange={(e) => setP({ ...p, overview: e.target.value })} className="admin-input" />
            </F>
            <F label="Per chi è pensato" full>
              <textarea rows={2} value={p.audience ?? ""} onChange={(e) => setP({ ...p, audience: e.target.value })} className="admin-input" />
            </F>
            <F label="Problema">
              <textarea rows={4} value={p.problem ?? ""} onChange={(e) => setP({ ...p, problem: e.target.value })} className="admin-input" />
            </F>
            <F label="Soluzione">
              <textarea rows={4} value={p.solution ?? ""} onChange={(e) => setP({ ...p, solution: e.target.value })} className="admin-input" />
            </F>
            <F label="Moduli (uno per riga)">
              <textarea rows={4} value={list("modules")} onChange={(e) => setList("modules", e.target.value)} className="admin-input" />
            </F>
            <F label="Funzionalità (uno per riga)">
              <textarea rows={4} value={list("features")} onChange={(e) => setList("features", e.target.value)} className="admin-input" />
            </F>
            <F label="Flusso operativo (uno per riga)">
              <textarea rows={4} value={list("workflow_steps")} onChange={(e) => setList("workflow_steps", e.target.value)} className="admin-input" />
            </F>
            <F label="Personalizzazioni (uno per riga)">
              <textarea rows={4} value={list("customizations")} onChange={(e) => setList("customizations", e.target.value)} className="admin-input" />
            </F>
            <F label="Impatto (uno per riga)">
              <textarea rows={4} value={list("impact_points")} onChange={(e) => setList("impact_points", e.target.value)} className="admin-input" />
            </F>
            <F label="Tech stack (uno per riga)">
              <textarea rows={4} value={list("tech_stack")} onChange={(e) => setList("tech_stack", e.target.value)} className="admin-input" />
            </F>
          </div>
        )}

        {tab === "media" && (
          <div className="space-y-8">
            <F label="Immagine di copertina" full>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  type="url"
                  placeholder="URL esterno o marker sb://…"
                  value={p.image_url ?? ""}
                  onChange={(e) => setP({ ...p, image_url: e.target.value })}
                  className="admin-input flex-1"
                />
                <label className="btn-ghost cursor-pointer">
                  <Upload className="h-4 w-4" /> {uploadingMain ? "Caricamento…" : "Carica file"}
                  <input type="file" accept="image/*" className="hidden" onChange={onMainImageUpload} />
                </label>
              </div>
              {p.image_url && (
                <div className="mt-3 h-32 w-fit overflow-hidden rounded-lg border border-border">
                  <MainPreview url={p.image_url} />
                </div>
              )}
            </F>

            <div>
              <h2 className="font-serif text-2xl">Galleria progetto</h2>
              <p className="mt-1 text-xs text-subtle">
                Le modifiche vengono applicate solo al salvataggio del progetto.
              </p>
              <div className="mt-5">
                <StagedMediaEditor projectSlug={p.slug ?? "unnamed"} media={media} setMedia={setMedia} />
              </div>
            </div>
          </div>
        )}

        {tab === "visibility" && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <F label="Visibilità" full>
              <div className="flex flex-wrap gap-4 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={!!p.is_visible} onChange={(e) => setP({ ...p, is_visible: e.target.checked })} />
                  Visibile al pubblico
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={!!p.is_featured} onChange={(e) => setP({ ...p, is_featured: e.target.checked })} />
                  Mostra in homepage (featured)
                </label>
              </div>
            </F>
            <F label="Sort order (più basso = prima)">
              <input type="number" value={p.sort_order ?? 100} onChange={(e) => setP({ ...p, sort_order: parseInt(e.target.value) || 0 })} className="admin-input" />
            </F>
          </div>
        )}

        {err && <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm">{err}</div>}
        {ok && <div className="rounded-lg border border-emerald-400/40 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">{ok}</div>}

        <div className="sticky bottom-0 flex flex-wrap items-center gap-3 border-t border-border bg-background/80 pt-4 backdrop-blur">
          <button type="submit" disabled={saving || !dirty} className="btn-primary disabled:opacity-50">
            {saving ? "Salvataggio…" : "Salva progetto"}
          </button>
          <button type="button" onClick={onCancel} className="btn-ghost">
            {mode === "new" ? "Annulla" : "Ripristina"}
          </button>
          {dirty && <span className="text-xs text-amber-200">Modifiche non salvate</span>}
        </div>
      </form>
    </div>
  );
}

function MainPreview({ url }: { url: string }) {
  const resolved = useResolvedUrl(url);
  if (!resolved) return <div className="h-full w-32 animate-pulse bg-white/[0.05]" />;
  return <img src={resolved} alt="anteprima" className="h-full w-auto object-cover" />;
}

/* ============ Staged Media Editor ============ */
function StagedMediaEditor({
  projectSlug,
  media,
  setMedia,
}: {
  projectSlug: string;
  media: StagedMedia[];
  setMedia: (m: StagedMedia[]) => void;
}) {
  const [type, setType] = useState<"image" | "video">("image");
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [alt, setAlt] = useState("");
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const visible = media.filter((m) => !m._deleted);

  function addStaged() {
    setErr(null);
    if (!url.trim()) { setErr("URL richiesto"); return; }
    const nextOrder = (visible[visible.length - 1]?.sort_order ?? 0) + 10;
    setMedia([
      ...media,
      {
        key: `new-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type,
        url: url.trim(),
        caption: caption.trim() || null,
        alt_text: alt.trim() || null,
        sort_order: nextOrder,
        _new: true,
      },
    ]);
    setUrl(""); setCaption(""); setAlt("");
  }

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setErr(null);
    try {
      const marker = await uploadToProjectImages(file, projectSlug);
      setUrl(marker);
      setType(file.type.startsWith("video/") ? "video" : "image");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Errore upload");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function moveVisible(vIdx: number, dir: -1 | 1) {
    const target = visible[vIdx];
    const swap = visible[vIdx + dir];
    if (!target || !swap) return;
    const a = target.sort_order;
    const b = swap.sort_order;
    setMedia(
      media.map((m) => {
        if (m.key === target.key) return { ...m, sort_order: b, _dirty: !m._new || m._dirty };
        if (m.key === swap.key) return { ...m, sort_order: a, _dirty: !m._new || m._dirty };
        return m;
      }).sort((x, y) => x.sort_order - y.sort_order),
    );
  }

  function removeItem(key: string) {
    setMedia(
      media
        .map((m) => {
          if (m.key !== key) return m;
          if (m._new) return { ...m, _deleted: true }; // filtered out anyway; simplest
          return { ...m, _deleted: true };
        })
        .filter((m) => !(m._new && m._deleted)),
    );
  }

  function patch(key: string, field: "caption" | "alt_text", value: string) {
    setMedia(
      media.map((m) =>
        m.key === key ? { ...m, [field]: value || null, _dirty: !m._new || m._dirty } : m,
      ),
    );
  }

  return (
    <div>
      <div className="glass-card rounded-2xl p-5">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[110px_1fr_auto]">
          <select value={type} onChange={(e) => setType(e.target.value as "image" | "video")} className="admin-input">
            <option value="image">Immagine</option>
            <option value="video">Video</option>
          </select>
          <input
            type="url" placeholder="URL o sb://…" value={url}
            onChange={(e) => setUrl(e.target.value)} className="admin-input"
          />
          <label className="btn-ghost cursor-pointer whitespace-nowrap">
            <Upload className="h-4 w-4" /> {uploading ? "Caricamento…" : "Carica file"}
            <input type="file" accept="image/*,video/*" className="hidden" onChange={upload} />
          </label>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input placeholder="Didascalia (opzionale)" value={caption} onChange={(e) => setCaption(e.target.value)} className="admin-input" />
          <input placeholder="Alt text (opzionale)" value={alt} onChange={(e) => setAlt(e.target.value)} className="admin-input" />
        </div>
        {err && <div className="mt-3 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm">{err}</div>}
        <div className="mt-3">
          <button type="button" onClick={addStaged} className="btn-primary">
            <Plus className="h-4 w-4" /> Aggiungi media (in coda)
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {visible.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
            Nessun media. Aggiungi immagini o video, poi salva il progetto.
          </div>
        )}
        {visible.map((m, i) => (
          <div key={m.key} className="glass-card flex flex-col gap-4 rounded-2xl p-4 sm:flex-row">
            <div className="w-full shrink-0 overflow-hidden rounded-lg border border-border sm:w-40">
              {m.type === "video" ? (
                <StorageVideo src={m.url} className="aspect-video w-full object-cover" />
              ) : (
                <StorageImage src={m.url} alt={m.alt_text ?? ""} className="aspect-video w-full object-cover" />
              )}
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2 text-xs text-subtle">
                <span className="rounded-full border border-border px-2 py-0.5 uppercase tracking-widest">{m.type}</span>
                {m._new && <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2 py-0.5 text-emerald-200">Nuovo (non salvato)</span>}
                {m._dirty && !m._new && <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-amber-200">Modificato</span>}
                <span className="truncate">{m.url}</span>
              </div>
              <input
                value={m.caption ?? ""} placeholder="Didascalia"
                onChange={(e) => patch(m.key, "caption", e.target.value)} className="admin-input"
              />
              <input
                value={m.alt_text ?? ""} placeholder="Alt text"
                onChange={(e) => patch(m.key, "alt_text", e.target.value)} className="admin-input"
              />
            </div>
            <div className="flex items-start gap-1">
              <button type="button" onClick={() => moveVisible(i, -1)} disabled={i === 0}
                className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30" aria-label="Sposta su">
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button type="button" onClick={() => moveVisible(i, 1)} disabled={i === visible.length - 1}
                className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30" aria-label="Sposta giù">
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
              <button type="button" onClick={() => removeItem(m.key)}
                className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-destructive" aria-label="Rimuovi">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function F({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? "lg:col-span-2" : undefined}>
      <label className="admin-label">{label}</label>
      {children}
    </div>
  );
}
