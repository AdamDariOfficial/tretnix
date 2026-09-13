import { z } from "zod";

import { AdminAuthError, getAdminSessionDetails, requireAdminCsrf } from "./admin-auth.server";
import { requireBinding } from "./env.server";

const MAX_JSON_BYTES = 16 * 1024;
const MAX_MEDIA_BYTES = 10 * 1024 * 1024;
const MAX_MULTIPART_BYTES = MAX_MEDIA_BYTES + 512 * 1024;

const MEDIA_EXTENSION: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

const analyticsSchema = z.object({
  event_type: z.enum([
    "page_view",
    "cta_click",
    "email_click",
    "phone_click",
    "case_study_view",
    "project_card_click",
    "contact_form_submit",
  ]),
  path: z.string().max(200).nullable().optional(),
  project_slug: z.string().max(80).nullable().optional(),
  referrer_host: z.string().max(120).nullable().optional(),
  device_type: z.enum(["mobile", "tablet", "desktop"]).nullable().optional(),
  viewport_width: z.number().int().min(0).max(100_000).nullable().optional(),
});

const contactSchema = z.object({
  submission_key: z.string().uuid(),
  honeypot: z.string().max(200).optional().default(""),
  source_path: z.string().max(200).optional().default(""),
  input: z.object({
    full_name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(180),
    phone: z.string().trim().max(40).optional().default(""),
    business_name: z.string().trim().max(160).optional().default(""),
    needs: z.array(z.string().trim().min(1).max(80)).max(20),
    starting_point: z.string().trim().max(200).optional().default(""),
    message: z.string().trim().min(10).max(3000),
    privacy_accepted: z.literal(true),
  }),
});

function json(value: unknown, status = 200, headers: HeadersInit = {}) {
  return new Response(JSON.stringify(value), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...headers,
    },
  });
}

function isSameOriginBrowserRequest(request: Request) {
  if (request.headers.get("sec-fetch-site") === "cross-site") return false;

  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

async function readJson(request: Request) {
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_JSON_BYTES) {
    throw new Error("Payload troppo grande.");
  }

  const body = await request.text();
  if (new TextEncoder().encode(body).byteLength > MAX_JSON_BYTES) {
    throw new Error("Payload troppo grande.");
  }
  return JSON.parse(body) as unknown;
}

function clientIp(request: Request) {
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

async function hash(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32);
}

async function rateLimit(
  binding: "CONTACT_SUBMIT_RATE_LIMITER" | "ANALYTICS_RATE_LIMITER",
  key: string,
) {
  return (await requireBinding(binding).limit({ key })).success;
}

async function submitContact(request: Request) {
  if (!isSameOriginBrowserRequest(request)) return json({ error: "origin" }, 403);

  const parsed = contactSchema.safeParse(await readJson(request));
  if (!parsed.success) return json({ error: "invalid" }, 400);

  const { input, source_path, honeypot, submission_key } = parsed.data;
  if (honeypot.trim()) return json({ ok: true });

  const identity = input.phone.trim() || input.email.toLowerCase();
  const [identityAllowed, ipAllowed] = await Promise.all([
    rateLimit("CONTACT_SUBMIT_RATE_LIMITER", `contact-id:${await hash(identity)}`),
    rateLimit("CONTACT_SUBMIT_RATE_LIMITER", `contact-ip:${await hash(clientIp(request))}`),
  ]);
  if (!identityAllowed || !ipAllowed) return json({ error: "rate-limited" }, 429);

  const now = new Date().toISOString();
  await requireBinding("TRETNIX_DB")
    .prepare(`
      INSERT INTO contact_requests(
        id, submission_key, full_name, email, phone, business_name, needs_json,
        starting_point, message, privacy_accepted, source_path, status, created_at, updated_at
      ) VALUES(?,?,?,?,?,?,?,?,?,?,?,'new',?,?)
      ON CONFLICT(submission_key) DO NOTHING
    `)
    .bind(
      crypto.randomUUID(),
      submission_key,
      input.full_name,
      input.email,
      input.phone.trim() || null,
      input.business_name.trim() || null,
      JSON.stringify(input.needs),
      input.starting_point.trim() || null,
      input.message,
      1,
      source_path.trim() || null,
      now,
      now,
    )
    .run();

  return json({ ok: true }, 201);
}

async function submitAnalytics(request: Request) {
  if (!isSameOriginBrowserRequest(request)) return json({ ok: true }, 202);

  const parsed = analyticsSchema.safeParse(await readJson(request));
  if (!parsed.success) return json({ ok: true }, 202);
  if (parsed.data.path?.startsWith("/admin")) return json({ ok: true }, 202);

  const allowed = await rateLimit(
    "ANALYTICS_RATE_LIMITER",
    `analytics:${await hash(clientIp(request))}`,
  );
  if (!allowed) return json({ ok: true }, 202);

  await requireBinding("TRETNIX_DB")
    .prepare(`
      INSERT INTO analytics_events(
        event_type, path, project_slug, referrer_host, device_type, viewport_width, created_at
      ) VALUES(?,?,?,?,?,?,?)
    `)
    .bind(
      parsed.data.event_type,
      parsed.data.path ?? null,
      parsed.data.project_slug ?? null,
      parsed.data.referrer_host ?? null,
      parsed.data.device_type ?? null,
      parsed.data.viewport_width ?? null,
      new Date().toISOString(),
    )
    .run();

  return json({ ok: true }, 202);
}

async function uploadMedia(request: Request) {
  if (!isSameOriginBrowserRequest(request)) return json({ error: "origin" }, 403);

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_MULTIPART_BYTES) {
    return json({ error: "too-large" }, 413);
  }

  await requireAdminCsrf(request, request.headers.get("x-tretnix-csrf") ?? "");

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return json({ error: "file" }, 400);

  const extension = MEDIA_EXTENSION[file.type];
  if (!extension || file.size <= 0 || file.size > MAX_MEDIA_BYTES) {
    return json({ error: "unsupported" }, 400);
  }

  const folderRaw = typeof form.get("folder") === "string" ? String(form.get("folder")) : "project";
  const folder = folderRaw
    .trim()
    .slice(0, 80)
    .replace(/[^a-z0-9_-]/gi, "-")
    .toLowerCase() || "project";

  const id = crypto.randomUUID();
  const objectKey = `projects/${folder}/${id}.${extension}`;
  const now = new Date().toISOString();

  await requireBinding("TRETNIX_MEDIA").put(objectKey, file.stream(), {
    httpMetadata: {
      contentType: file.type,
      cacheControl: "public, max-age=31536000, immutable",
    },
  });

  try {
    await requireBinding("TRETNIX_DB")
      .prepare(
        "INSERT INTO media_assets(id,object_key,content_type,byte_size,original_name,created_at,updated_at) VALUES(?,?,?,?,?,?,?)",
      )
      .bind(id, objectKey, file.type, file.size, file.name.slice(0, 255), now, now)
      .run();
  } catch (error) {
    try {
      await requireBinding("TRETNIX_MEDIA").delete(objectKey);
    } catch {
      // The D1 write failed, so an R2 object cleanup failure is logged by the outer boundary.
    }
    throw error;
  }

  return json({ id, marker: `media:${id}` }, 201);
}

async function serveMedia(request: Request, id: string) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return new Response("Not found", { status: 404 });
  }

  const database = requireBinding("TRETNIX_DB");
  const row = await database
    .prepare("SELECT object_key,content_type FROM media_assets WHERE id=? LIMIT 1")
    .bind(id)
    .first<{ object_key: string; content_type: string }>();
  if (!row) return new Response("Not found", { status: 404 });

  const marker = `media:${id}`;
  const publicReference = await database
    .prepare(`
      SELECT 1 AS allowed
      FROM projects p
      WHERE p.is_visible = 1
        AND (
          p.image_url = ?
          OR EXISTS (
            SELECT 1 FROM project_media pm
            WHERE pm.project_id = p.id AND pm.url = ?
          )
        )
      LIMIT 1
    `)
    .bind(marker, marker)
    .first<{ allowed: number }>();

  if (!publicReference && !(await getAdminSessionDetails(request))) {
    return new Response("Not found", { status: 404 });
  }

  const object = await requireBinding("TRETNIX_MEDIA").get(row.object_key);
  if (!object) return new Response("Not found", { status: 404 });

  const headers = new Headers({
    "content-type": object.httpMetadata?.contentType ?? row.content_type,
    "cache-control": publicReference
      ? (object.httpMetadata?.cacheControl ?? "public, max-age=3600")
      : "private, no-store",
    "x-content-type-options": "nosniff",
  });
  if (object.httpEtag) headers.set("etag", object.httpEtag);
  return new Response(object.body, { headers });
}

export async function handleTretnixApi(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  const path = url.pathname;

  try {
    if (path === "/api/tretnix/contact-requests" && request.method === "POST") {
      return await submitContact(request);
    }
    if (path === "/api/tretnix/analytics" && request.method === "POST") {
      return await submitAnalytics(request);
    }
    if (path === "/api/tretnix/admin/media" && request.method === "POST") {
      return await uploadMedia(request);
    }
    if (path.startsWith("/api/tretnix/media/") && request.method === "GET") {
      return await serveMedia(request, decodeURIComponent(path.slice("/api/tretnix/media/".length)));
    }
    if (path.startsWith("/api/tretnix/")) return json({ error: "not-found" }, 404);
    return null;
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return json({ error: "admin-auth" }, error.status);
    }
    console.error("[Tretnix API]", {
      path,
      errorName: error instanceof Error ? error.name : typeof error,
    });
    return json({ error: "request-failed" }, 500);
  }
}
