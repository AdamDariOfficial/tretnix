import "./lib/error-capture";

import { isTretnixLive } from "./features/tretnix/profile";
import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

const HTML_CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  // TanStack emits inline hydration/stream scripts without a nonce. Nonce propagation
  // through the SSR shell and streamed scripts is a separate hardening change.
  "script-src 'self' 'unsafe-inline'",
  // React/Radix motion and Recharts use style attributes/generated inline styles.
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  // Admin supports external image/video URLs; do not widen script or fetch origins.
  // blob: preserves local media previews; data: is restricted to image resources.
  "img-src 'self' https: data: blob:",
  "media-src 'self' https: blob:",
  "connect-src 'self'",
  "object-src 'none'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "worker-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

export function applySecurityHeaders(request: Request, response: Response): Response {
  // Pass the existing stream and native Headers directly: never buffer the body or
  // turn Headers into an object, which could fold multiple Set-Cookie values.
  const secured = new Response(response.body, response);
  secured.headers.set("X-Content-Type-Options", "nosniff");
  secured.headers.set("X-Frame-Options", "DENY");
  secured.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  secured.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (new URL(request.url).protocol === "https:") {
    // Host-only HSTS: no preload or policy imposed on independent demo subdomains.
    secured.headers.set("Strict-Transport-Security", "max-age=31536000");
  }
  if (secured.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() === "text/html") {
    secured.headers.set("Content-Security-Policy", HTML_CONTENT_SECURITY_POLICY);
  }
  return secured;
}

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (module) => (module.default ?? module) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    if (payload.unhandled !== true || payload.message !== "HTTPError") return response;
  } catch {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      if (isTretnixLive()) {
        const { handleTretnixApi } = await import("./server/cloudflare/api.server");
        const apiResponse = await handleTretnixApi(request);
        if (apiResponse) return applySecurityHeaders(request, apiResponse);
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return applySecurityHeaders(request, await normalizeCatastrophicSsrResponse(response));
    } catch (error) {
      console.error(error);
      return applySecurityHeaders(request, new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      }));
    }
  },
};
