import { requireBinding } from "./env.server";
import {
  ADMIN_PASSWORD_SCHEME,
  ADMIN_PASSWORD_WORK_FACTOR,
  createOpaqueAdminSessionToken,
  createSessionCsrfToken,
  hashOpaqueToken,
  verifyAdminPassword,
  verifySessionCsrfToken,
} from "./admin-auth-crypto.server";

export const ADMIN_SESSION_COOKIE = "__Host-tretnix_admin_session";
const ABSOLUTE_MS = 12 * 60 * 60 * 1000;
const IDLE_MS = 2 * 60 * 60 * 1000;
const TOUCH_MS = 15 * 60 * 1000;

const DUMMY_PASSWORD_RECORD = {
  scheme: ADMIN_PASSWORD_SCHEME,
  passwordWorkFactor: ADMIN_PASSWORD_WORK_FACTOR,
  salt: "AAAAAAAAAAAAAAAAAAAAAA",
  passwordHash: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
};

type SessionRow = {
  id: string;
  user_id: string;
  token_hash: string;
  created_at: string;
  last_seen_at: string;
  expires_at: string;
  revoked_at: string | null;
  email: string;
  user_status: string;
};

type UserRow = {
  id: string;
  email: string;
  email_normalized: string;
  password_scheme: string;
  password_iterations: number;
  password_salt: string;
  password_hash: string;
  status: string;
};

export class AdminAuthError extends Error {
  readonly status: 401 | 403 | 429;

  constructor(message: string, status: 401 | 403 | 429) {
    super(message);
    this.name = "AdminAuthError";
    this.status = status;
  }
}

function getCookie(request: Request, name: string) {
  for (const part of (request.headers.get("cookie") ?? "").split(/;\s*/)) {
    const separator = part.indexOf("=");
    if (separator > 0 && part.slice(0, separator) === name) return part.slice(separator + 1);
  }
  return null;
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function parseTime(value: string) {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function requireAuthSecret(name: "ADMIN_AUTH_PEPPER" | "ADMIN_AUTH_CSRF_SECRET") {
  const secret = requireBinding(name).trim();
  if (secret.length < 32) throw new Error(`${name} must contain at least 32 characters.`);
  return secret;
}

function assertSameOriginBrowserRequest(request: Request) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite === "cross-site") throw new AdminAuthError("Origin non autorizzata.", 403);

  const origin = request.headers.get("origin");
  if (!origin) return;
  try {
    if (new URL(origin).origin !== new URL(request.url).origin) {
      throw new AdminAuthError("Origin non autorizzata.", 403);
    }
  } catch (error) {
    if (error instanceof AdminAuthError) throw error;
    throw new AdminAuthError("Origin non autorizzata.", 403);
  }
}

async function rateKey(prefix: string, value: string) {
  return `${prefix}:${(await hashOpaqueToken(value)).slice(0, 32)}`;
}

async function enforceLoginRateLimit(request: Request, email: string) {
  const limiter = requireBinding("ADMIN_LOGIN_RATE_LIMITER");
  const ip =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  const [ipResult, accountResult] = await Promise.all([
    limiter.limit({ key: await rateKey("admin-login-ip", ip) }),
    limiter.limit({ key: await rateKey("admin-login-account", email) }),
  ]);

  if (!ipResult.success || !accountResult.success) {
    throw new AdminAuthError("Accesso temporaneamente limitato. Riprova tra poco.", 429);
  }
}

async function readSession(request: Request) {
  const token = getCookie(request, ADMIN_SESSION_COOKIE);
  if (!token) return null;

  const database = requireBinding("TRETNIX_DB");
  const tokenHash = await hashOpaqueToken(token);
  const row = await database
    .prepare(`
      SELECT
        s.id, s.user_id, s.token_hash, s.created_at, s.last_seen_at,
        s.expires_at, s.revoked_at, u.email, u.status AS user_status
      FROM admin_sessions s
      JOIN admin_users u ON u.id = s.user_id
      WHERE s.token_hash = ?
      LIMIT 1
    `)
    .bind(tokenHash)
    .first<SessionRow>();
  if (!row) return null;

  const now = Date.now();
  if (
    row.revoked_at ||
    row.user_status !== "active" ||
    parseTime(row.expires_at) <= now ||
    parseTime(row.last_seen_at) + IDLE_MS <= now
  ) {
    await database
      .prepare("UPDATE admin_sessions SET revoked_at=COALESCE(revoked_at,?) WHERE id=?")
      .bind(new Date(now).toISOString(), row.id)
      .run();
    return null;
  }

  if (parseTime(row.last_seen_at) + TOUCH_MS <= now) {
    const touchedAt = new Date(now).toISOString();
    await database.prepare("UPDATE admin_sessions SET last_seen_at=? WHERE id=?").bind(touchedAt, row.id).run();
    row.last_seen_at = touchedAt;
  }

  return { token, row };
}

export function serializeSessionCookie(token: string) {
  return `${ADMIN_SESSION_COOKIE}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${Math.floor(ABSOLUTE_MS / 1000)}`;
}

export function clearSessionCookie() {
  return `${ADMIN_SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}

export async function loginAdmin(request: Request, emailRaw: string, password: string) {
  assertSameOriginBrowserRequest(request);

  const database = requireBinding("TRETNIX_DB");
  const email = normalizeEmail(emailRaw);
  await enforceLoginRateLimit(request, email);

  const user = await database
    .prepare(`
      SELECT id,email,email_normalized,password_scheme,password_iterations,password_salt,password_hash,status
      FROM admin_users
      WHERE email_normalized=?
      LIMIT 1
    `)
    .bind(email)
    .first<UserRow>();

  const pepper = requireAuthSecret("ADMIN_AUTH_PEPPER");
  const valid = await verifyAdminPassword(
    password,
    user
      ? {
          scheme: user.password_scheme,
          passwordWorkFactor: user.password_iterations,
          salt: user.password_salt,
          passwordHash: user.password_hash,
        }
      : DUMMY_PASSWORD_RECORD,
    pepper,
  );

  if (!user || user.status !== "active" || !valid) {
    throw new AdminAuthError("Email o password non corretti.", 401);
  }

  const existingToken = getCookie(request, ADMIN_SESSION_COOKIE);
  if (existingToken) {
    await database
      .prepare("UPDATE admin_sessions SET revoked_at=COALESCE(revoked_at,?) WHERE token_hash=?")
      .bind(new Date().toISOString(), await hashOpaqueToken(existingToken))
      .run();
  }

  const token = createOpaqueAdminSessionToken();
  const now = new Date();
  const nowIso = now.toISOString();
  const expiresAt = new Date(now.getTime() + ABSOLUTE_MS).toISOString();
  const tokenHash = await hashOpaqueToken(token);

  await database.batch([
    database
      .prepare(
        "DELETE FROM admin_sessions WHERE expires_at < ? OR (revoked_at IS NOT NULL AND revoked_at < ?)",
      )
      .bind(nowIso, nowIso),
    database
      .prepare(
        "INSERT INTO admin_sessions(id,user_id,token_hash,created_at,last_seen_at,expires_at,revoked_at) VALUES(?,?,?,?,?,?,NULL)",
      )
      .bind(crypto.randomUUID(), user.id, tokenHash, nowIso, nowIso, expiresAt),
    database
      .prepare("UPDATE admin_users SET last_login_at=?,updated_at=? WHERE id=?")
      .bind(nowIso, nowIso, user.id),
  ]);

  return {
    token,
    email: user.email,
    csrfToken: await createSessionCsrfToken(token, requireAuthSecret("ADMIN_AUTH_CSRF_SECRET")),
    expiresAt,
  };
}

export async function getAdminSessionDetails(request: Request) {
  const resolved = await readSession(request);
  if (!resolved) return null;

  const authorizedUntil = new Date(
    Math.min(
      parseTime(resolved.row.expires_at),
      parseTime(resolved.row.last_seen_at) + IDLE_MS,
    ),
  ).toISOString();

  return {
    userId: resolved.row.user_id,
    email: resolved.row.email,
    csrfToken: await createSessionCsrfToken(
      resolved.token,
      requireAuthSecret("ADMIN_AUTH_CSRF_SECRET"),
    ),
    expiresAt: authorizedUntil,
  };
}

export async function requireAdmin(request: Request) {
  const resolved = await readSession(request);
  if (!resolved) throw new AdminAuthError("Accesso admin non autorizzato.", 401);
  return resolved;
}

export async function requireAdminCsrf(request: Request, csrfToken: string) {
  assertSameOriginBrowserRequest(request);
  const resolved = await requireAdmin(request);
  const valid = await verifySessionCsrfToken(
    resolved.token,
    csrfToken,
    requireAuthSecret("ADMIN_AUTH_CSRF_SECRET"),
  );
  if (!valid) throw new AdminAuthError("Richiesta admin non autorizzata.", 403);
  return resolved;
}

export async function logoutAdmin(request: Request, csrfToken: string) {
  const resolved = await requireAdminCsrf(request, csrfToken);
  await requireBinding("TRETNIX_DB")
    .prepare("UPDATE admin_sessions SET revoked_at=COALESCE(revoked_at,?) WHERE id=?")
    .bind(new Date().toISOString(), resolved.row.id)
    .run();
}
