import { env as cloudflareEnv } from "cloudflare:workers";

export interface D1Result<T = unknown> {
  results?: T[];
  success?: boolean;
  meta?: { changes?: number };
}
export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  run<T = unknown>(): Promise<D1Result<T>>;
}
export interface D1DatabaseBinding {
  prepare(sql: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<Array<D1Result<T>>>;
}
export interface RateLimitBinding {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}
export interface R2ObjectBodyBinding {
  body: ReadableStream<Uint8Array>;
  httpEtag?: string;
  httpMetadata?: { contentType?: string; cacheControl?: string };
}
export interface R2BucketBinding {
  get(key: string): Promise<R2ObjectBodyBinding | null>;
  put(key: string, value: ReadableStream | ArrayBuffer | Blob, options?: { httpMetadata?: { contentType?: string; cacheControl?: string } }): Promise<unknown>;
  delete(key: string): Promise<void>;
}

export interface TretnixCloudflareEnv {
  TRETNIX_DB?: D1DatabaseBinding;
  TRETNIX_MEDIA?: R2BucketBinding;
  ADMIN_LOGIN_RATE_LIMITER?: RateLimitBinding;
  CONTACT_SUBMIT_RATE_LIMITER?: RateLimitBinding;
  ANALYTICS_RATE_LIMITER?: RateLimitBinding;
  ADMIN_AUTH_PEPPER?: string;
  ADMIN_AUTH_CSRF_SECRET?: string;
  TRETNIX_ENV?: string;
}

export function getTretnixCloudflareEnv() {
  return cloudflareEnv as unknown as TretnixCloudflareEnv;
}
export function requireBinding<K extends keyof TretnixCloudflareEnv>(name: K): NonNullable<TretnixCloudflareEnv[K]> {
  const value = getTretnixCloudflareEnv()[name];
  if (value === undefined || value === null || value === "") throw new Error(`Configurazione Cloudflare incompleta: ${String(name)}.`);
  return value as NonNullable<TretnixCloudflareEnv[K]>;
}
