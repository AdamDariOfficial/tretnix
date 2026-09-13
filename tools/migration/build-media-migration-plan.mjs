import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const exportDir = path.resolve(process.argv[2] ?? "");
const mediaRoot = path.resolve(process.argv[3] ?? "");
const outputDir = path.resolve(process.argv[4] ?? "");
if (!exportDir || !mediaRoot || !outputDir) {
  throw new Error(
    "Usage: node tools/migration/build-media-migration-plan.mjs <private-export-dir> <downloaded-project-images-root> <private-output-dir>",
  );
}

const PROTECTED_PORTFOLIO_SLUGS = new Set(["forno-lume", "rito-studio"]);
const MIME = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  mp4: "video/mp4",
  webm: "video/webm",
};

function readArray(name) {
  const file = path.join(exportDir, name);
  if (!fs.existsSync(file)) return [];
  const value = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!Array.isArray(value)) throw new Error(`${name} must be an array.`);
  return value;
}

function sqlString(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

function resolveLegacyFile(marker) {
  const legacyPath = marker.slice("sb://".length).replaceAll("/", path.sep);
  const source = path.resolve(mediaRoot, legacyPath);
  const allowedRoot = `${mediaRoot}${path.sep}`;
  if (!(source === mediaRoot || source.startsWith(allowedRoot))) {
    throw new Error(`Unsafe legacy media path: ${marker}`);
  }
  if (!fs.existsSync(source) || !fs.statSync(source).isFile()) {
    throw new Error(`Missing private media file: ${marker}`);
  }
  return source;
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

const projects = readArray("projects.json");
const mediaRows = readArray("project_media.json");
const projectSlugById = new Map(
  projects
    .filter((project) => typeof project?.id === "string" && typeof project?.slug === "string")
    .map((project) => [project.id, project.slug]),
);

const refs = [];
for (const project of projects) {
  if (
    typeof project?.slug === "string" &&
    !PROTECTED_PORTFOLIO_SLUGS.has(project.slug) &&
    typeof project.image_url === "string" &&
    project.image_url.startsWith("sb://")
  ) {
    refs.push({ kind: "project-cover", slug: project.slug, marker: project.image_url });
  }
}

for (const media of mediaRows) {
  if (typeof media?.url !== "string" || !media.url.startsWith("sb://")) continue;
  const slug = projectSlugById.get(media.project_id);
  if (!slug) throw new Error(`Media ${media.id} references unknown source project ${media.project_id}.`);
  refs.push({ kind: "project-media", id: media.id, slug, marker: media.url });
}

fs.mkdirSync(outputDir, { recursive: true });

const assetsByMarker = new Map();
for (const ref of refs) {
  if (assetsByMarker.has(ref.marker)) continue;

  const source = resolveLegacyFile(ref.marker);
  const extension = path.extname(source).slice(1).toLowerCase();
  const contentType = MIME[extension];
  if (!contentType) throw new Error(`Unsupported legacy media type: ${ref.marker}`);

  const assetId = crypto.randomUUID();
  const objectKey = `legacy-project-media/${assetId}.${extension === "jpeg" ? "jpg" : extension}`;
  const stat = fs.statSync(source);
  assetsByMarker.set(ref.marker, {
    assetId,
    source,
    objectKey,
    contentType,
    byteSize: stat.size,
    originalName: path.basename(source),
    sha256: sha256(source),
  });
}

const sql = ["BEGIN TRANSACTION;"];
const uploads = [];
const now = new Date().toISOString();

for (const [marker, asset] of assetsByMarker) {
  uploads.push({
    source: asset.source,
    objectKey: asset.objectKey,
    contentType: asset.contentType,
    byteSize: asset.byteSize,
    sha256: asset.sha256,
  });
  sql.push(`INSERT INTO media_assets(
  id,object_key,content_type,byte_size,original_name,created_at,updated_at
) VALUES(
  ${sqlString(asset.assetId)},${sqlString(asset.objectKey)},${sqlString(asset.contentType)},${asset.byteSize},
  ${sqlString(asset.originalName)},${sqlString(now)},${sqlString(now)}
)
ON CONFLICT(id) DO NOTHING;`);

  const matchingRefs = refs.filter((ref) => ref.marker === marker);
  for (const ref of matchingRefs) {
    if (ref.kind === "project-cover") {
      sql.push(`UPDATE projects
SET image_url=${sqlString(`media:${asset.assetId}`)},updated_at=${sqlString(now)}
WHERE slug=${sqlString(ref.slug)} AND image_url=${sqlString(marker)};`);
    } else {
      sql.push(`UPDATE project_media
SET media_asset_id=${sqlString(asset.assetId)},url=${sqlString(`media:${asset.assetId}`)},updated_at=${sqlString(now)}
WHERE id=${sqlString(ref.id)} AND url=${sqlString(marker)};`);
    }
  }
}

sql.push("COMMIT;");

const planPath = path.join(outputDir, "media-upload-plan.json");
const sqlPath = path.join(outputDir, "media-remap.sql");
const uploadScriptPath = path.join(outputDir, "Upload-R2Media.ps1");

fs.writeFileSync(planPath, `${JSON.stringify(uploads, null, 2)}\n`);
fs.writeFileSync(sqlPath, `${sql.join("\n")}\n`);

const escapedPlanPath = planPath.replaceAll("'", "''");
fs.writeFileSync(
  uploadScriptPath,
  `param(\n  [Parameter(Mandatory=$true)][string]$Bucket,\n  [Parameter(Mandatory=$true)][string]$Config\n)\n$ErrorActionPreference='Stop'\n$plan=Get-Content -LiteralPath '${escapedPlanPath}' -Raw | ConvertFrom-Json\nforeach($item in $plan){\n  $actual=(Get-FileHash -LiteralPath $item.source -Algorithm SHA256).Hash.ToLowerInvariant()\n  if($actual -ne $item.sha256){throw \"Local media hash mismatch: $($item.source)\"}\n  npx wrangler r2 object put \"$Bucket/$($item.objectKey)\" --file \"$($item.source)\" --content-type \"$($item.contentType)\" --remote --config $Config\n  if($LASTEXITCODE -ne 0){throw \"R2 upload failed: $($item.objectKey)\"}\n}\n`,
);

process.stderr.write(
  `Prepared ${uploads.length} deduplicated R2 uploads for ${refs.length} legacy references. Review outputs; this tool did not upload objects or modify D1.\n`,
);
