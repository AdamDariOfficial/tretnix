import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Upload, ArrowUp, ArrowDown, Trash2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { adminGetProject, adminUpsertProject, type Project } from "@/lib/projects";
import {
  listProjectMedia,
  adminAddMedia,
  adminUpdateMedia,
  adminDeleteMedia,
  adminSwapMediaOrder,
  type ProjectMedia,
} from "@/lib/project-media";

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

export const Route = createFileRoute("/admin/projects/new")({
  component: () => <ProjectForm mode="new" />,
});

export function ProjectForm({ mode, id }: { mode: "new" | "edit"; id?: string }) {
  const navigate = useNavigate();
  const [p, setP] = useState<Partial<Project> | null>(mode === "new" ? emptyProject() : null);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && id) {
      void adminGetProject(id).then((data) => {
        setP(data ?? emptyProject());
        setLoading(false);
      });
    }
  }, [mode, id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!p) return;
    setSaving(true);
    setErr(null);
    try {
      const payload = { ...p, slug: (p.slug || "").trim().toLowerCase() } as Partial<Project> & { slug: string; title: string };
      const saved = await adminUpsertProject(payload);
      navigate({ to: "/admin/projects/$id", params: { id: saved.id } });
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Errore salvataggio");
    } finally {
      setSaving(false);
    }
  }

  async function onImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !p) return;
    setUploading(true);
    setErr(null);
    try {
      const ext = file.name.split(".").pop() || "png";
      const path = `${(p.slug || "unnamed")}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("project-images").upload(path, file, {
        upsert: true,
        contentType: file.type,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("project-images").getPublicUrl(path);
      setP({ ...p, image_url: data.publicUrl });
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Errore upload");
    } finally {
      setUploading(false);
    }
  }

  if (loading || !p) return <div className="text-muted-foreground">Caricamento…</div>;

  const list = (key: keyof Project) => (p[key] as string[] | undefined)?.join("\n") ?? "";
  const setList = (key: keyof Project, v: string) =>
    setP({ ...p, [key]: v.split("\n").map((s) => s.trim()).filter(Boolean) });

  return (
    <div>
      <Link to="/admin/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Torna ai progetti
      </Link>
      <h1 className="mt-4 font-serif text-4xl">{mode === "new" ? "Nuovo progetto" : "Modifica progetto"}</h1>

      <form onSubmit={onSubmit} className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <F label="Slug (URL)">
          <input required value={p.slug ?? ""} onChange={(e) => setP({ ...p, slug: e.target.value })} className="admin-input" placeholder="es. mio-progetto" />
        </F>
        <F label="Titolo">
          <input required value={p.title ?? ""} onChange={(e) => setP({ ...p, title: e.target.value })} className="admin-input" />
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

        <F label="Gradient di sfondo card">
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
        <F label="Sort order (numerico, più basso = prima)">
          <input type="number" value={p.sort_order ?? 100} onChange={(e) => setP({ ...p, sort_order: parseInt(e.target.value) || 0 })} className="admin-input" />
        </F>

        <F label="Immagine di copertina (URL o upload)" full>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="url"
              placeholder="https://…"
              value={p.image_url ?? ""}
              onChange={(e) => setP({ ...p, image_url: e.target.value })}
              className="admin-input flex-1"
            />
            <label className="btn-ghost cursor-pointer">
              <Upload className="h-4 w-4" /> {uploading ? "Caricamento…" : "Carica file"}
              <input type="file" accept="image/*" className="hidden" onChange={onImageUpload} />
            </label>
          </div>
          {p.image_url && (
            <img src={p.image_url} alt="anteprima" className="mt-3 h-32 w-auto rounded-lg border border-border object-cover" />
          )}
        </F>

        <F label="Stato" full>
          <div className="flex flex-wrap gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={!!p.is_visible} onChange={(e) => setP({ ...p, is_visible: e.target.checked })} />
              Visibile al pubblico
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={!!p.is_featured} onChange={(e) => setP({ ...p, is_featured: e.target.checked })} />
              Mostra in homepage (featured)
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={!!p.is_concept} onChange={(e) => setP({ ...p, is_concept: e.target.checked })} />
              È un concept
            </label>
          </div>
        </F>

        {err && <div className="lg:col-span-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm">{err}</div>}

        <div className="lg:col-span-2 flex items-center gap-3">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Salvataggio…" : "Salva progetto"}
          </button>
          <Link to="/admin/projects" className="btn-ghost">Annulla</Link>
        </div>
      </form>

      {mode === "edit" && p.id && (
        <div className="mt-12 border-t border-border pt-10">
          <MediaEditor projectId={p.id} projectSlug={p.slug ?? "unnamed"} />
        </div>
      )}
    </div>
  );
}

/* ============ Media editor ============ */
function MediaEditor({ projectId, projectSlug }: { projectId: string; projectSlug: string }) {
  const [items, setItems] = useState<ProjectMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<"image" | "video">("image");
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [alt, setAlt] = useState("");
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function reload() {
    setLoading(true);
    try {
      setItems(await listProjectMedia(projectId));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { void reload(); }, [projectId]); // eslint-disable-line

  async function addMedia() {
    setErr(null);
    if (!url.trim()) { setErr("URL richiesto"); return; }
    try {
      const nextOrder = (items[items.length - 1]?.sort_order ?? 0) + 10;
      await adminAddMedia({
        project_id: projectId,
        type,
        url: url.trim(),
        caption: caption.trim() || null,
        alt_text: alt.trim() || null,
        sort_order: nextOrder,
      });
      setUrl(""); setCaption(""); setAlt("");
      await reload();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Errore");
    }
  }

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setErr(null);
    try {
      const ext = file.name.split(".").pop() || "png";
      const path = `${projectSlug}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("project-images").upload(path, file, {
        upsert: false, contentType: file.type,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("project-images").getPublicUrl(path);
      setUrl(data.publicUrl);
      setType(file.type.startsWith("video/") ? "video" : "image");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Errore upload");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function move(i: number, dir: -1 | 1) {
    const a = items[i]; const b = items[i + dir];
    if (!a || !b) return;
    await adminSwapMediaOrder(a, b);
    await reload();
  }
  async function remove(id: string) {
    if (!confirm("Rimuovere questo media?")) return;
    await adminDeleteMedia(id);
    await reload();
  }
  async function patch(id: string, field: "caption" | "alt_text", value: string) {
    await adminUpdateMedia(id, { [field]: value || null });
  }

  return (
    <div>
      <h2 className="font-serif text-3xl">Media progetto</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Immagini o video mostrati nella galleria della case study. Il primo appare per primo.
      </p>

      <div className="glass-card mt-6 rounded-2xl p-5">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[110px_1fr_auto]">
          <select value={type} onChange={(e) => setType(e.target.value as "image" | "video")} className="admin-input">
            <option value="image">Immagine</option>
            <option value="video">Video</option>
          </select>
          <input
            type="url" placeholder="https://…" value={url}
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
          <button type="button" onClick={addMedia} className="btn-primary">
            <Plus className="h-4 w-4" /> Aggiungi media
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {loading && <div className="text-muted-foreground">Caricamento…</div>}
        {!loading && items.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
            Nessun media aggiunto.
          </div>
        )}
        {items.map((m, i) => (
          <div key={m.id} className="glass-card flex flex-col gap-4 rounded-2xl p-4 sm:flex-row">
            <div className="w-full shrink-0 overflow-hidden rounded-lg border border-border sm:w-40">
              {m.type === "video" ? (
                <video src={m.url} className="aspect-video w-full object-cover" />
              ) : (
                <img src={m.url} alt={m.alt_text ?? ""} className="aspect-video w-full object-cover" />
              )}
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-subtle">
                <span className="rounded-full border border-border px-2 py-0.5 uppercase tracking-widest">{m.type}</span>
                <span className="truncate">{m.url}</span>
              </div>
              <input
                defaultValue={m.caption ?? ""} placeholder="Didascalia"
                onBlur={(e) => patch(m.id, "caption", e.target.value)} className="admin-input"
              />
              <input
                defaultValue={m.alt_text ?? ""} placeholder="Alt text"
                onBlur={(e) => patch(m.id, "alt_text", e.target.value)} className="admin-input"
              />
            </div>
            <div className="flex items-start gap-1">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0}
                className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30" aria-label="Sposta su">
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1}
                className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30" aria-label="Sposta giù">
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
              <button type="button" onClick={() => remove(m.id)}
                className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-destructive" aria-label="Elimina">
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
