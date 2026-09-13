import { isTretnixLocalDevelopment } from "../profile";

const LOCAL_CSRF = "tretnix-local-development-csrf-token";
const LOCAL_USER_ID = "tretnix-local-admin";
const LOCAL_EMAIL = "local-admin@tretnix.invalid";

function requireLocalDevelopment() {
  if (!isTretnixLocalDevelopment()) {
    throw new Error("Tretnix local admin is available only in the development profile.");
  }
}

export async function getAdminSessionDetails(_request: Request) {
  if (!isTretnixLocalDevelopment()) return null;
  return {
    userId: LOCAL_USER_ID,
    email: LOCAL_EMAIL,
    csrfToken: LOCAL_CSRF,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  };
}

export async function loginAdmin(_request: Request, _email: string, _password: string) {
  requireLocalDevelopment();
  return {
    token: "local-development-only",
    userId: LOCAL_USER_ID,
    email: LOCAL_EMAIL,
    csrfToken: LOCAL_CSRF,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  };
}

export async function logoutAdmin(_request: Request, csrfToken: string) {
  requireLocalDevelopment();
  if (csrfToken !== LOCAL_CSRF) throw new Error("Richiesta admin locale non autorizzata.");
}

export async function requireAdmin(_request: Request) {
  requireLocalDevelopment();
  return { userId: LOCAL_USER_ID, email: LOCAL_EMAIL };
}

export async function requireAdminCsrf(_request: Request, csrfToken: string) {
  requireLocalDevelopment();
  if (csrfToken !== LOCAL_CSRF) throw new Error("Richiesta admin locale non autorizzata.");
  return { userId: LOCAL_USER_ID, email: LOCAL_EMAIL };
}

export function serializeSessionCookie(_token: string) {
  return "tretnix_local_admin=1; SameSite=Strict; Path=/; Max-Age=3600";
}

export function clearSessionCookie() {
  return "tretnix_local_admin=; SameSite=Strict; Path=/; Max-Age=0";
}
