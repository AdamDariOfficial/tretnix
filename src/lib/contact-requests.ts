import { z } from "zod";
import { listAdminContacts,setAdminContactStatus,deleteAdminContact } from "@/features/tretnix/live.functions";
import { isTretnixLive } from "@/features/tretnix/profile";
import { requireAdminCsrfToken } from "./admin-session";
export const NEEDS_OPTIONS=["Gestionale su misura","CRM","Dashboard","Automazioni","Ordini o prenotazioni","Fornitori o magazzino","Sito o landing con funzioni avanzate","Non lo so ancora, voglio una consulenza"] as const;
export const STARTING_POINTS=["Voglio capire cosa mi serve","Ho già un processo da digitalizzare","Voglio partire da una prima versione essenziale","Ho bisogno di un sistema completo","Voglio migliorare un software esistente"] as const;
export const CONTACT_STATUSES=["new","contacted","archived"] as const;
export type ContactStatus=(typeof CONTACT_STATUSES)[number];
export const contactRequestSchema=z.object({full_name:z.string().trim().min(2,"Inserisci nome e cognome").max(120),email:z.string().trim().email("Email non valida").max(180),phone:z.string().trim().max(40).optional().or(z.literal("")),business_name:z.string().trim().max(160).optional().or(z.literal("")),needs:z.array(z.string().max(80)).max(20),starting_point:z.string().max(200).optional().or(z.literal("")),message:z.string().trim().min(10,"Scrivi almeno 10 caratteri").max(3000),privacy_accepted:z.literal(true,{errorMap:()=>({message:"Devi accettare la privacy"})})});
export type ContactRequestInput=z.infer<typeof contactRequestSchema>;
export type ContactRequest={id:string;full_name:string;email:string;phone:string|null;business_name:string|null;needs:string[];starting_point:string|null;message:string;privacy_accepted:boolean;source_path:string|null;status:ContactStatus;created_at:string;updated_at:string};
export async function submitContactRequest(input:ContactRequestInput,source_path:string,honeypot?:string){
  if (!isTretnixLive()) return;
  const response=await fetch("/api/tretnix/contact-requests",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({submission_key:crypto.randomUUID(),input,source_path,honeypot})});
  if(!response.ok)throw new Error("Invio della richiesta non riuscito.");
}
export async function adminListContactRequests(){return listAdminContacts() as Promise<ContactRequest[]>;}
export async function adminUpdateStatus(id:string,status:ContactStatus){await setAdminContactStatus({data:{id,status,csrfToken:await requireAdminCsrfToken()}});}
export async function adminDeleteContactRequest(id:string){await deleteAdminContact({data:{id,csrfToken:await requireAdminCsrfToken()}});}
