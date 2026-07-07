import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const BUCKET = "project-images";
const SIGN_TTL = 60 * 60; // 1 hour

/**
 * Extract the storage path from any supported URL/marker form.
 * Returns null if the url is an external non-storage URL that we should render as-is.
 */
export function extractStoragePath(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("sb://")) return url.slice(5);
  const m = url.match(/\/storage\/v1\/object\/(?:public|sign)\/project-images\/([^?#]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

/** Async: resolve a stored value to a real playable URL. */
export async function resolveStorageUrl(url: string | null | undefined): Promise<string | null> {
  if (!url) return null;
  const path = extractStoragePath(url);
  if (!path) return url;
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, SIGN_TTL);
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

/** React hook: returns a browser-usable URL for storage-backed or external URLs. */
export function useResolvedUrl(url: string | null | undefined) {
  const isStorage = !!extractStoragePath(url);
  const [resolved, setResolved] = useState<string | null>(() => (isStorage ? null : (url ?? null)));

  useEffect(() => {
    let cancelled = false;
    if (!url) { setResolved(null); return; }
    if (!extractStoragePath(url)) { setResolved(url); return; }
    setResolved(null);
    void resolveStorageUrl(url).then((u) => { if (!cancelled) setResolved(u); });
    return () => { cancelled = true; };
  }, [url]);

  return resolved;
}

/** Upload a file and return the storage marker to persist (sb://path). */
export async function uploadToProjectImages(file: File, folder: string): Promise<string> {
  const ext = file.name.split(".").pop() || "png";
  const safeFolder = folder.replace(/[^a-z0-9-_]/gi, "-").toLowerCase() || "unnamed";
  const path = `${safeFolder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    upsert: false,
    contentType: file.type,
  });
  if (error) throw error;
  return `sb://${path}`;
}
