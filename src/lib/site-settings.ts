import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = {
  contact_email: string;
  contact_phone: string;
  location: string;
  cta_email_subject: string;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  contact_email: "hello@tretnix.com",
  contact_phone: "+39 049 000 0000",
  location: "Padova, Italia",
  cta_email_subject: "Nuovo progetto Tretnix",
};

let cache: SiteSettings | null = null;
const listeners = new Set<(s: SiteSettings) => void>();

export async function fetchSiteSettings(): Promise<SiteSettings> {
  if (cache) return cache;
  const { data } = await supabase
    .from("site_settings")
    .select("contact_email,contact_phone,location,cta_email_subject")
    .eq("id", 1)
    .maybeSingle();
  cache = (data as SiteSettings) ?? DEFAULT_SETTINGS;
  listeners.forEach((l) => l(cache!));
  return cache;
}

export function refreshSiteSettings() {
  cache = null;
  return fetchSiteSettings();
}

export function useSiteSettings(): SiteSettings {
  const [s, setS] = useState<SiteSettings>(cache ?? DEFAULT_SETTINGS);
  useEffect(() => {
    listeners.add(setS);
    if (!cache) void fetchSiteSettings();
    else setS(cache);
    return () => {
      listeners.delete(setS);
    };
  }, []);
  return s;
}

export function mailtoHref(s: SiteSettings) {
  return `mailto:${s.contact_email}?subject=${encodeURIComponent(s.cta_email_subject)}`;
}
export function telHref(s: SiteSettings) {
  return `tel:${s.contact_phone.replace(/\s+/g, "")}`;
}
