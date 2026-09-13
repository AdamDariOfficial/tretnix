import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const repoRoot = process.cwd();
const outputRoot = path.join(repoRoot, ".output", "server");
const wranglerPath = path.join(outputRoot, "wrangler.json");
const workerEntryPath = path.join(outputRoot, "index.mjs");
const stampPath = path.join(outputRoot, "tretnix-cloudflare-build.json");

function fail(message) {
  throw new Error(message);
}

function sha256(pathname) {
  return createHash("sha256").update(fs.readFileSync(pathname)).digest("hex");
}

if (fs.existsSync(stampPath)) fs.rmSync(stampPath);

const command = process.platform === "win32" ? "bun.exe" : "bun";
const result = spawnSync(command, ["run", "build"], {
  cwd: repoRoot,
  env: {
    ...process.env,
    VITE_TRETNIX_BACKEND_PROFILE: "live",
  },
  encoding: "utf8",
  stdio: "inherit",
  windowsHide: true,
});

if (result.error) fail(`Unable to start Cloudflare source build: ${result.error.message}`);
if (result.status !== 0) {
  fail(`Cloudflare source build failed with exit ${result.status ?? "unknown"}.`);
}

for (const pathname of [wranglerPath, workerEntryPath]) {
  if (!fs.existsSync(pathname)) fail(`Cloudflare source build did not produce ${pathname}.`);
}

const generatedConfig = JSON.parse(fs.readFileSync(wranglerPath, "utf8"));
if (typeof generatedConfig.main !== "string" || !generatedConfig.main) {
  fail("Generated Wrangler config has no main entry.");
}
if (!generatedConfig.assets || typeof generatedConfig.assets !== "object") {
  fail("Generated Wrangler config has no assets block.");
}
if (
  !Array.isArray(generatedConfig.compatibility_flags) ||
  !generatedConfig.compatibility_flags.includes("nodejs_compat")
) {
  fail("Generated Worker must preserve nodejs_compat.");
}

const serialized = JSON.stringify(generatedConfig).toLowerCase();
if (serialized.includes("supabase")) {
  fail("Generated Worker unexpectedly contains a Supabase runtime marker.");
}

const stamp = {
  schemaVersion: 1,
  target: "cloudflare",
  profile: "live",
  generatedAt: new Date().toISOString(),
  wranglerSha256: sha256(wranglerPath),
  workerEntrySha256: sha256(workerEntryPath),
};

fs.writeFileSync(stampPath, `${JSON.stringify(stamp, null, 2)}\n`, "utf8");

console.log("TRETNIX CLOUDFLARE SOURCE BUILD PREPARED — NO DEPLOY PERFORMED");
console.log(`Wrangler SHA-256: ${stamp.wranglerSha256}`);
console.log(`Worker SHA-256:   ${stamp.workerEntrySha256}`);
console.log(`Stamp:            ${stampPath}`);
