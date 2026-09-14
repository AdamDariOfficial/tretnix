# Tretnix Portfolio V1 — Approved specification

Approved by the project owner on 7 September 2026; reconciled with the Cloudflare-native owner decision on 14 September 2026.

## Public model

- `/case-studies/forno-lume`: Food & Hospitality concept family, START → BUSINESS.
- `/case-studies/rito-studio`: Beauty & Wellness concept family, START → BUSINESS.
- Homepage featured selection: Forno Lume + RITO Studio.
- Concepts use `Concept Tretnix`; no invented clients, metrics, testimonials, awards or outcomes.
- BUSINESS PLUS may exist only as `draft` in V1. The D1 constraint prevents publication until a later approved migration.

## Persistence model

D1 stores site settings, projects, project variants, media metadata/references, contact requests, anonymous analytics and native admin auth/session records. R2 stores media bytes. No ORM is introduced.

The public portfolio and admin use TanStack `createServerFn` for D1-backed reads/mutations that must work in SSR and browser contexts. Explicit same-origin Worker endpoints are limited to public writes and media byte transport.

Source development defaults to a `local` backend profile with non-persistent in-memory/demo state and no Supabase fallback. Staging and production are built only through `tools/cloudflare/build-environment.mjs`, which forces and stamps `VITE_TRETNIX_BACKEND_PROFILE=live`; environment preparation refuses a non-live or stale stamp.

## Security model

- native D1-backed admin identities and opaque sessions;
- scrypt + HMAC pepper password records following the established PLUS pattern;
- HttpOnly + Secure + SameSite=Strict `__Host-` session cookie;
- session-bound CSRF for admin mutations;
- login and public-write rate-limit bindings;
- same-origin checks on explicit write/upload endpoints;
- no client-side D1/R2 credentials;
- no weakening of authorization to preserve old frontend assumptions.

## Deliberate exclusions

- no Durable Objects or realtime sync in V1;
- no BUSINESS PLUS publication;
- no deployment/provisioning performed by the source package;
- no Lovable or Supabase runtime dependency;
- no legacy data export/import: the owner confirmed that no Lovable/Supabase data must be preserved;
- historical Supabase migrations may remain only as inert Git history and must not be executed for the Cloudflare-native environment.
