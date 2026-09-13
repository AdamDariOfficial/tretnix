# Private Supabase -> Cloudflare D1/R2 cutover

This directory contains migration tooling only. **Never commit exported live data, downloaded private media, generated PII-bearing SQL or generated admin credentials.**

## Expected private export files

Export the current Tretnix Supabase rows to a private local directory using these filenames when the tables exist:

```text
site_settings.json
projects.json
project_media.json
contact_requests.json
analytics_events.json
```

The export must represent one internally consistent snapshot. Record source table row counts before transformation.

Supabase Auth users/password material is intentionally excluded. Native Tretnix AdminAuth is provisioned separately.

## Structured-data import

Generate D1 import SQL outside the repository:

```powershell
node .\tools\migration\build-d1-import-sql.mjs 'C:\private\tretnix-export' > 'C:\private\tretnix-d1-import.sql'
```

Review the generated SQL before applying it.

The transformer deliberately enforces these rules:

- `forno-lume` and `rito-studio` are protected Portfolio V1 slugs and cannot be overwritten by legacy rows;
- other legacy projects are reconciled by `slug`, preserving the D1 row ID already seeded when a slug exists;
- `project_media.project_id` is resolved through the source project slug, so Supabase UUID differences do not break D1 foreign keys;
- imported legacy projects are forced `is_featured = 0`;
- unknown analytics event types are skipped and reported;
- contact-request statuses outside the approved set normalize to `new`;
- authentication data is not imported.

Apply this SQL only after the base D1 migrations have been applied to the target environment and only through a separately approved data-import gate.

## Legacy Supabase Storage -> R2

Tretnix historically stores project-media markers as:

```text
sb://<project-images object path>
```

Download the private `project-images` bucket to a private local directory while preserving object paths. Then build a migration plan:

```powershell
node .\tools\migration\build-media-migration-plan.mjs `
  'C:\private\tretnix-export' `
  'C:\private\project-images' `
  'C:\private\tretnix-media-plan'
```

The tool produces:

```text
media-upload-plan.json
Upload-R2Media.ps1
media-remap.sql
```

Behavior:

- every referenced `sb://` file must exist locally or the tool stops;
- only the image/video types supported by the Tretnix media boundary are accepted;
- identical legacy object paths are deduplicated to one R2 object;
- SHA-256 is recorded for every upload source;
- legacy project covers and gallery media are both handled;
- protected Portfolio V1 cover images are not overwritten by legacy project cover values;
- the tool performs no network upload and no D1 mutation.

### Required execution order

1. review `media-upload-plan.json` and `media-remap.sql`;
2. run the generated uploader only after the R2-upload gate;
3. verify uploaded R2 object count and representative bytes/content types;
4. only then apply `media-remap.sql` to D1;
5. verify no runtime-facing `sb://` references remain for migrated public/admin media;
6. reconcile source reference count, unique upload count and D1 remap count.

If no live structured rows or media exist, record direct evidence of the zero counts rather than assuming emptiness.
