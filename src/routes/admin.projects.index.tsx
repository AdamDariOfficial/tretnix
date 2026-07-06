import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Star, StarOff, Trash2, ArrowUp, ArrowDown, Plus, Pencil } from "lucide-react";
import {
  adminListProjects,
  adminSetVisibility,
  adminSetFeatured,
  adminDeleteProject,
  adminUpdateOrder,
  type Project,
} from "@/lib/projects";

export const Route = createFileRoute("/admin/projects/")({
  component: AdminProjectsList,
});

function AdminProjectsList() {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  async function reload() {
    setLoading(true);
    setItems(await adminListProjects());
    setLoading(false);
  }

  useEffect(() => {
    void reload();
  }, []);

  async function move(id: string, dir: -1 | 1) {
    const idx = items.findIndex((p) => p.id === id);
    const swap = items[idx + dir];
    if (!swap) return;
    const a = items[idx];
    await Promise.all([
      adminUpdateOrder(a.id, swap.sort_order),
      adminUpdateOrder(swap.id, a.sort_order),
    ]);
    await reload();
  }

  async function toggleVisible(p: Project) {
    await adminSetVisibility(p.id, !p.is_visible);
    await reload();
  }
  async function toggleFeatured(p: Project) {
    await adminSetFeatured(p.id, !p.is_featured);
    await reload();
  }
  async function remove(p: Project) {
    if (!confirm(`Eliminare il progetto "${p.title}"? L'operazione è irreversibile.`)) return;
    await adminDeleteProject(p.id);
    await reload();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-4xl">Progetti</h1>
          <p className="mt-2 text-muted-foreground">
            Solo i progetti visibili + featured appaiono in homepage (max 2). Tutti i visibili appaiono su /case-studies.
          </p>
        </div>
        <Link to="/admin/projects/new" className="btn-primary">
          <Plus className="h-4 w-4" /> Nuovo progetto
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border">
        <table className="min-w-full text-sm">
          <thead className="bg-white/[0.03] text-left text-xs uppercase tracking-widest text-subtle">
            <tr>
              <th className="px-4 py-3">Ordine</th>
              <th className="px-4 py-3">Titolo</th>
              <th className="px-4 py-3 hidden md:table-cell">Categoria</th>
              <th className="px-4 py-3">Visibile</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3 text-right">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  Caricamento…
                </td>
              </tr>
            )}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  Nessun progetto. Creane uno per iniziare.
                </td>
              </tr>
            )}
            {items.map((p, i) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      className="rounded-md border border-border p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                      disabled={i === 0}
                      onClick={() => move(p.id, -1)}
                      aria-label="Sposta su"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      className="rounded-md border border-border p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                      disabled={i === items.length - 1}
                      onClick={() => move(p.id, 1)}
                      aria-label="Sposta giù"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <span className="ml-2 text-xs text-subtle">{p.sort_order}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium">{p.title}</div>
                  <div className="text-xs text-subtle">/{p.slug}</div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{p.category}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleVisible(p)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${
                      p.is_visible
                        ? "border-primary/40 bg-primary/10 text-primary-glow"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {p.is_visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    {p.is_visible ? "Visibile" : "Nascosto"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleFeatured(p)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${
                      p.is_featured
                        ? "border-primary/40 bg-primary/10 text-primary-glow"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {p.is_featured ? <Star className="h-3.5 w-3.5" /> : <StarOff className="h-3.5 w-3.5" />}
                    {p.is_featured ? "In home" : "No"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      to="/admin/projects/$id"
                      params={{ id: p.id }}
                      className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-foreground"
                      aria-label="Modifica"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                    <button
                      onClick={() => remove(p)}
                      className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-destructive"
                      aria-label="Elimina"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
