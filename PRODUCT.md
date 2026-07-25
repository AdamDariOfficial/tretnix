# Product

<!-- impeccable:product-schema 1 -->

## How to Read This Record

This document uses four evidence labels:

- **Confirmed from repository** — directly observed in versioned source code, content, configuration, or migrations.
- **Approved product decision** — durable product truth explicitly approved for Tretnix; it may not yet be represented by the current implementation.
- **Product or design principle** — a requirement that guides future decisions; it is not evidence that every current surface or delivery already satisfies it.
- **To verify** — an open fact that requires documentation, execution, authorization, or other evidence before it can be presented as confirmed.

## Decision Authority

### Approved Product Decision

When sources conflict, decisions for this project follow this precedence:

1. approved decisions;
2. shared Tretnix development standards;
3. project-specific documentation;
4. the approved current task specification;
5. behavior confirmed in code and deployment;
6. prior conversations not yet formalized.

## Platform

web

## Surface Register

### Approved Product Decision

- The Tretnix public website and public portfolio are a **Brand surface**.
- Administrative interfaces are **Product surfaces**.
- This `PRODUCT.md` primarily governs the public Tretnix Brand surface.
- Admin-specific design decisions must prioritize task completion, clarity, and operational efficiency while preserving the Tretnix identity.

### Product and Design Principle

Brand surfaces persuade, explain, and establish trust. Product surfaces help an authorized operator complete work accurately and efficiently. Shared identity does not require the two surface types to use identical composition, density, or interaction priorities.

## Users

### Approved Product Decisions

Tretnix serves:

- local businesses;
- professionals;
- microbusinesses;
- small and medium-sized businesses;
- B2B clients seeking a polished, customized digital solution.

Excel, WhatsApp, manual handoffs, duplicated data, and disconnected tools are recurring problems for part of this audience, but they do not define the audience as a whole.

### Confirmed Repository Evidence

The current public copy addresses businesses and operational teams that need to simplify processes, centralize information, reduce errors, and gain control over day-to-day work.

### To Verify

No durable priority order among the approved audience groups has been established.

## Product Purpose

### Approved Product Decision

Tretnix is a boutique software studio that designs and develops tailored digital products for real business needs. Its purpose is to turn a concrete requirement, workflow, service, or operational problem into a clear, reliable, and useful digital solution.

Tretnix aims to define the right scope, build the smallest complete solution that produces value, and evolve it modularly when further development is justified.

### Confirmed Repository Evidence

The current website presents Tretnix as a designer and developer of custom software intended to simplify processes, reduce errors, and support business growth. It includes a guided contact flow for identifying needs and starting points.

### Product Principle

Success means delivering a solution that is usable, maintainable, appropriate to the client's real process, and complete enough to create practical value. This is a product principle, not a claim of measured outcomes for past clients.

## Positioning

### Approved Product Decision

Tretnix is positioned as a premium boutique software studio: elegant, minimal, professional, reliable, clear, personalized, process-oriented, and focused on a useful result.

Tretnix:

- starts from the real need rather than from a predetermined product;
- defines the scope before expanding the solution;
- maintains a direct point of contact;
- designs and develops a customized solution rather than applying an indistinct template;
- can evolve the solution through modular, deliberate stages.

Tretnix must not be presented as:

- a low-cost or generic web agency;
- a template-based service with interchangeable results;
- a SaaS product;
- a crypto, broker, forex, or financial-trading brand;
- a service whose public proposition is selling software made by AI.

AI tools and agents may support internal work. Publicly, Tretnix designs and develops the software. AI-enabled automations may still be offered as client-facing capabilities when they are appropriate to the actual solution.

### Approved Anti-References

The Tretnix public Brand surface must not drift toward:

- generic SaaS landing pages;
- purple or blue-purple gradients;
- indiscriminate glassmorphism;
- fintech, crypto, broker, or trading aesthetics;
- interchangeable grids of rounded cards;
- excessive pills, glows, and floating badges;
- generic AI-generated copy;
- public attribution of client work to AI tools;
- cheap agency or template-marketplace aesthetics.

These anti-references constrain future visual and verbal decisions; they are not claims that every incumbent detail has already been audited or replaced.

### Confirmed Repository Evidence

The incumbent public interface uses the Tretnix name, custom-software positioning, direct-contact calls to action, a process-led narrative, and modular-solution language.

## Offer

### Approved Product Decisions

Tretnix designs and develops:

- websites and landing pages;
- multi-page websites;
- dashboards;
- CRM systems;
- management systems;
- web applications;
- custom software;
- business automations.

The offer is not restricted to one industry or one class of product.

### Confirmed Repository Evidence

The current contact flow explicitly includes custom management systems, CRM systems, dashboards, automations, orders or bookings, suppliers or inventory, and websites or landing pages with advanced functionality. The repository also contains a public portfolio, case-study routes, a contact-request workflow, project and media management, site settings, and anonymous event analytics.

The repository demonstrates capabilities of the Tretnix website itself. It is not, by itself, evidence that every approved commercial offering has already been delivered to a client.

## Process and Operating Context

### Approved Product Decision

The durable Tretnix process is:

1. understand the real need, working context, and desired result;
2. define a clear scope;
3. maintain a direct point of contact;
4. build the smallest complete solution that creates value;
5. release and evolve it modularly where useful.

Tretnix may work with existing manual processes, spreadsheets, messaging tools, disconnected systems, legacy software, or a need that has not yet been translated into technical requirements.

### Confirmed Repository Evidence

The current website asks prospects what they want to simplify and whether they are exploring, digitizing an existing process, starting with an essential version, seeking a complete system, or improving existing software.

## Priority Verticals

### Approved Product Decisions

The first concrete, existing vertical identified for Tretnix is:

- Food & Hospitality.

Strategic families currently in preparation are:

- Beauty & Wellness;
- Professional Services;
- Home & Local Services.

These are priority verticals, not limits on the Tretnix offer. Tretnix may design customized solutions for other industries.

### Confirmed Repository Evidence

The versioned migrations include demonstrative concepts for fitness and wellness, supplier operations, and financial monitoring. They do not provide repository evidence for the approved status of Food & Hospitality as the first concrete vertical.

### To Verify

The supporting source, assets, scope, or delivery evidence for the Food & Hospitality vertical has not yet been identified in this repository.

## Capabilities and Constraints

### Confirmed Repository Facts

- This repository implements the Tretnix public website and its administrative content-management surfaces using React, TanStack, and Supabase. It does not define Tretnix as a SaaS product.
- Public project data, project media, contact requests, site settings, and analytics use versioned database migrations and Row Level Security policies.
- Administrative functions include project management, media management, contact-request handling, site settings, and anonymous analytics reporting.
- Repository project records support an explicit `is_concept` field; new admin records default to a concept/demo badge and `is_concept: true`.
- Public case-study copy currently identifies the collection as case studies and concepts.

### Approved Product and Design Requirements

- Preserve new-route navigation from the top using an immediate reset rather than smooth scrolling.
- Preserve browser back, forward, refresh, and direct-URL behavior.
- Start below-the-fold reveals when their content enters the viewport.
- On mobile editorial sections, place text before imagery unless a documented hero, gallery, or visual-first component requires a different order.
- Preserve each client's visual identity; do not impose indiscriminate aesthetic uniformity.
- Do not change security, authorization, or Row Level Security to conceal a frontend error.
- Use versioned migrations and least privilege for database changes.

These are durable requirements for future work. Their inclusion here does not assert that every current route or component has already been tested against them.

### Product Principles on Data

Client control, ownership, and portability of data, together with the avoidance of unnecessary lock-in, are design and product principles.

They must not be represented as absolute legal guarantees unless the relevant contract, infrastructure, integrations, export paths, retention rules, and implementation have been verified for the specific engagement.

## Brand Commitments

### Confirmed Repository Facts

- The public brand name is Tretnix.
- The current public communication is primarily in Italian.
- “Padova, Italia” appears as a current public geographic reference in default site settings and legal content.
- The privacy content currently names “Tretnix Studio”.

### Approved Product Decisions

- Tretnix remains the public designer and developer of its software.
- Public communication should be premium, elegant, minimal, professional, reliable, clear, and personalized.
- Italian is the current primary public language, not a permanent restriction against future multilingual work.
- Client identities must remain intentional and distinct.
- Internal tools such as AI systems, agents, Lovable, Cursor, Codex, Claude Code, or similar tools must not be presented as the public authors of client software.
- Public-facing client work includes the discreet attribution “Progettato e sviluppato da Tretnix” linked to `https://tretnix.com`.

### Approved Brand Voice

The Tretnix public voice is:

- precise;
- assured;
- tailored.

It is:

- clear, not cold;
- authoritative, not arrogant;
- premium, not artificially luxurious;
- concrete, not slogan-heavy;
- technical only when technical detail improves understanding.

### Product and Design Principle

Copy should make the need, decision, process, and value easier to understand. It must not substitute generic AI phrasing, inflated claims, or decorative slogans for specific meaning.

### To Verify

- “Padova, Italia” is not confirmed as an immutable registered office.
- The exact legal entity and legally approved public business name behind “Tretnix Studio” require corporate or legal documentation.
- Languages and markets for any future multilingual offer remain undecided.

## Evidence on Hand

### Confirmed Repository Evidence

- Public positioning and offer: `src/components/TretnixLanding.tsx`.
- Public navigation, contact details, and footer identity: `src/components/TretnixChrome.tsx`.
- Contact needs, intake schema, and workflow: `src/lib/contact-requests.ts`.
- Project and concept model: `src/lib/projects.ts` and `src/routes/admin.projects.new.tsx`.
- Public concept and case-study presentation: `src/routes/case-studies.index.tsx` and `src/routes/case-studies.$slug.tsx`.
- Current legal and geographic references: `src/routes/privacy.tsx` and `src/lib/site-settings.ts`.
- Versioned schema, seed concepts, authorization, and RLS policies: `supabase/migrations/`.

The repository contains demonstrative concept content. No authorized real-client case study, testimonial, client result, benchmark, certification, award, partnership, or verified performance metric was identified during initialization.

### Evidence Integrity Requirements

- Do not invent clients, testimonials, results, metrics, certifications, partnerships, press, or real case studies.
- A demonstrative project must be identified as a concept.
- A case study may be presented as real only when authorization and supporting evidence exist.
- Approved positioning and strategic intent must not be rewritten as proof of delivered outcomes.

### To Verify

- Which, if any, future projects have authorization and evidence for publication as real case studies.
- Which approved capabilities have completed, publishable client evidence.
- Whether any external proof assets exist outside this repository.

## Product Principles

1. **Start from reality.** Understand the user's work, constraints, and desired result before choosing the solution.
2. **Build the smallest complete value.** Reduce scope without shipping an incomplete or disposable experience.
3. **Practice boutique responsibility.** Maintain clarity, direct accountability, careful execution, and a result tailored to the client.
4. **Design for durable control.** Favor maintainability, modular evolution, appropriate portability, and freedom from unnecessary lock-in without making unverified legal promises.
5. **Earn every claim.** Distinguish demonstrations from real work and publish only evidence that is authorized and verifiable.

## Accessibility & Inclusion

### Approved Product and Design Requirements

Tretnix work should apply:

- mobile-first development;
- no unintended horizontal overflow;
- semantic structure;
- a coherent heading hierarchy;
- complete keyboard navigation;
- visible focus;
- labels associated with form controls;
- appropriate text alternatives;
- sufficient contrast;
- adequate touch targets;
- accessible dialogs, drawers, FAQ controls, and lightboxes;
- respect for `prefers-reduced-motion`;
- content that remains usable without animation.

The operational objective is practical alignment with WCAG 2.2 Level AA principles in relevant flows.

### Confirmed Repository Evidence

The current repository contains semantic landmarks, headings, labels, alternative text, ARIA attributes, visible-focus styles, accessible component primitives, reduced-motion handling, and viewport-triggered reveals.

### To Verify

No accessibility certification or complete WCAG 2.2 Level AA conformance audit has been established. Full conformance must not be claimed without testing the relevant routes, states, content, keyboard flows, assistive-technology behavior, contrast, responsive layouts, and motion preferences.
