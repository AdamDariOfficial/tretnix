import { createServerFn } from "@tanstack/react-start";
import { getRequest, setResponseHeader } from "@tanstack/react-start/server";
import { z } from "zod";

import { isTretnixLive } from "./profile";

async function repository() {
  return isTretnixLive()
    ? import("./live/repository.server")
    : import("./local/repository.server");
}

async function adminAuth() {
  return isTretnixLive()
    ? import("@/server/cloudflare/admin-auth.server")
    : import("./local/admin-auth.server");
}

function noStore() {
  setResponseHeader("Cache-Control", "private, no-store");
}

const idSchema = z.string().trim().min(1).max(160);
const csrfSchema = z.string().trim().min(20).max(256);
const listItemSchema = z.string().trim().min(1).max(500);
const listSchema = z.array(listItemSchema).max(60);
const nullableText = (max: number) => z.string().max(max).nullable();

const projectSchema = z.object({
  id: idSchema.optional(),
  slug: z.string().trim().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(1).max(160),
  category: z.string().trim().min(1).max(120).optional(),
  short_description: z.string().max(800).optional(),
  overview: z.string().max(5000).optional(),
  problem: z.string().max(5000).optional(),
  solution: z.string().max(5000).optional(),
  audience: z.string().max(3000).optional(),
  features: listSchema.optional(),
  impact_points: listSchema.optional(),
  modules: listSchema.optional(),
  workflow_steps: listSchema.optional(),
  customizations: listSchema.optional(),
  tech_stack: listSchema.optional(),
  image_url: nullableText(2048).optional(),
  gradient: z.string().max(1000).optional(),
  badge: nullableText(120).optional(),
  is_concept: z.boolean().optional(),
  is_visible: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  sort_order: z.number().int().min(-100_000).max(100_000).optional(),
});

const variantSchema = z
  .object({
    id: z.string().max(160).optional().default(""),
    project_id: z.string().max(160).optional().default(""),
    plan: z.enum(["START", "BUSINESS", "BUSINESS_PLUS"]),
    label: z.string().trim().min(1).max(160),
    short_description: z.string().max(1500),
    goal: z.string().max(2500),
    features: z.array(z.string().trim().min(1).max(500)).max(40),
    demo_url: z.string().url().max(2048).nullable(),
    publish_status: z.enum(["draft", "published"]),
    sort_order: z.number().int().min(-100_000).max(100_000),
  })
  .refine(
    (variant) => variant.plan !== "BUSINESS_PLUS" || variant.publish_status === "draft",
    "BUSINESS PLUS must remain draft in Portfolio V1.",
  );

const variantsSchema = z
  .array(variantSchema)
  .max(3)
  .refine(
    (variants) => new Set(variants.map((variant) => variant.plan)).size === variants.length,
    "Each project plan may appear only once.",
  );

const mediaSchema = z.object({
  project_id: idSchema,
  type: z.enum(["image", "video"]),
  url: z.string().trim().min(1).max(2048),
  caption: nullableText(1000),
  alt_text: nullableText(1000),
  sort_order: z.number().int().min(-100_000).max(100_000),
});

const mediaPatchSchema = z
  .object({
    type: z.enum(["image", "video"]).optional(),
    url: z.string().trim().min(1).max(2048).optional(),
    caption: nullableText(1000).optional(),
    alt_text: nullableText(1000).optional(),
    sort_order: z.number().int().min(-100_000).max(100_000).optional(),
  })
  .refine((patch) => Object.keys(patch).length > 0, "Media patch must contain a change.");

export const getAdminSession = createServerFn({ method: "GET" }).handler(async () => {
  noStore();
  const auth = await adminAuth();
  const session = await auth.getAdminSessionDetails(getRequest());
  return session
    ? {
        authenticated: true as const,
        userId: session.userId,
        email: session.email,
        csrfToken: session.csrfToken,
        expiresAt: session.expiresAt,
      }
    : { authenticated: false as const };
});

export const loginAdminSession = createServerFn({ method: "POST" })
  .validator(
    z.object({
      email: z.string().trim().email().max(180),
      password: z.string().min(1).max(512),
    }),
  )
  .handler(async ({ data }) => {
    noStore();
    const auth = await adminAuth();
    const session = await auth.loginAdmin(getRequest(), data.email, data.password);
    setResponseHeader("Set-Cookie", auth.serializeSessionCookie(session.token));
    return {
      ok: true as const,
      email: session.email,
      csrfToken: session.csrfToken,
      expiresAt: session.expiresAt,
    };
  });

export const logoutAdminSession = createServerFn({ method: "POST" })
  .validator(z.object({ csrfToken: csrfSchema }))
  .handler(async ({ data }) => {
    noStore();
    const auth = await adminAuth();
    await auth.logoutAdmin(getRequest(), data.csrfToken);
    setResponseHeader("Set-Cookie", auth.clearSessionCookie());
    return { ok: true as const };
  });

export const listPublicProjects = createServerFn({ method: "GET" })
  .validator(z.object({ featured: z.boolean().optional() }))
  .handler(async ({ data }) => {
    noStore();
    return (await repository()).listProjects({ featured: data.featured });
  });

export const getPublicProjectBySlug = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string().trim().min(1).max(100) }))
  .handler(async ({ data }) => {
    noStore();
    return (await repository()).getProjectBySlug(data.slug);
  });

export const listPublicProjectVariants = createServerFn({ method: "GET" })
  .validator(z.object({ projectId: idSchema }))
  .handler(async ({ data }) => {
    noStore();
    const repo = await repository();
    const project = await repo.getProjectById(data.projectId);
    if (!project?.is_visible) return [];
    return repo.listVariants(data.projectId);
  });

export const listPublicProjectMedia = createServerFn({ method: "GET" })
  .validator(z.object({ projectId: idSchema }))
  .handler(async ({ data }) => {
    noStore();
    const repo = await repository();
    const project = await repo.getProjectById(data.projectId);
    if (!project?.is_visible) return [];
    return repo.listMedia(data.projectId);
  });

export const getPublicSiteSettings = createServerFn({ method: "GET" }).handler(async () => {
  noStore();
  return (await repository()).getSettings();
});

export const listAdminProjects = createServerFn({ method: "GET" }).handler(async () => {
  noStore();
  await (await adminAuth()).requireAdmin(getRequest());
  return (await repository()).listProjects({ admin: true });
});

export const getAdminProject = createServerFn({ method: "GET" })
  .validator(z.object({ id: idSchema }))
  .handler(async ({ data }) => {
    noStore();
    await (await adminAuth()).requireAdmin(getRequest());
    return (await repository()).getProjectById(data.id);
  });

export const saveAdminProject = createServerFn({ method: "POST" })
  .validator(z.object({ project: projectSchema, csrfToken: csrfSchema }))
  .handler(async ({ data }) => {
    noStore();
    await (await adminAuth()).requireAdminCsrf(getRequest(), data.csrfToken);
    return (await repository()).upsertProject(data.project);
  });

export const deleteAdminProject = createServerFn({ method: "POST" })
  .validator(z.object({ id: idSchema, csrfToken: csrfSchema }))
  .handler(async ({ data }) => {
    noStore();
    await (await adminAuth()).requireAdminCsrf(getRequest(), data.csrfToken);
    await (await repository()).deleteProject(data.id);
    return { ok: true as const };
  });

export const patchAdminProject = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: idSchema,
      is_visible: z.boolean().optional(),
      is_featured: z.boolean().optional(),
      sort_order: z.number().int().min(-100_000).max(100_000).optional(),
      csrfToken: csrfSchema,
    }),
  )
  .handler(async ({ data }) => {
    noStore();
    await (await adminAuth()).requireAdminCsrf(getRequest(), data.csrfToken);
    await (await repository()).patchProjectFlags(data.id, data);
    return { ok: true as const };
  });

export const listAdminProjectVariants = createServerFn({ method: "GET" })
  .validator(z.object({ projectId: idSchema }))
  .handler(async ({ data }) => {
    noStore();
    await (await adminAuth()).requireAdmin(getRequest());
    return (await repository()).listVariants(data.projectId, true);
  });

export const replaceAdminProjectVariants = createServerFn({ method: "POST" })
  .validator(
    z.object({
      projectId: idSchema,
      variants: variantsSchema,
      csrfToken: csrfSchema,
    }),
  )
  .handler(async ({ data }) => {
    noStore();
    await (await adminAuth()).requireAdminCsrf(getRequest(), data.csrfToken);
    await (await repository()).replaceVariants(
      data.projectId,
      data.variants.map((variant) => ({ ...variant, project_id: data.projectId })),
    );
    return { ok: true as const };
  });

export const listAdminProjectMedia = createServerFn({ method: "GET" })
  .validator(z.object({ projectId: idSchema }))
  .handler(async ({ data }) => {
    noStore();
    await (await adminAuth()).requireAdmin(getRequest());
    return (await repository()).listMedia(data.projectId);
  });

export const addAdminProjectMedia = createServerFn({ method: "POST" })
  .validator(z.object({ media: mediaSchema, csrfToken: csrfSchema }))
  .handler(async ({ data }) => {
    noStore();
    await (await adminAuth()).requireAdminCsrf(getRequest(), data.csrfToken);
    return (await repository()).addMedia(data.media);
  });

export const updateAdminProjectMedia = createServerFn({ method: "POST" })
  .validator(z.object({ id: idSchema, patch: mediaPatchSchema, csrfToken: csrfSchema }))
  .handler(async ({ data }) => {
    noStore();
    await (await adminAuth()).requireAdminCsrf(getRequest(), data.csrfToken);
    await (await repository()).updateMedia(data.id, data.patch);
    return { ok: true as const };
  });

export const deleteAdminProjectMedia = createServerFn({ method: "POST" })
  .validator(z.object({ id: idSchema, csrfToken: csrfSchema }))
  .handler(async ({ data }) => {
    noStore();
    await (await adminAuth()).requireAdminCsrf(getRequest(), data.csrfToken);
    await (await repository()).deleteMedia(data.id);
    return { ok: true as const };
  });

export const getAdminSettings = createServerFn({ method: "GET" }).handler(async () => {
  noStore();
  await (await adminAuth()).requireAdmin(getRequest());
  return (await repository()).getSettings();
});

export const saveAdminSettings = createServerFn({ method: "POST" })
  .validator(
    z.object({
      settings: z.object({
        contact_email: z.string().trim().email().max(180),
        contact_phone: z.string().trim().max(60),
        location: z.string().trim().max(160),
        cta_email_subject: z.string().trim().max(200),
      }),
      csrfToken: csrfSchema,
    }),
  )
  .handler(async ({ data }) => {
    noStore();
    await (await adminAuth()).requireAdminCsrf(getRequest(), data.csrfToken);
    return (await repository()).updateSettings(data.settings);
  });

export const listAdminContacts = createServerFn({ method: "GET" }).handler(async () => {
  noStore();
  await (await adminAuth()).requireAdmin(getRequest());
  return (await repository()).listContacts();
});

export const setAdminContactStatus = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: idSchema,
      status: z.enum(["new", "contacted", "archived"]),
      csrfToken: csrfSchema,
    }),
  )
  .handler(async ({ data }) => {
    noStore();
    await (await adminAuth()).requireAdminCsrf(getRequest(), data.csrfToken);
    await (await repository()).updateContactStatus(data.id, data.status);
    return { ok: true as const };
  });

export const deleteAdminContact = createServerFn({ method: "POST" })
  .validator(z.object({ id: idSchema, csrfToken: csrfSchema }))
  .handler(async ({ data }) => {
    noStore();
    await (await adminAuth()).requireAdminCsrf(getRequest(), data.csrfToken);
    await (await repository()).deleteContact(data.id);
    return { ok: true as const };
  });

export const getAdminAnalytics = createServerFn({ method: "GET" })
  .validator(z.object({ since: z.string().datetime() }))
  .handler(async ({ data }) => {
    noStore();
    await (await adminAuth()).requireAdmin(getRequest());
    return (await repository()).analyticsSince(data.since);
  });

export const getAdminDashboardStats = createServerFn({ method: "GET" }).handler(async () => {
  noStore();
  await (await adminAuth()).requireAdmin(getRequest());
  return (await repository()).dashboardStats();
});
