import fs from "node:fs";
import path from "node:path";

const inputDir = path.resolve(process.argv[2] ?? "");
if (!inputDir || !fs.existsSync(inputDir)) {
  throw new Error(
    "Usage: node tools/migration/build-d1-import-sql.mjs <private-export-directory>",
  );
}

const PROTECTED_PORTFOLIO_SLUGS = new Set(["forno-lume", "rito-studio"]);
const ANALYTICS_EVENTS = new Set([
  "page_view",
  "cta_click",
  "email_click",
  "phone_click",
  "case_study_view",
  "project_card_click",
  "contact_form_submit",
]);
const DEVICES = new Set(["mobile", "tablet", "desktop"]);

function read(name) {
  const file = path.join(inputDir, name);
  if (!fs.existsSync(file)) return [];
  const value = JSON.parse(fs.readFileSync(file, "utf8"));
  return Array.isArray(value) ? value : value ? [value] : [];
}

function sqlString(value) {
  return value == null ? "NULL" : `'${String(value).replaceAll("'", "''")}'`;
}

function bool(value) {
  return value ? 1 : 0;
}

function list(value) {
  return JSON.stringify(Array.isArray(value) ? value : []);
}

function intOr(value, fallback) {
  return Number.isInteger(value) ? value : fallback;
}

function nowFallback(value) {
  return value || new Date().toISOString();
}

const siteSettings = read("site_settings.json");
const projects = read("projects.json");
const projectMedia = read("project_media.json");
const contacts = read("contact_requests.json");
const analytics = read("analytics_events.json");

const sourceProjectSlugById = new Map();
for (const project of projects) {
  if (typeof project?.id === "string" && typeof project?.slug === "string") {
    sourceProjectSlugById.set(project.id, project.slug);
  }
}

const lines = ["PRAGMA foreign_keys = ON;", "BEGIN TRANSACTION;"];

for (const settings of siteSettings) {
  lines.push(`INSERT INTO site_settings(
  id,contact_email,contact_phone,location,cta_email_subject,updated_at
) VALUES(
  1,${sqlString(settings.contact_email)},${sqlString(settings.contact_phone)},${sqlString(settings.location)},${sqlString(settings.cta_email_subject)},${sqlString(nowFallback(settings.updated_at))}
)
ON CONFLICT(id) DO UPDATE SET
  contact_email=excluded.contact_email,
  contact_phone=excluded.contact_phone,
  location=excluded.location,
  cta_email_subject=excluded.cta_email_subject,
  updated_at=excluded.updated_at;`);
}

for (const project of projects) {
  if (!project?.id || !project?.slug || !project?.title) {
    throw new Error("projects.json contains a row without id, slug or title.");
  }

  if (PROTECTED_PORTFOLIO_SLUGS.has(project.slug)) {
    // Portfolio V1 content is versioned by this package. Legacy rows with the same slug are not
    // allowed to overwrite the approved Forno Lume / RITO Studio family content.
    continue;
  }

  lines.push(`INSERT INTO projects(
  id,slug,title,category,short_description,overview,problem,solution,audience,
  features_json,impact_points_json,modules_json,workflow_steps_json,customizations_json,
  tech_stack_json,image_url,gradient,badge,is_concept,is_visible,is_featured,sort_order,
  created_at,updated_at
) VALUES(
  ${sqlString(project.id)},${sqlString(project.slug)},${sqlString(project.title)},${sqlString(project.category ?? "Gestionale")},
  ${sqlString(project.short_description ?? "")},${sqlString(project.overview ?? "")},${sqlString(project.problem ?? "")},
  ${sqlString(project.solution ?? "")},${sqlString(project.audience ?? "")},${sqlString(list(project.features))},
  ${sqlString(list(project.impact_points))},${sqlString(list(project.modules))},${sqlString(list(project.workflow_steps))},
  ${sqlString(list(project.customizations))},${sqlString(list(project.tech_stack))},${sqlString(project.image_url)},
  ${sqlString(project.gradient ?? "")},${sqlString(project.badge)},${bool(project.is_concept)},${bool(project.is_visible)},0,
  ${intOr(project.sort_order, 100)},${sqlString(nowFallback(project.created_at))},${sqlString(nowFallback(project.updated_at))}
)
ON CONFLICT(slug) DO UPDATE SET
  title=excluded.title,
  category=excluded.category,
  short_description=excluded.short_description,
  overview=excluded.overview,
  problem=excluded.problem,
  solution=excluded.solution,
  audience=excluded.audience,
  features_json=excluded.features_json,
  impact_points_json=excluded.impact_points_json,
  modules_json=excluded.modules_json,
  workflow_steps_json=excluded.workflow_steps_json,
  customizations_json=excluded.customizations_json,
  tech_stack_json=excluded.tech_stack_json,
  image_url=excluded.image_url,
  gradient=excluded.gradient,
  badge=excluded.badge,
  is_concept=excluded.is_concept,
  is_visible=excluded.is_visible,
  is_featured=0,
  sort_order=excluded.sort_order,
  updated_at=excluded.updated_at;`);
}

for (const media of projectMedia) {
  if (!media?.id || !media?.project_id || !["image", "video"].includes(media.type)) {
    throw new Error("project_media.json contains an invalid row.");
  }

  const sourceSlug = sourceProjectSlugById.get(media.project_id);
  if (!sourceSlug) {
    throw new Error(`Media ${media.id} references unknown source project ${media.project_id}.`);
  }

  const targetProjectId = `(SELECT id FROM projects WHERE slug=${sqlString(sourceSlug)} LIMIT 1)`;
  lines.push(`INSERT INTO project_media(
  id,project_id,media_asset_id,type,url,caption,alt_text,sort_order,created_at,updated_at
) VALUES(
  ${sqlString(media.id)},${targetProjectId},NULL,${sqlString(media.type)},${sqlString(media.url)},
  ${sqlString(media.caption)},${sqlString(media.alt_text)},${intOr(media.sort_order, 0)},
  ${sqlString(nowFallback(media.created_at))},${sqlString(nowFallback(media.updated_at ?? media.created_at))}
)
ON CONFLICT(id) DO NOTHING;`);
}

for (const contact of contacts) {
  if (!contact?.id || !contact?.full_name || !contact?.email || !contact?.message) {
    throw new Error("contact_requests.json contains an invalid row.");
  }
  const status = ["new", "contacted", "archived"].includes(contact.status)
    ? contact.status
    : "new";
  lines.push(`INSERT INTO contact_requests(
  id,submission_key,full_name,email,phone,business_name,needs_json,starting_point,message,
  privacy_accepted,source_path,status,created_at,updated_at
) VALUES(
  ${sqlString(contact.id)},${sqlString(`legacy:${contact.id}`)},${sqlString(contact.full_name)},${sqlString(contact.email)},
  ${sqlString(contact.phone)},${sqlString(contact.business_name)},${sqlString(list(contact.needs))},${sqlString(contact.starting_point)},
  ${sqlString(contact.message)},${bool(contact.privacy_accepted)},${sqlString(contact.source_path)},${sqlString(status)},
  ${sqlString(nowFallback(contact.created_at))},${sqlString(nowFallback(contact.updated_at ?? contact.created_at))}
)
ON CONFLICT(id) DO NOTHING;`);
}

let skippedAnalytics = 0;
for (const event of analytics) {
  if (!ANALYTICS_EVENTS.has(event?.event_type)) {
    skippedAnalytics += 1;
    continue;
  }
  const device = DEVICES.has(event.device_type) ? event.device_type : null;
  const viewport = Number.isInteger(event.viewport_width) ? event.viewport_width : null;
  lines.push(`INSERT INTO analytics_events(
  event_type,path,project_slug,referrer_host,device_type,viewport_width,created_at
) VALUES(
  ${sqlString(event.event_type)},${sqlString(event.path)},${sqlString(event.project_slug)},${sqlString(event.referrer_host)},
  ${sqlString(device)},${viewport === null ? "NULL" : viewport},${sqlString(nowFallback(event.created_at))}
);`);
}

lines.push("COMMIT;");
process.stdout.write(`${lines.join("\n")}\n`);
process.stderr.write(
  `Prepared private D1 import SQL: ${projects.length} source projects, ${projectMedia.length} media rows, ${contacts.length} contact rows, ${analytics.length - skippedAnalytics} analytics rows. ` +
    `${skippedAnalytics} unsupported analytics rows skipped. Input files are read locally only; do not commit exports or generated SQL containing PII.\n`,
);
