# Tretnix Cloudflare provisioning and cutover runbook

**Scope:** Tretnix website/admin delivery on a dedicated Cloudflare Worker + D1 + R2 backend, with no Lovable/Supabase runtime dependency.

This is a gate document. The Controlled Change Package does **not** create Cloudflare resources, set secrets, apply remote migrations, import live data, deploy, change DNS, stage, commit or push.

## 1. Architecture boundary

```text
Tretnix / TanStack Start
└── Cloudflare Worker
    ├── TRETNIX_DB (D1) -> canonical structured data
    ├── TRETNIX_MEDIA (R2) -> admin-managed media bytes
    ├── Native Tretnix AdminAuth -> D1 users/sessions
    ├── ADMIN_LOGIN_RATE_LIMITER
    ├── CONTACT_SUBMIT_RATE_LIMITER
    └── ANALYTICS_RATE_LIMITER
```

D1 is the durable source of truth for projects, variants, media metadata, site settings, contact requests, analytics and admin identity/session state. R2 is authoritative only for media object bytes. Durable Objects/realtime are intentionally out of scope because Tretnix Portfolio V1 has no multi-admin convergence requirement.

### Local/live profile boundary

Source development defaults to `VITE_TRETNIX_BACKEND_PROFILE=local`. That profile uses only in-memory/demo state: it does not reactivate Supabase and it is not a durability or security acceptance environment. Local analytics/contact writes are non-persistent and local media previews are temporary. Native local admin access is available only while `import.meta.env.DEV` is true and fails closed in a production build.

`tools/cloudflare/build-environment.mjs` always forces `VITE_TRETNIX_BACKEND_PROFILE=live` and stamps the generated Worker config/entry hashes with `profile: live`. `prepare-environment-config.mjs` refuses a missing, stale or non-live stamp. This prevents an ordinary local/demo build from being prepared as staging or production.

## 2. Data jurisdiction

Tretnix stores contact-request PII. For the Italian/EU deployment, create D1 and R2 with the `eu` jurisdiction unless a later approved legal/infrastructure decision changes that requirement.

Jurisdiction is a resource-creation decision. Record resource names, IDs and jurisdiction in the provisioning evidence.

## 3. Staging resources

Create isolated staging resources only after the provisioning gate is approved:

```powershell
npx wrangler@4.131.2 d1 create tretnix-staging --jurisdiction=eu
npx wrangler@4.131.2 r2 bucket create tretnix-media-staging --jurisdiction=eu
```

Record the D1 UUID returned by Wrangler. Choose three distinct positive integer Rate Limiting namespace IDs that are unique within the Cloudflare account:

```text
ADMIN_LOGIN_RATE_LIMITER
CONTACT_SUBMIT_RATE_LIMITER
ANALYTICS_RATE_LIMITER
```

Rate Limiting namespace IDs are identifiers defined in Worker configuration; they are not D1/R2 resources.

## 4. Build a stamped Cloudflare candidate

From the applied and validated Tretnix repository candidate:

```powershell
node .\tools\cloudflare\build-environment.mjs
```

This forces `VITE_TRETNIX_BACKEND_PROFILE=live`, runs the repository production build, requires the generated Cloudflare Worker entry/config and writes:

```text
.output/server/tretnix-cloudflare-build.json
```

The stamp contains SHA-256 hashes for the generated Wrangler config and Worker entry. It does not deploy anything.

### Build adapter decision

The repository keeps the existing Lovable/TanStack/Nitro pipeline. The first Vite/Rolldown SSR build intentionally externalizes `cloudflare:workers`; Nitro then emits the `cloudflare-module` target, and workerd resolves that runtime specifier. `@cloudflare/vite-plugin` is not added because doing so would introduce a second Cloudflare adapter and migrate an already valid pipeline without a runtime requirement.

## 5. Prepare staging Worker configuration

```powershell
node .\tools\cloudflare\prepare-environment-config.mjs `
  --environment staging `
  --database-name tretnix-staging `
  --database-id '<D1 UUID>' `
  --bucket-name tretnix-media-staging `
  --login-rate-namespace-id '<unique integer>' `
  --contact-rate-namespace-id '<unique integer>' `
  --analytics-rate-namespace-id '<unique integer>'
```

The tool reads the stamped `.output/server/wrangler.json`, preserves the generated `main`, assets and Cloudflare build details, and writes:

```text
.output/server/wrangler.staging.json
```

It refuses stale build stamps. It never provisions or deploys.

Staging intentionally uses the existing `tretnix-staging.<account-subdomain>.workers.dev` surface with `workers_dev=true` and `preview_urls=true`. The generated staging config contains no custom-domain or zone route, and staging does not require `--hostname`. Production requires an explicit `--production-routing` mode; the initial bootstrap uses `none`, without a hostname or public endpoint. `custom-domain` requires `--hostname` and is reserved for a separately approved future change.

## 6. Prepare staging secret material locally

Generate `ADMIN_AUTH_PEPPER` and `ADMIN_AUTH_CSRF_SECRET` independently. Each must contain at least 32 high-entropy characters. Keep the staging values in an approved secret manager or in a temporary JSON/`.env` file under `$env:LOCALAPPDATA\Tretnix\private\`, which is outside the repository, or another explicitly approved absolute path outside Git. Restrict custody to the owner account and approved secret tooling. The secrets file contains actual secret values: never write it to `wrangler.jsonc`, a generated config, source code, documentation or any Git-controlled path. Delete temporary private material when it is no longer needed. Production uses independently generated values and separate private material.

For the canonical staging candidate, do not attempt to recover the existing unreadable secret values. Generate new independent staging values for both required secrets. This rotation is safe for this cutover because the verified staging D1 state has zero native admins and zero sessions, while the currently active staging version remains unchanged until the later traffic gate. Native AdminAuth provisioning must use exactly the same new staging pepper supplied to the new Worker version. This is a staging-specific owner decision; it does not define automatic rotation behavior and production secrets remain entirely separate.

This is local preparation only: do not run a Wrangler secret command here. In particular, `wrangler secret put` is prohibited in this phase because current Wrangler creates a Worker version and deploys it immediately. The `secrets.required` entries in the generated config declare and validate names; they do not provision values.

Secret provisioning is a remote mutation and requires explicit authorization. Provision the staging values together with the candidate only at the version-upload gate in section 9.

## 7. Apply staging D1 migrations

Review migration state before applying:

```powershell
npx wrangler@4.131.2 d1 migrations list tretnix-staging --remote --config '.output\server\wrangler.staging.json'
```

Only after an explicit migration gate:

```powershell
npx wrangler@4.131.2 d1 migrations apply tretnix-staging --remote --config '.output\server\wrangler.staging.json'
```

The initial migrations create the Tretnix application schema and Native AdminAuth tables. Portfolio V1 structurally prevents `BUSINESS_PLUS` from being published.

## 8. Native admin provisioning

Native Tretnix AdminAuth does not migrate Supabase Auth password material.

Generate an admin record privately:

```powershell
$privateRoot = Join-Path $env:LOCALAPPDATA 'Tretnix\private'
$adminSqlPath = Join-Path $privateRoot 'tretnix-staging-admin.sql'
New-Item -ItemType Directory -Path $privateRoot -Force | Out-Null
$env:TRETNIX_ADMIN_EMAIL='<admin email>'
$env:TRETNIX_ADMIN_PASSWORD='<strong password>'
$env:TRETNIX_ADMIN_AUTH_PEPPER='<same staging pepper>'
bun .\tools\admin\generate-admin-user-sql.ts > $adminSqlPath
```

Create `$privateRoot` outside the repository with restrictive, owner-only custody before running the command. The SQL contains authentication hash/salt material, although not the plaintext password or pepper. Review it and execute it against staging D1 only after the admin-provisioning gate. Neither the SQL nor the secrets file may enter Git. Delete private generated material when no longer needed.

## 9. Staging version-upload gate

Only after a separate remote-mutation authorization, upload code, bindings and the complete staging secret set as a new version that does **not** receive traffic:

```powershell
$stagingSecretsPath = Join-Path $env:LOCALAPPDATA 'Tretnix\private\tretnix-staging-secrets.json'
npx wrangler@4.131.2 versions upload `
  --config '.output\server\wrangler.staging.json' `
  --secrets-file $stagingSecretsPath `
  --experimental-provision=false `
  --experimental-auto-create=false `
  --strict
```

Record the returned version ID and preview evidence. `versions upload` mutates the remote Worker by creating a version, but it does not create a deployment. Do not substitute `wrangler deploy` or `wrangler secret put`; both couple version creation to an immediate deployment. For a later rotation on an existing Worker, `wrangler versions secret put` likewise creates an undeployed version that must pass the separate deployment gate.

## 10. Staging deploy gate

Only after the exact uploaded version, bindings, secrets, migrations and admin provisioning have passed review, and after explicit deployment authorization, deploy that recorded version to 100% of staging traffic:

```powershell
npx wrangler@4.131.2 versions deploy '<STAGING_VERSION_ID>@100%' --config '.output\server\wrangler.staging.json'
```

A successful version upload or deployment is not acceptance. Record both version and deployment evidence and perform the staging verification matrix below.

## 11. Staging verification matrix

Verify at minimum:

- `/`, `/case-studies`, `/case-studies/forno-lume`, `/case-studies/rito-studio`;
- direct URL, refresh, Back and Forward behavior;
- route opens at top and reduced-motion behavior;
- 360 / 390 / 430 / 768 / 1024 / 1440 / 1920 widths;
- no unintended horizontal overflow;
- project filters/search/cards;
- START/BUSINESS timeline and demo links;
- lightbox keyboard navigation, Escape, focus trap and focus return;
- admin login invalid/valid/rate-limited paths;
- absolute and idle session validity, logout and CSRF rejection;
- project create/edit/delete, visibility, featured and ordering;
- START/BUSINESS variants and BUSINESS PLUS forced draft;
- main-image upload and gallery upload/update/delete;
- hidden-project media not publicly readable without an admin session;
- contact form validation, honeypot, idempotency and rate limiting;
- contact inbox status/delete actions;
- site settings;
- anonymous analytics and admin analytics;
- R2 object read/write/delete and D1 metadata consistency;
- console/network errors and response security headers.

Do not certify staging until direct evidence exists for each applicable gate.

## 12. Fresh D1 initialization

The owner confirmed on 14 September 2026 that no Lovable/Supabase data must be preserved. Create a new, clean D1 database and apply only the versioned migrations in `migrations/`. Do not export or import legacy rows, media, Auth identities, or password material.

The seed is authoritative for Portfolio V1: Forno Lume and RITO Studio are the only featured projects; FitZone, SupplyFlow, and WealthCore remain visible and non-featured. START and BUSINESS are published for the two featured concept families; BUSINESS PLUS remains unpublished by schema constraint.

## 13. Production resources

P1 provisioned these separate EU resources; do not recreate, import legacy data into, or bind staging resources in their place:

```text
D1: tretnix-production / 9900eecc-88e7-4d6a-8fc5-4732ab25724d (EU, EEUR; migrations pending)
R2: tretnix-media-production (EU, EEUR; initially 0 objects)
```

After a stamped local Cloudflare build, generate the **route-free** production config locally:

```powershell
node .\tools\cloudflare\prepare-environment-config.mjs `
  --environment production `
  --production-routing none `
  --database-name tretnix-production `
  --database-id 9900eecc-88e7-4d6a-8fc5-4732ab25724d `
  --bucket-name tretnix-media-production `
  --login-rate-namespace-id 784311301 `
  --contact-rate-namespace-id 784311302 `
  --analytics-rate-namespace-id 784311303
```

The resulting `.output/server/wrangler.production.json` must name `tretnix`, set `workers_dev=false` and `preview_urls=false`, and have **neither `route` nor `routes`**. It contains D1/R2/rate-limit bindings and required secret *names*, not secret values. The owner-approved production namespace IDs `784311301/302/303` were checked against the current account Worker bindings and are distinct from staging `784311201/202/203`. Generate and retain production secrets separately from staging, only in an approved secret manager or a private file outside the repository. Never reuse staging bindings or secret values.

The Worker `tretnix` does not yet exist. `wrangler versions upload --experimental-auto-create=false` **cannot** create it: Cloudflare requires an initial `wrangler deploy` (or C3) before version uploads. A separately authorized bootstrap must use the reviewed route-free config and disable automatic resource provisioning. Bootstrap creates an initial Worker version/deployment, but with no route, Custom Domain, workers.dev or Preview URL it must expose no public endpoint; verify those postconditions immediately. Do not bootstrap from a config with `--production-routing custom-domain` or attach `tretnix.com` in this step.

Only after bootstrap, a separate version-upload gate may upload a production candidate with the production secrets file and `--experimental-auto-create=false`, record its exact version ID, and leave it undeployed. A further gate may deploy that exact ID inside the Worker. Neither `versions upload` nor `versions deploy` creates the apex Route or constitutes the public routing cutover. No secret value belongs in Git or command output.

## 14. Production cutover order

The first production cutover uses a **Worker Route**, not a Worker Custom Domain. The steps below are future owner-gated operations, not commands authorized by this runbook or by local config generation:

```text
A. Production D1/R2 provisioning (P1 complete; resources above)
B. Local stamped production build and source validation
C. Route-free production config generation and review
D. Apply versioned D1 migrations; verify canonical seed and empty operational tables
E. Create separate production secrets privately; provision native admin with the same production pepper
F. Bootstrap Worker tretnix using only the route-free config; verify zero public endpoints
G. Upload and record the exact production candidate version without deploying it
H. Deploy the reviewed version inside the Worker while it still has zero public endpoints
I. Separately authorize and add Worker Route tretnix.com/* -> tretnix; capture its exact Route ID
J. Immediate public smoke, browser/admin/security QA and observability review
K. Explicit acceptance or rollback decision
L. Later, separately authorized legacy Pages/Lovable/Supabase decommission
```

Before step I, remote HTTP validation of the production Worker requires a separately approved protected QA endpoint; a route-free Worker has no public preview URL. Local workerd and staging evidence do not substitute for that test if the production gate requires it. Worker Routes and Custom Domains are trigger configuration separate from Worker versions; apply trigger changes only under the routing gate. In particular, do not run `wrangler triggers deploy` or a subsequent `wrangler deploy` with a stale route-free config after cutover without reviewing its effect on the live Route.

The current apex is a proxied CNAME to `tretnix.pages.dev`, associated with Pages project `tretnix`; its known-good production deployment is `19f3dcda-e9dc-4474-84b8-7786896335fd`. Preserve the CNAME, Pages custom-domain association and existing `www.tretnix.com` 301 redirect through the first cutover. **CUTOVER:** add exactly `tretnix.com/* -> tretnix` as a Worker Route and record the resulting Route ID. **ROLLBACK:** delete exactly that newly created Route ID, then verify the preserved Pages origin and `www` redirect. Do not use a Custom Domain as an implicit bootstrap or cutover action: it conflicts with the current apex CNAME and requires a separate future owner decision, DNS/Pages plan and rollback gate.

Do not delete the old Pages or Supabase project immediately after cutover. Keep them unchanged as rollback/evidence material until production acceptance is complete. Decommissioning is a later explicit infrastructure gate; the Tretnix Worker runtime must not depend on Supabase.

## 15. Required evidence before declaring the migration complete

- exact repository SHA and package manifest recorded;
- D1/R2 names, IDs and EU jurisdiction recorded;
- generated Worker config hash/stamp recorded;
- migrations list and applied result recorded;
- canonical clean-D1 project/variant postconditions verified;
- operational tables and R2 start without imported legacy data;
- native admin provisioned and authentication/security paths verified;
- no active Supabase package/import and no Lovable browser-runtime hook; the Lovable Vite config remains only as the documented build-time adapter;
- source contract validator passed;
- build passed;
- staging browser/admin/security QA passed;
- production Worker version, exact Route ID and apex hostname verified;
- production smoke/browser/admin QA passed;
- no unapproved stage/commit/push/PR/merge/migration/deploy action occurred.
