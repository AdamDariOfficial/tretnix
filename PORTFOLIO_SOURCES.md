# Tretnix Portfolio V1 + Cloudflare — Source manifest

Prepared: 7 September 2026

## Tretnix

- repository: `AdamDariOfficial/tretnix`
- approved package base: `ab6e29ee922bb4376fd9e7919b3afe74a4b7a7ea`
- target branch: `feat/tretnix-portfolio-v1`
- existing runtime before this package: Supabase-backed projects, media, admin auth/roles, contact requests, analytics and site settings.
- existing build target: TanStack Start with Cloudflare as the default Nitro target through the Lovable config.

## Cloudflare reference pattern

The implementation reuses the verified architectural pattern from current Forno Lume BUSINESS PLUS and RITO Studio BUSINESS PLUS: Worker + D1 + R2 + native D1-backed AdminAuth + versioned migrations, without importing PLUS-only business features. Durable Objects are omitted because Tretnix has no current realtime-convergence requirement.

## Portfolio sources

### Forno Lume START
- repository: `AdamDariOfficial/forno-lume-START`
- current main observed: `9e4964bfe1aaea8591238e27582465341d99e0da`
- documented frozen ancestor: `a817903923c1bbfe177d8b59e70a4aa1137b7ab1`
- demo: `https://forno-lume.tretnix.com/`

### Forno Lume BUSINESS
- repository: `AdamDariOfficial/forno-lume-BUSINESS`
- current main observed: `ad4becaeb8f75bda05780ed88ad8cf6f9af4a78e`
- documented frozen ancestor: `9bc33cd5737af7763fe9c61ddc52eb7a606fafea`
- demo: `https://forno-lume-business.tretnix.com/`

### RITO Studio START
- repository: `AdamDariOfficial/rito-studio-START`
- current main observed: `0e3c8ca712e0ab37b0a9fd0ae89d1158a603cb14`
- historical `family-start-v1.0`: `74ee03c4d39a974872f94f53d14ec2873815ccf7`
- current lineage includes the approved v1.0.1 Hero CTA patch/closure.
- demo: `https://rito-studio.tretnix.com/`

### RITO Studio BUSINESS
- repository: `AdamDariOfficial/rito-studio-BUSINESS`
- current main observed: `b6a82f918370f730681e9e0c0572a7a653d2dfeb`
- repository documentation retains a browser-QA discrepancy for the latest sync; Portfolio V1 does not rewrite that evidence.
- demo: `https://rito-studio-business.tretnix.com/`

## Missing evidence / cutover constraint

The connected Supabase account available during preparation exposed a different project, not the Tretnix live backend. Live Supabase rows and storage objects are therefore unknown. Production cutover requires a private export/import and media migration gate; no live-data preservation claim is made before that evidence exists.
