import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

export const NEEDS_OPTIONS = [
  "Gestionale su misura",
  "CRM",
  "Dashboard",
  "Automazioni",
  "Ordini o prenotazioni",
  "Fornitori o magazzino",
  "Sito o landing con funzioni avanzate",
  "Non lo so ancora, voglio una consulenza",
] as const;

export const STARTING_POINTS = [
  "Voglio capire cosa mi serve",
  "Ho già un processo da digitalizzare",
  "Voglio partire da una prima versione essenziale",
  "Ho bisogno di un sistema completo",
  "Voglio migliorare un software esistente",
] as const;

export const CONTACT_STATUSES = ["new", "contacted", "archived"] as const;
export type ContactStatus = (typeof CONTACT_STATUSES)[number];

export const contactRequestSchema = z.object({
  full_name: z.string().trim().min(2, "Inserisci nome e cognome").max(200),
  email: z.string().trim().email("Email non valida").max(320),
  phone: z.string().trim().max(60).optional().or(z.literal("")),
  business_name: z.string().trim().max(200).optional().or(z.literal("")),
  needs: z.array(z.string()).max(20),
  starting_point: z.string().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Scrivi almeno 10 caratteri").max(5000),
  privacy_accepted: z.literal(true, { errorMap: () => ({ message: "Devi accettare la privacy" }) }),
});

export type ContactRequestInput = z.infer<typeof contactRequestSchema>;

export type ContactRequest = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  business_name: string | null;
  needs: string[];
  starting_point: string | null;
  message: string;
  privacy_accepted: boolean;
  source_path: string | null;
  status: ContactStatus;
  created_at: string;
  updated_at: string;
};

export async function submitContactRequest(input: ContactRequestInput, source_path: string) {
  const payload = {
    full_name: input.full_name.trim(),
    email: input.email.trim(),
    phone: input.phone?.trim() || null,
    business_name: input.business_name?.trim() || null,
    needs: input.needs,
    starting_point: input.starting_point || null,
    message: input.message.trim(),
    privacy_accepted: input.privacy_accepted,
    source_path: source_path.slice(0, 200),
    status: "new" as const,
  };
  const { error } = await supabase.from("contact_requests").insert(payload);
  if (error) throw error;
}

export async function adminListContactRequests(): Promise<ContactRequest[]> {
  const { data, error } = await supabase
    .from("contact_requests")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ContactRequest[];
}

export async function adminUpdateStatus(id: string, status: ContactStatus) {
  const { error } = await supabase.from("contact_requests").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function adminDeleteContactRequest(id: string) {
  const { error } = await supabase.from("contact_requests").delete().eq("id", id);
  if (error) throw error;
}
