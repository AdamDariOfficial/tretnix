import { scryptSync } from "node:crypto";

const encoder = new TextEncoder();
export const ADMIN_PASSWORD_SCHEME = "scrypt-n16384-r8-p5-hmac-sha256-pepper-v2";
export const ADMIN_PASSWORD_SCRYPT_N = 16_384;
export const ADMIN_PASSWORD_SCRYPT_R = 8;
export const ADMIN_PASSWORD_SCRYPT_P = 5;
export const ADMIN_PASSWORD_SCRYPT_MAXMEM_BYTES = 32 * 1024 * 1024;
export const ADMIN_PASSWORD_WORK_FACTOR = ADMIN_PASSWORD_SCRYPT_N * ADMIN_PASSWORD_SCRYPT_R * ADMIN_PASSWORD_SCRYPT_P;
const ADMIN_PASSWORD_SALT_BYTES = 16;
const ADMIN_SESSION_TOKEN_BYTES = 32;
const ADMIN_CSRF_CONTEXT = "tretnix-admin-csrf-v1";

function base64UrlEncode(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function base64UrlDecode(value: string) {
  if (!/^[A-Za-z0-9_-]+$/.test(value) || value.length % 4 === 1) throw new Error("invalid base64url");
  const binary = atob(value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "="));
  const decoded = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  if (base64UrlEncode(decoded) !== value) throw new Error("non canonical base64url");
  return decoded;
}
function randomBytes(length: number) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}
async function importHmacSecret(secret: string) {
  if (secret.length < 32) throw new Error("Admin auth secret is too short.");
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
}
function derivePasswordBits(password: string, salt: Uint8Array) {
  return new Uint8Array(scryptSync(encoder.encode(password), salt, 32, {
    N: ADMIN_PASSWORD_SCRYPT_N, r: ADMIN_PASSWORD_SCRYPT_R, p: ADMIN_PASSWORD_SCRYPT_P,
    maxmem: ADMIN_PASSWORD_SCRYPT_MAXMEM_BYTES,
  }));
}
export async function createAdminPasswordRecord(password: string, pepper: string) {
  const salt = randomBytes(ADMIN_PASSWORD_SALT_BYTES);
  const derived = derivePasswordBits(password, salt);
  const key = await importHmacSecret(pepper);
  const tag = new Uint8Array(await crypto.subtle.sign("HMAC", key, derived));
  return { scheme: ADMIN_PASSWORD_SCHEME, passwordWorkFactor: ADMIN_PASSWORD_WORK_FACTOR, salt: base64UrlEncode(salt), passwordHash: base64UrlEncode(tag) };
}
export async function verifyAdminPassword(password: string, input: { scheme: unknown; passwordWorkFactor: unknown; salt: unknown; passwordHash: unknown }, pepper: string) {
  if (input.scheme !== ADMIN_PASSWORD_SCHEME || input.passwordWorkFactor !== ADMIN_PASSWORD_WORK_FACTOR || typeof input.salt !== "string" || typeof input.passwordHash !== "string") return false;
  try {
    const salt = base64UrlDecode(input.salt);
    const expected = base64UrlDecode(input.passwordHash);
    if (salt.byteLength !== 16 || expected.byteLength !== 32) return false;
    const derived = derivePasswordBits(password, salt);
    const key = await importHmacSecret(pepper);
    const actual = new Uint8Array(await crypto.subtle.sign("HMAC", key, derived));
    return crypto.subtle.timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}
export function createOpaqueAdminSessionToken() { return base64UrlEncode(randomBytes(ADMIN_SESSION_TOKEN_BYTES)); }
export async function hashOpaqueToken(token: string) {
  return base64UrlEncode(new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(token))));
}
export async function createSessionCsrfToken(sessionToken: string, secret: string) {
  const key = await importHmacSecret(secret);
  return base64UrlEncode(new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(`${ADMIN_CSRF_CONTEXT}:${sessionToken}`))));
}
export async function verifySessionCsrfToken(sessionToken: string, candidate: string, secret: string) {
  try {
    const actual = base64UrlDecode(candidate);
    const expected = base64UrlDecode(await createSessionCsrfToken(sessionToken, secret));
    return actual.byteLength === 32 && crypto.subtle.timingSafeEqual(actual, expected);
  } catch { return false; }
}
export async function fingerprintAdminAuthSecret(secret: string) {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(secret)));
  return Array.from(digest, (byte) => byte.toString(16).padStart(2, "0")).join("").slice(0, 16);
}
