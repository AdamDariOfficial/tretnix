import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function fail(message) {
  throw new Error(message);
}

function read(relative) {
  const pathname = path.join(root, relative);
  if (!fs.existsSync(pathname)) fail(`Missing required source file: ${relative}`);
  return fs.readFileSync(pathname, "utf8");
}

function requireText(relative, needles) {
  const content = read(relative);
  for (const needle of needles) {
    if (!content.includes(needle)) fail(`${relative} is missing required contract marker: ${needle}`);
  }
  return content;
}

const coreMigration = requireText("migrations/0001_tretnix_core.sql", [
  "CREATE TABLE IF NOT EXISTS projects",
  "CREATE TABLE IF NOT EXISTS project_variants",
  "CREATE TABLE IF NOT EXISTS project_media",
  "CREATE TABLE IF NOT EXISTS media_assets",
  "CREATE TABLE IF NOT EXISTS contact_requests",
  "CREATE TABLE IF NOT EXISTS analytics_events",
  "CHECK (plan <> 'BUSINESS_PLUS' OR publish_status = 'draft')",
  "https://forno-lume.tretnix.com/",
  "https://forno-lume-business.tretnix.com/",
  "https://rito-studio.tretnix.com/",
  "https://rito-studio-business.tretnix.com/",
]);

const variantSeedSection = coreMigration.split("INSERT INTO project_variants")[1]?.split("ON CONFLICT")[0] ?? "";
const forbiddenPublishedPlus = /'BUSINESS_PLUS'[\s\S]{0,600}'published'/i;
if (forbiddenPublishedPlus.test(variantSeedSection)) {
  fail("Core migration contains a BUSINESS_PLUS seed that appears to be published.");
}

requireText("migrations/0002_native_admin_auth.sql", [
  "CREATE TABLE IF NOT EXISTS admin_users",
  "CREATE TABLE IF NOT EXISTS admin_sessions",
]);

const envSource = requireText("src/server/cloudflare/env.server.ts", [
  "TRETNIX_DB",
  "TRETNIX_MEDIA",
  "ADMIN_LOGIN_RATE_LIMITER",
  "CONTACT_SUBMIT_RATE_LIMITER",
  "ANALYTICS_RATE_LIMITER",
  "ADMIN_AUTH_PEPPER",
  "ADMIN_AUTH_CSRF_SECRET",
]);
if (envSource.includes("PUBLIC_WRITE_RATE_LIMITER")) {
  fail("Legacy shared PUBLIC_WRITE_RATE_LIMITER marker remains in Cloudflare env source.");
}

requireText("src/server/cloudflare/admin-auth-crypto.server.ts", [
  "scrypt-n16384-r8-p5-hmac-sha256-pepper-v2",
  "timingSafeEqual",
  "tretnix-admin-csrf-v1",
]);
requireText("src/server/cloudflare/admin-auth.server.ts", [
  "__Host-tretnix_admin_session",
  "SameSite=Strict",
  "requireBinding(\"ADMIN_LOGIN_RATE_LIMITER\")",
  "requireAuthSecret(\"ADMIN_AUTH_PEPPER\")",
  "requireAuthSecret(\"ADMIN_AUTH_CSRF_SECRET\")",
]);
requireText("src/server/cloudflare/api.server.ts", [
  "ON CONFLICT(submission_key) DO NOTHING",
  "CONTACT_SUBMIT_RATE_LIMITER",
  "ANALYTICS_RATE_LIMITER",
  "sec-fetch-site",
  "x-content-type-options",
]);
requireText("src/features/tretnix/profile.ts", [
  "VITE_TRETNIX_BACKEND_PROFILE",
  "local",
  "live",
]);
requireText("src/features/tretnix/local/admin-auth.server.ts", [
  "isTretnixLocalDevelopment",
  "local-admin@tretnix.invalid",
]);
requireText("src/features/tretnix/local/repository.server.ts", [
  "portfolio-forno-lume",
  "portfolio-rito-studio",
  "BUSINESS_PLUS",
]);
const serverSource = requireText("src/server.ts", [
  "isTretnixLive",
  "handleTretnixApi",
  'import("./server/cloudflare/api.server")',
]);
if (/^import\s+\{?\s*handleTretnixApi/m.test(serverSource)) {
  fail("src/server.ts must lazy-load the Cloudflare API only in the live profile.");
}
requireText("src/features/tretnix/live.functions.ts", [
  "requireAdminCsrf",
  "BUSINESS PLUS must remain draft in Portfolio V1.",
  "if (!project?.is_visible) return [];",
]);
requireText("src/features/tretnix/live/repository.server.ts", [
  "deleteMediaAssetIfUnreferenced",
  "assertMediaAssetExists",
  "TRETNIX_MEDIA",
]);

const sourceWrangler = requireText("wrangler.jsonc", [
  "tretnix-unprovisioned-do-not-deploy",
  "nodejs_compat",
  '"TRETNIX_ENV": "unprovisioned"',
]);
for (const forbidden of ["database_id", "bucket_name", "ADMIN_AUTH_PEPPER", "ADMIN_AUTH_CSRF_SECRET"]) {
  if (sourceWrangler.includes(forbidden)) {
    fail(`Source wrangler.jsonc must remain unprovisioned; found ${forbidden}.`);
  }
}

requireText("tools/cloudflare/build-environment.mjs", [
  "tretnix-cloudflare-build.json",
  'VITE_TRETNIX_BACKEND_PROFILE: "live"',
  'profile: "live"',
  "NO DEPLOY PERFORMED",
]);
requireText("tools/cloudflare/prepare-environment-config.mjs", [
  "wrangler.${environment}.json",
  'buildStamp?.profile !== "live"',
  "secrets",
  "ratelimits",
]);
requireText("tools/migration/build-d1-import-sql.mjs", [
  "PROTECTED_PORTFOLIO_SLUGS",
  "sourceProjectSlugById",
  "is_featured=0",
]);
requireText("tools/migration/build-media-migration-plan.mjs", [
  "media-upload-plan.json",
  "media-remap.sql",
  "sha256",
]);
requireText("CLOUDFLARE_RUNBOOK.md", [
  "Legacy Supabase data",
  "Native admin provisioning",
  "Required evidence before declaring the migration complete",
]);

const runtimeRoots = [path.join(root, "src")];
const allowedLegacyRoot = path.normalize(path.join(root, "src", "integrations", "supabase"));
const runtimeSupabaseHits = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const pathname = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (path.normalize(pathname) === allowedLegacyRoot) continue;
      walk(pathname);
      continue;
    }
    if (!/\.(?:ts|tsx|js|jsx)$/.test(entry.name)) continue;
    const content = fs.readFileSync(pathname, "utf8");
    if (/@\/integrations\/supabase|@supabase\/supabase-js/.test(content)) {
      runtimeSupabaseHits.push(path.relative(root, pathname).replaceAll(path.sep, "/"));
    }
  }
}

for (const runtimeRoot of runtimeRoots) walk(runtimeRoot);
if (runtimeSupabaseHits.length) {
  fail(`Active runtime Supabase imports remain: ${runtimeSupabaseHits.join(", ")}`);
}

for (const relative of ["src/features/tretnix", "src/server/cloudflare"]) {
  const absolute = path.join(root, relative);
  const serialized = fs
    .readdirSync(absolute, { recursive: true, encoding: "utf8" })
    .filter((entry) => typeof entry === "string" && /\.(?:ts|tsx)$/.test(entry))
    .map((entry) => fs.readFileSync(path.join(absolute, entry), "utf8"))
    .join("\n");
  if (/DurableObject|WebSocket|REALTIME/.test(serialized)) {
    fail(`${relative} unexpectedly introduces realtime/Durable Object scope.`);
  }
}

console.log("Tretnix Cloudflare source contracts: PASS");
