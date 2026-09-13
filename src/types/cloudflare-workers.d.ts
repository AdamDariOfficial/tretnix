declare module "cloudflare:workers" {
  export const env: unknown;
}

interface SubtleCrypto {
  timingSafeEqual(a: ArrayBufferView, b: ArrayBufferView): boolean;
}
