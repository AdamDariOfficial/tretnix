import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

function fail(message) {
  throw new Error(message);
}

function sha256(pathname) {
  return createHash("sha256").update(fs.readFileSync(pathname)).digest("hex");
}

function parseArgs(argv) {
  const values = new Map();
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!key?.startsWith("--") || value === undefined || value.startsWith("--")) {
      fail(`Invalid arguments near ${key ?? "<end>"}.`);
    }
    values.set(key.slice(2), value);
  }
  return values;
}

function required(args, name) {
  const value = args.get(name)?.trim();
  if (!value) fail(`Missing required --${name}.`);
  return value;
}

function validateEnvironment(value) {
  if (value !== "staging" && value !== "production") {
    fail("--environment must be staging or production.");
  }
  return value;
}

function validateDatabaseId(value) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
    fail("--database-id must be a UUID returned by Cloudflare D1 provisioning.");
  }
  return value;
}

function validateNamespaceId(value, flagName) {
  if (!/^\d+$/.test(value) || BigInt(value) <= 0n) {
    fail(`--${flagName} must be a positive integer string.`);
  }
  return value;
}

function validateHostname(value) {
  const normalized = value.trim().toLowerCase();
  if (
    normalized.length > 253 ||
    !/^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(
      normalized,
    )
  ) {
    fail("--hostname must be a valid Cloudflare-managed hostname without scheme or path.");
  }
  return normalized;
}

function validateWorkerName(value) {
  if (!/^[a-z0-9][a-z0-9-]{0,62}$/.test(value)) {
    fail("--worker-name must be a lowercase Workers-compatible name.");
  }
  return value;
}

function validateBucketName(value) {
  const normalized = value.trim().toLowerCase();
  if (!/^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/.test(normalized)) {
    fail("--bucket-name must be a valid lowercase R2 bucket name.");
  }
  return normalized;
}

function validateDatabaseName(value) {
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(value)) {
    fail("--database-name contains unsupported characters.");
  }
  return value;
}

const args = parseArgs(process.argv.slice(2));
const environment = validateEnvironment(required(args, "environment"));
const databaseName = validateDatabaseName(required(args, "database-name"));
const databaseId = validateDatabaseId(required(args, "database-id"));
const bucketName = validateBucketName(required(args, "bucket-name"));
if (environment === "staging" && args.has("hostname")) {
  fail("--hostname is not supported for staging; use workers.dev and Preview URLs.");
}
const hostname =
  environment === "production" ? validateHostname(required(args, "hostname")) : undefined;
const loginRateNamespaceId = validateNamespaceId(
  required(args, "login-rate-namespace-id"),
  "login-rate-namespace-id",
);
const contactRateNamespaceId = validateNamespaceId(
  required(args, "contact-rate-namespace-id"),
  "contact-rate-namespace-id",
);
const analyticsRateNamespaceId = validateNamespaceId(
  required(args, "analytics-rate-namespace-id"),
  "analytics-rate-namespace-id",
);

if (
  new Set([loginRateNamespaceId, contactRateNamespaceId, analyticsRateNamespaceId]).size !== 3
) {
  fail("Admin-login, contact and analytics rate limiters must use distinct namespace IDs.");
}

const defaultWorkerName = environment === "production" ? "tretnix" : "tretnix-staging";
const workerName = validateWorkerName(args.get("worker-name")?.trim() || defaultWorkerName);

const repoRoot = process.cwd();
const outputRoot = path.join(repoRoot, ".output", "server");
const sourcePath = path.join(outputRoot, "wrangler.json");
const workerEntryPath = path.join(outputRoot, "index.mjs");
const buildStampPath = path.join(outputRoot, "tretnix-cloudflare-build.json");
const outputPath = path.join(outputRoot, `wrangler.${environment}.json`);

for (const pathname of [sourcePath, workerEntryPath, buildStampPath]) {
  if (!fs.existsSync(pathname)) fail(`Missing Cloudflare source-build artifact: ${pathname}`);
}

const buildStamp = JSON.parse(fs.readFileSync(buildStampPath, "utf8"));
if (
  buildStamp?.schemaVersion !== 1 ||
  buildStamp?.target !== "cloudflare" ||
  buildStamp?.profile !== "live"
) {
  fail("Environment config requires a stamped Tretnix Cloudflare build.");
}
if (
  buildStamp.wranglerSha256 !== sha256(sourcePath) ||
  buildStamp.workerEntrySha256 !== sha256(workerEntryPath)
) {
  fail("Cloudflare source-build stamp is stale. Re-run tools/cloudflare/build-environment.mjs.");
}

const generated = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
if (typeof generated.main !== "string" || !generated.main) {
  fail("Generated Wrangler config has no main entry.");
}
if (!generated.assets || typeof generated.assets !== "object") {
  fail("Generated Wrangler config has no assets block.");
}
if (
  !Array.isArray(generated.compatibility_flags) ||
  !generated.compatibility_flags.includes("nodejs_compat")
) {
  fail("Generated Worker must preserve nodejs_compat.");
}

const serialized = JSON.stringify(generated).toLowerCase();
for (const forbidden of ["supabase", "business_plus_db", "consultation_db", "rito_admin"]) {
  if (serialized.includes(forbidden)) {
    fail(`Generated Worker contains forbidden foreign/legacy marker ${forbidden}.`);
  }
}

const config = structuredClone(generated);
config.name = workerName;
if (environment === "staging") {
  config.workers_dev = true;
  config.preview_urls = true;
  delete config.route;
  delete config.routes;
} else {
  config.workers_dev = false;
  config.preview_urls = false;
  config.routes = [{ pattern: hostname, custom_domain: true }];
}
config.vars = {
  ...(config.vars ?? {}),
  TRETNIX_ENV: environment,
};
config.d1_databases = [
  {
    binding: "TRETNIX_DB",
    database_name: databaseName,
    database_id: databaseId,
    migrations_dir: "../../migrations",
  },
];
config.r2_buckets = [
  {
    binding: "TRETNIX_MEDIA",
    bucket_name: bucketName,
    jurisdiction: "eu",
  },
];
config.secrets = {
  required: ["ADMIN_AUTH_PEPPER", "ADMIN_AUTH_CSRF_SECRET"],
};
config.ratelimits = [
  {
    name: "ADMIN_LOGIN_RATE_LIMITER",
    namespace_id: loginRateNamespaceId,
    simple: { limit: 5, period: 60 },
  },
  {
    name: "CONTACT_SUBMIT_RATE_LIMITER",
    namespace_id: contactRateNamespaceId,
    simple: { limit: 5, period: 60 },
  },
  {
    name: "ANALYTICS_RATE_LIMITER",
    namespace_id: analyticsRateNamespaceId,
    simple: { limit: 120, period: 60 },
  },
];

fs.writeFileSync(outputPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");

console.log("TRETNIX CLOUDFLARE CONFIG PREPARED — NO DEPLOY PERFORMED");
console.log(`Environment: ${environment}`);
console.log(`Input:       ${sourcePath}`);
console.log(`Output:      ${outputPath}`);
console.log(`Worker:      ${workerName}`);
console.log(
  environment === "staging"
    ? "Exposure:    workers.dev and Preview URLs (no custom-domain route)"
    : `Hostname:    https://${hostname}`,
);
console.log(`D1:          ${databaseName} (${databaseId})`);
console.log(`R2:          ${bucketName} (EU jurisdiction binding)`);
console.log(`Login rate namespace:     ${loginRateNamespaceId}`);
console.log(`Contact rate namespace:   ${contactRateNamespaceId}`);
console.log(`Analytics rate namespace: ${analyticsRateNamespaceId}`);
console.log("Required secrets: ADMIN_AUTH_PEPPER, ADMIN_AUTH_CSRF_SECRET");
