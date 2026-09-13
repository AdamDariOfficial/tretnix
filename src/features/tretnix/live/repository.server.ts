import { requireBinding } from "@/server/cloudflare/env.server";

export type Project = {
  id: string;
  slug: string;
  title: string;
  category: string;
  short_description: string;
  overview: string;
  problem: string;
  solution: string;
  audience: string;
  features: string[];
  impact_points: string[];
  modules: string[];
  workflow_steps: string[];
  customizations: string[];
  tech_stack: string[];
  image_url: string | null;
  gradient: string;
  badge: string | null;
  is_concept: boolean;
  is_visible: boolean;
  is_featured: boolean;
  sort_order: number;
};

export type ProjectVariantPlan = "START" | "BUSINESS" | "BUSINESS_PLUS";
export type ProjectVariant = {
  id: string;
  project_id: string;
  plan: ProjectVariantPlan;
  label: string;
  short_description: string;
  goal: string;
  demo_url: string | null;
  publish_status: "draft" | "published";
  features: string[];
  sort_order: number;
};

export type ProjectMedia = {
  id: string;
  project_id: string;
  type: "image" | "video";
  url: string;
  caption: string | null;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ContactStatus = "new" | "contacted" | "archived";
export type ContactRequest = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  business_name: string | null;
  needs: string[];
  starting_point: string | null;
  message: string;
  privacy_accepted: boolean;
  source_path: string | null;
  status: ContactStatus;
  created_at: string;
  updated_at: string;
};

export type SiteSettings = {
  contact_email: string;
  contact_phone: string;
  location: string;
  cta_email_subject: string;
};

export type AnalyticsEventRow = {
  event_type: string;
  path: string | null;
  project_slug: string | null;
  device_type: string | null;
  referrer_host: string | null;
  created_at: string;
};

type ProjectRow = Omit<
  Project,
  | "features"
  | "impact_points"
  | "modules"
  | "workflow_steps"
  | "customizations"
  | "tech_stack"
  | "is_concept"
  | "is_visible"
  | "is_featured"
> & {
  features_json: string;
  impact_points_json: string;
  modules_json: string;
  workflow_steps_json: string;
  customizations_json: string;
  tech_stack_json: string;
  is_concept: number;
  is_visible: number;
  is_featured: number;
};

type VariantRow = Omit<ProjectVariant, "features"> & { features_json: string };
type ContactRow = Omit<ContactRequest, "needs" | "privacy_accepted"> & {
  needs_json: string;
  privacy_accepted: number;
};

function db() {
  return requireBinding("TRETNIX_DB");
}

function parseList(value: string) {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    short_description: row.short_description,
    overview: row.overview,
    problem: row.problem,
    solution: row.solution,
    audience: row.audience,
    features: parseList(row.features_json),
    impact_points: parseList(row.impact_points_json),
    modules: parseList(row.modules_json),
    workflow_steps: parseList(row.workflow_steps_json),
    customizations: parseList(row.customizations_json),
    tech_stack: parseList(row.tech_stack_json),
    image_url: row.image_url,
    gradient: row.gradient,
    badge: row.badge,
    is_concept: Boolean(row.is_concept),
    is_visible: Boolean(row.is_visible),
    is_featured: Boolean(row.is_featured),
    sort_order: row.sort_order,
  };
}

function mapVariant(row: VariantRow): ProjectVariant {
  return {
    id: row.id,
    project_id: row.project_id,
    plan: row.plan,
    label: row.label,
    short_description: row.short_description,
    goal: row.goal,
    demo_url: row.demo_url,
    publish_status: row.publish_status,
    features: parseList(row.features_json),
    sort_order: row.sort_order,
  };
}

const PROJECT_SELECT = `
  id, slug, title, category, short_description, overview, problem, solution, audience,
  features_json, impact_points_json, modules_json, workflow_steps_json,
  customizations_json, tech_stack_json, image_url, gradient, badge,
  is_concept, is_visible, is_featured, sort_order
`;

const VARIANT_SELECT = `
  id, project_id, plan, label, short_description, goal, demo_url,
  publish_status, features_json, sort_order
`;

function mediaAssetId(marker: string | null | undefined) {
  return marker?.startsWith("media:") ? marker.slice("media:".length) : null;
}

async function assertMediaAssetExists(marker: string | null | undefined) {
  const id = mediaAssetId(marker);
  if (!id) return;
  const row = await db().prepare("SELECT id FROM media_assets WHERE id = ? LIMIT 1").bind(id).first<{ id: string }>();
  if (!row) throw new Error("Il media selezionato non esiste più.");
}

async function deleteMediaAssetIfUnreferenced(marker: string | null | undefined) {
  const id = mediaAssetId(marker);
  if (!id) return;

  const [galleryRef, projectRef] = await Promise.all([
    db().prepare("SELECT id FROM project_media WHERE url = ? LIMIT 1").bind(marker).first<{ id: string }>(),
    db().prepare("SELECT id FROM projects WHERE image_url = ? LIMIT 1").bind(marker).first<{ id: string }>(),
  ]);
  if (galleryRef || projectRef) return;

  const asset = await db()
    .prepare("SELECT object_key FROM media_assets WHERE id = ? LIMIT 1")
    .bind(id)
    .first<{ object_key: string }>();
  if (!asset) return;

  await db().prepare("DELETE FROM media_assets WHERE id = ?").bind(id).run();
  try {
    await requireBinding("TRETNIX_MEDIA").delete(asset.object_key);
  } catch {
    // D1 deletion is canonical. A later storage-cleanup pass may remove an orphaned R2 object.
  }
}

export async function listProjects(options: { featured?: boolean; admin?: boolean } = {}) {
  let sql = `SELECT ${PROJECT_SELECT} FROM projects`;
  const where: string[] = [];
  if (!options.admin) where.push("is_visible = 1");
  if (options.featured) where.push("is_featured = 1");
  if (where.length) sql += ` WHERE ${where.join(" AND ")}`;
  sql += " ORDER BY sort_order ASC";

  const result = await db().prepare(sql).all<ProjectRow>();
  return (result.results ?? []).map(mapProject);
}

export async function getProjectBySlug(slug: string, admin = false) {
  const row = await db()
    .prepare(`SELECT ${PROJECT_SELECT} FROM projects WHERE slug = ? ${admin ? "" : "AND is_visible = 1"} LIMIT 1`)
    .bind(slug)
    .first<ProjectRow>();
  return row ? mapProject(row) : null;
}

export async function getProjectById(id: string) {
  const row = await db()
    .prepare(`SELECT ${PROJECT_SELECT} FROM projects WHERE id = ? LIMIT 1`)
    .bind(id)
    .first<ProjectRow>();
  return row ? mapProject(row) : null;
}

export async function upsertProject(input: Partial<Project> & { slug: string; title: string }) {
  const existing = input.id ? await getProjectById(input.id) : null;
  const id = existing?.id ?? crypto.randomUUID();
  const merged: Project = {
    id,
    slug: input.slug,
    title: input.title,
    category: input.category ?? existing?.category ?? "Gestionale",
    short_description: input.short_description ?? existing?.short_description ?? "",
    overview: input.overview ?? existing?.overview ?? "",
    problem: input.problem ?? existing?.problem ?? "",
    solution: input.solution ?? existing?.solution ?? "",
    audience: input.audience ?? existing?.audience ?? "",
    features: input.features ?? existing?.features ?? [],
    impact_points: input.impact_points ?? existing?.impact_points ?? [],
    modules: input.modules ?? existing?.modules ?? [],
    workflow_steps: input.workflow_steps ?? existing?.workflow_steps ?? [],
    customizations: input.customizations ?? existing?.customizations ?? [],
    tech_stack: input.tech_stack ?? existing?.tech_stack ?? [],
    image_url: input.image_url ?? existing?.image_url ?? null,
    gradient:
      input.gradient ??
      existing?.gradient ??
      "bg-[radial-gradient(ellipse_at_top,#0B2A4A,#020814_70%),linear-gradient(135deg,#061326,#020814)]",
    badge: input.badge ?? existing?.badge ?? "Concept Tretnix",
    is_concept: input.is_concept ?? existing?.is_concept ?? true,
    is_visible: input.is_visible ?? existing?.is_visible ?? true,
    is_featured: input.is_featured ?? existing?.is_featured ?? false,
    sort_order: input.sort_order ?? existing?.sort_order ?? 100,
  };

  await assertMediaAssetExists(merged.image_url);

  const now = new Date().toISOString();
  const values = [
    merged.slug,
    merged.title,
    merged.category,
    merged.short_description,
    merged.overview,
    merged.problem,
    merged.solution,
    merged.audience,
    JSON.stringify(merged.features),
    JSON.stringify(merged.impact_points),
    JSON.stringify(merged.modules),
    JSON.stringify(merged.workflow_steps),
    JSON.stringify(merged.customizations),
    JSON.stringify(merged.tech_stack),
    merged.image_url,
    merged.gradient,
    merged.badge,
    merged.is_concept ? 1 : 0,
    merged.is_visible ? 1 : 0,
    merged.is_featured ? 1 : 0,
    merged.sort_order,
  ];

  if (existing) {
    await db()
      .prepare(`
        UPDATE projects SET
          slug=?, title=?, category=?, short_description=?, overview=?, problem=?, solution=?, audience=?,
          features_json=?, impact_points_json=?, modules_json=?, workflow_steps_json=?, customizations_json=?,
          tech_stack_json=?, image_url=?, gradient=?, badge=?, is_concept=?, is_visible=?, is_featured=?,
          sort_order=?, updated_at=?
        WHERE id=?
      `)
      .bind(...values, now, id)
      .run();
  } else {
    await db()
      .prepare(`
        INSERT INTO projects(
          id, slug, title, category, short_description, overview, problem, solution, audience,
          features_json, impact_points_json, modules_json, workflow_steps_json, customizations_json,
          tech_stack_json, image_url, gradient, badge, is_concept, is_visible, is_featured,
          sort_order, created_at, updated_at
        ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `)
      .bind(id, ...values, now, now)
      .run();
  }

  if (existing?.image_url && existing.image_url !== merged.image_url) {
    await deleteMediaAssetIfUnreferenced(existing.image_url);
  }

  return (await getProjectById(id))!;
}

export async function deleteProject(id: string) {
  const project = await getProjectById(id);
  const media = await listMedia(id);
  await db().prepare("DELETE FROM projects WHERE id = ?").bind(id).run();

  const markers = new Set<string>();
  if (project?.image_url) markers.add(project.image_url);
  for (const item of media) markers.add(item.url);
  for (const marker of markers) await deleteMediaAssetIfUnreferenced(marker);
}

export async function patchProjectFlags(
  id: string,
  patch: { is_visible?: boolean; is_featured?: boolean; sort_order?: number },
) {
  const sets: string[] = [];
  const values: unknown[] = [];
  if (patch.is_visible !== undefined) {
    sets.push("is_visible = ?");
    values.push(patch.is_visible ? 1 : 0);
  }
  if (patch.is_featured !== undefined) {
    sets.push("is_featured = ?");
    values.push(patch.is_featured ? 1 : 0);
  }
  if (patch.sort_order !== undefined) {
    sets.push("sort_order = ?");
    values.push(patch.sort_order);
  }
  if (!sets.length) return;

  sets.push("updated_at = ?");
  values.push(new Date().toISOString(), id);
  await db().prepare(`UPDATE projects SET ${sets.join(", ")} WHERE id = ?`).bind(...values).run();
}

export async function listVariants(projectId: string, admin = false) {
  if (!admin) {
    const project = await getProjectById(projectId);
    if (!project?.is_visible) return [];
  }
  const result = await db()
    .prepare(
      `SELECT ${VARIANT_SELECT} FROM project_variants WHERE project_id = ? ${admin ? "" : "AND publish_status = 'published'"} ORDER BY sort_order ASC`,
    )
    .bind(projectId)
    .all<VariantRow>();
  return (result.results ?? []).map(mapVariant);
}

export async function replaceVariants(projectId: string, variants: ProjectVariant[]) {
  const project = await getProjectById(projectId);
  if (!project) throw new Error("Progetto non trovato.");

  const now = new Date().toISOString();
  const statements = [db().prepare("DELETE FROM project_variants WHERE project_id = ?").bind(projectId)];
  for (const item of variants) {
    const status = item.plan === "BUSINESS_PLUS" ? "draft" : item.publish_status;
    statements.push(
      db()
        .prepare(`
          INSERT INTO project_variants(
            id, project_id, plan, label, short_description, goal, features_json,
            demo_url, publish_status, sort_order, created_at, updated_at
          ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)
        `)
        .bind(
          item.id || crypto.randomUUID(),
          projectId,
          item.plan,
          item.label,
          item.short_description,
          item.goal,
          JSON.stringify(item.features),
          item.demo_url,
          status,
          item.sort_order,
          now,
          now,
        ),
    );
  }
  await db().batch(statements);
}

export async function listMedia(projectId: string) {
  const result = await db()
    .prepare(
      "SELECT id,project_id,type,url,caption,alt_text,sort_order,created_at,updated_at FROM project_media WHERE project_id=? ORDER BY sort_order ASC",
    )
    .bind(projectId)
    .all<ProjectMedia>();
  return result.results ?? [];
}

export async function addMedia(input: Omit<ProjectMedia, "id" | "created_at" | "updated_at">) {
  const project = await getProjectById(input.project_id);
  if (!project) throw new Error("Progetto non trovato.");
  await assertMediaAssetExists(input.url);

  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  await db()
    .prepare(
      "INSERT INTO project_media(id,project_id,media_asset_id,type,url,caption,alt_text,sort_order,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?)",
    )
    .bind(
      id,
      input.project_id,
      mediaAssetId(input.url),
      input.type,
      input.url,
      input.caption,
      input.alt_text,
      input.sort_order,
      now,
      now,
    )
    .run();

  return (await db()
    .prepare(
      "SELECT id,project_id,type,url,caption,alt_text,sort_order,created_at,updated_at FROM project_media WHERE id=?",
    )
    .bind(id)
    .first<ProjectMedia>())!;
}

export async function updateMedia(
  id: string,
  patch: Partial<Pick<ProjectMedia, "url" | "caption" | "alt_text" | "sort_order" | "type">>,
) {
  const existing = await db()
    .prepare("SELECT url FROM project_media WHERE id = ? LIMIT 1")
    .bind(id)
    .first<{ url: string }>();
  if (!existing) throw new Error("Media non trovato.");

  if (patch.url !== undefined) await assertMediaAssetExists(patch.url);

  const sets: string[] = [];
  const values: unknown[] = [];
  if (patch.url !== undefined) {
    sets.push("url = ?", "media_asset_id = ?");
    values.push(patch.url, mediaAssetId(patch.url));
  }
  for (const key of ["caption", "alt_text", "sort_order", "type"] as const) {
    if (patch[key] !== undefined) {
      sets.push(`${key} = ?`);
      values.push(patch[key]);
    }
  }
  if (!sets.length) return;

  sets.push("updated_at = ?");
  values.push(new Date().toISOString(), id);
  await db().prepare(`UPDATE project_media SET ${sets.join(", ")} WHERE id = ?`).bind(...values).run();

  if (patch.url !== undefined && patch.url !== existing.url) {
    await deleteMediaAssetIfUnreferenced(existing.url);
  }
}

export async function deleteMedia(id: string) {
  const row = await db()
    .prepare("SELECT url FROM project_media WHERE id = ? LIMIT 1")
    .bind(id)
    .first<{ url: string }>();
  if (!row) return;

  await db().prepare("DELETE FROM project_media WHERE id = ?").bind(id).run();
  await deleteMediaAssetIfUnreferenced(row.url);
}

export async function getSettings() {
  const row = await db()
    .prepare("SELECT contact_email,contact_phone,location,cta_email_subject FROM site_settings WHERE id=1")
    .first<SiteSettings>();
  if (!row) throw new Error("Impostazioni sito non inizializzate.");
  return row;
}

export async function updateSettings(settings: SiteSettings) {
  await db()
    .prepare(
      "UPDATE site_settings SET contact_email=?,contact_phone=?,location=?,cta_email_subject=?,updated_at=? WHERE id=1",
    )
    .bind(
      settings.contact_email,
      settings.contact_phone,
      settings.location,
      settings.cta_email_subject,
      new Date().toISOString(),
    )
    .run();
  return getSettings();
}

export async function listContacts() {
  const result = await db()
    .prepare(
      "SELECT id,full_name,email,phone,business_name,needs_json,starting_point,message,privacy_accepted,source_path,status,created_at,updated_at FROM contact_requests ORDER BY created_at DESC",
    )
    .all<ContactRow>();

  return (result.results ?? []).map(
    (row): ContactRequest => ({
      id: row.id,
      full_name: row.full_name,
      email: row.email,
      phone: row.phone,
      business_name: row.business_name,
      needs: parseList(row.needs_json),
      starting_point: row.starting_point,
      message: row.message,
      privacy_accepted: Boolean(row.privacy_accepted),
      source_path: row.source_path,
      status: row.status,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }),
  );
}

export async function updateContactStatus(id: string, status: ContactStatus) {
  await db()
    .prepare("UPDATE contact_requests SET status=?,updated_at=? WHERE id=?")
    .bind(status, new Date().toISOString(), id)
    .run();
}

export async function deleteContact(id: string) {
  await db().prepare("DELETE FROM contact_requests WHERE id=?").bind(id).run();
}

export async function analyticsSince(since: string) {
  const result = await db()
    .prepare(
      "SELECT event_type,path,project_slug,device_type,referrer_host,created_at FROM analytics_events WHERE created_at>=? ORDER BY created_at DESC LIMIT 5000",
    )
    .bind(since)
    .all<AnalyticsEventRow>();
  return result.results ?? [];
}

export async function dashboardStats() {
  const since = new Date(Date.now() - 7 * 86_400_000).toISOString();
  const [all, visible, featured, events] = await Promise.all([
    db().prepare("SELECT COUNT(*) c FROM projects").first<{ c: number }>(),
    db().prepare("SELECT COUNT(*) c FROM projects WHERE is_visible=1").first<{ c: number }>(),
    db().prepare("SELECT COUNT(*) c FROM projects WHERE is_featured=1").first<{ c: number }>(),
    db().prepare("SELECT COUNT(*) c FROM analytics_events WHERE created_at>=?").bind(since).first<{ c: number }>(),
  ]);
  return {
    projects: all?.c ?? 0,
    visible: visible?.c ?? 0,
    featured: featured?.c ?? 0,
    events7d: events?.c ?? 0,
  };
}
