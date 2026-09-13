export type TretnixBackendProfile = "local" | "live";

export function getTretnixBackendProfile(): TretnixBackendProfile {
  return import.meta.env.VITE_TRETNIX_BACKEND_PROFILE === "live" ? "live" : "local";
}

export function isTretnixLive() {
  return getTretnixBackendProfile() === "live";
}

export function isTretnixLocalDevelopment() {
  return !isTretnixLive() && import.meta.env.DEV;
}
