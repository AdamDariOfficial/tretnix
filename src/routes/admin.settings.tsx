import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { refreshSiteSettings, type SiteSettings } from "@/lib/site-settings";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const [s, setS] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    void supabase
      .from("site_settings")
      .select("contact_email,contact_phone,location,cta_email_subject")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => setS((data as SiteSettings) ?? null));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!s) return;
    setSaving(true);
    setMsg(null);
    setErr(null);
    const { error } = await supabase.from("site_settings").update(s).eq("id", 1);
    setSaving(false);
    if (error) setErr(error.message);
    else {
      setMsg("Impostazioni salvate.");
      await refreshSiteSettings();
    }
  }

  if (!s) return <div className="text-muted-foreground">Caricamento…</div>;

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-4xl">Impostazioni sito</h1>
      <p className="mt-2 text-muted-foreground">
        Queste informazioni vengono usate nel footer, nei pulsanti CTA e nei link email/telefono.
      </p>

      <form onSubmit={save} className="mt-8 space-y-5">
        <Field label="Email di contatto">
          <input
            type="email"
            required
            value={s.contact_email}
            onChange={(e) => setS({ ...s, contact_email: e.target.value })}
            className="admin-input"
          />
        </Field>
        <Field label="Telefono">
          <input
            type="tel"
            required
            value={s.contact_phone}
            onChange={(e) => setS({ ...s, contact_phone: e.target.value })}
            className="admin-input"
          />
        </Field>
        <Field label="Sede">
          <input
            type="text"
            required
            value={s.location}
            onChange={(e) => setS({ ...s, location: e.target.value })}
            className="admin-input"
          />
        </Field>
        <Field label="Oggetto email per CTA (mailto)">
          <input
            type="text"
            required
            value={s.cta_email_subject}
            onChange={(e) => setS({ ...s, cta_email_subject: e.target.value })}
            className="admin-input"
          />
        </Field>

        {err && <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm">{err}</div>}
        {msg && <div className="rounded-lg border border-primary-glow/30 bg-primary/10 px-3 py-2 text-sm">{msg}</div>}

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Salvataggio…" : "Salva modifiche"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="admin-label">{label}</label>
      {children}
    </div>
  );
}
