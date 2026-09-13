# Tretnix Cloudflare provisioning and cutover runbook

**Scope:** Tretnix website/admin persistence cutover from the current Supabase runtime to a dedicated Cloudflare Worker + D1 + R2 backend.

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
npx wrangler@latest d1 create tretnix-staging --jurisdiction=eu
npx wrangler@latest r2 bucket create tretnix-media-staging --jurisdiction=eu
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
  --hostname '<staging hostname>' `
  --login-rate-namespace-id '<unique integer>' `
  --contact-rate-namespace-id '<unique integer>' `
  --analytics-rate-namespace-id '<unique integer>'
```

The tool reads the stamped `.output/server/wrangler.json`, preserves the generated `main`, assets and Cloudflare build details, and writes:

```text
.output/server/wrangler.staging.json
```

It refuses stale build stamps. It never provisions or deploys.

## 6. Prepare staging secret material locally

Generate `ADMIN_AUTH_PEPPER` and `ADMIN_AUTH_CSRF_SECRET` independently. Each must contain at least 32 high-entropy characters. Keep the staging values in an approved secret manager or in a temporary JSON/`.env` file at an absolute path **outside the repository**. Never write secret values to `wrangler.jsonc`, a generated config, source code, documentation or any Git-controlled path. Production uses independently generated values and separate private material.

This is local preparation only: do not run a Wrangler secret command here. In particular, `wrangler secret put` is prohibited in this phase because current Wrangler creates a Worker version and deploys it immediately. The `secrets.required` entries in the generated config declare and validate names; they do not provision values.

Secret provisioning is a remote mutation and requires explicit authorization. Provision the staging values together with the candidate only at the version-upload gate in section 9.

## 7. Apply staging D1 migrations

Review migration state before applying:

```powershell
npx wrangler@latest d1 migrations list tretnix-staging --remote --config '.output\server\wrangler.staging.json'
```

Only after an explicit migration gate:

```powershell
npx wrangler@latest d1 migrations apply tretnix-staging --remote --config '.output\server\wrangler.staging.json'
```

The initial migrations create the Tretnix application schema and Native AdminAuth tables. Portfolio V1 structurally prevents `BUSINESS_PLUS` from being published.

## 8. Native admin provisioning

Native Tretnix AdminAuth does not migrate Supabase Auth password material.

Generate an admin record privately:

```powershell
$env:TRETNIX_ADMIN_EMAIL='<admin email>'
$env:TRETNIX_ADMIN_PASSWORD='<strong password>'
$env:TRETNIX_ADMIN_AUTH_PEPPER='<same staging pepper>'
bun .\tools\admin\generate-admin-user-sql.ts > '.private\tretnix-admin.sql'
```

The SQL contains a salt/hash record, not the plaintext password or pepper. Review it and execute it against staging D1 only after the admin-provisioning gate. Delete private generated material when no longer needed.

## 9. Staging version-upload gate

Only after a separate remote-mutation authorization, upload code, bindings and the complete staging secret set as a new version that does **not** receive traffic:

```powershell
npx wrangler@latest versions upload `
  --config '.output\server\wrangler.staging.json' `
  --secrets-file '<absolute path outside repository to staging secrets>' `
  --experimental-auto-create=false
```

Record the returned version ID and preview evidence. `versions upload` mutates the remote Worker by creating a version, but it does not create a deployment. Do not substitute `wrangler deploy` or `wrangler secret put`; both couple version creation to an immediate deployment. For a later rotation on an existing Worker, `wrangler versions secret put` likewise creates an undeployed version that must pass the separate deployment gate.

## 10. Staging deploy gate

Only after the exact uploaded version, bindings, secrets, migrations and admin provisioning have passed review, and after explicit deployment authorization, deploy that recorded version to 100% of staging traffic:

```powershell
npx wrangler@latest versions deploy '<STAGING_VERSION_ID>@100%' --config '.output\server\wrangler.staging.json'
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

## 12. Legacy Supabase data

Production cutover must not assume the current Supabase project is empty. The connected Supabase account available during package preparation did not expose the Tretnix live project, so live row/media counts are unknown.

Follow `tools/migration/README.md` before production switch. Private exports and PII-bearing generated SQL stay outside Git.

Key invariants:

- Forno Lume and RITO Studio portfolio family content remains version-controlled by Portfolio V1 and is not overwritten by a same-slug legacy export.
- Legacy project records are reconciled by slug so old Supabase UUIDs cannot break D1 foreign keys.
- Imported legacy projects remain non-featured so the homepage keeps exactly the Portfolio V1 featured families.
- Supabase Auth password material is not migrated.
- `sb://` bytes move to R2 before the corresponding D1 URL remap.
- media byte hashes are checked before upload.

## 13. Production resources

Production uses completely separate resources and rate-limit namespaces:

```powershell
npx wrangler@latest d1 create tretnix-production --jurisdiction=eu
npx wrangler@latest r2 bucket create tretnix-media-production --jurisdiction=eu
```

Repeat the stamped build/config procedure with:

```text
--environment production
--hostname tretnix.com
```

Generate and retain production secrets separately from staging, again only in an approved secret manager or a private file outside the repository. Never point staging at production D1/R2 bindings and never reuse staging secret values in production.

Under a dedicated production version-upload authorization, run `wrangler versions upload` with the generated production config, the separate production `--secrets-file`, and `--experimental-auto-create=false`. Record the returned production version ID. This creates an undeployed remote version. Only under a later, explicit production deploy gate may that exact ID be passed to `wrangler versions deploy '<PRODUCTION_VERSION_ID>@100%'`.

## 14. Production cutover order

The intended production sequence is:

```text
validated repository candidate
→ production D1/R2 provisioning
→ production generated Worker config
→ base D1 migrations
→ private legacy structured-data import
→ legacy media upload to R2
→ verify R2 bytes
→ D1 media remap
→ reconcile row/media counts
→ provision native admin
→ staging-equivalent pre-deploy checks
→ explicit production version-upload gate with separate production secrets
→ explicit production deploy gate
→ production smoke/browser/admin verification
→ runtime cutover accepted
```

Do not delete the old Supabase project immediately after cutover. Keep it unchanged as rollback/evidence material until production acceptance is complete. Decommissioning Supabase is a later explicit infrastructure gate; the Tretnix production runtime must no longer depend on it after cutover.

## 15. Required evidence before declaring the migration complete

- exact repository SHA and package manifest recorded;
- D1/R2 names, IDs and EU jurisdiction recorded;
- generated Worker config hash/stamp recorded;
- migrations list and applied result recorded;
- imported source counts vs D1 target counts reconciled;
- R2 migration plan count vs uploaded/remapped count reconciled;
- native admin provisioned and authentication/security paths verified;
- no active runtime Supabase import outside preserved historical integration files;
- source contract validator passed;
- build passed;
- staging browser/admin/security QA passed;
- production Worker version and hostname verified;
- production smoke/browser/admin QA passed;
- no unapproved stage/commit/push/PR/merge/migration/deploy action occurred.
