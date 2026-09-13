import { getAdminSession } from "@/features/tretnix/live.functions";
let csrfToken: string | null = null;
export function setAdminCsrfToken(value:string|null){csrfToken=value;}
export async function requireAdminCsrfToken(){
  if (csrfToken) return csrfToken;
  const session=await getAdminSession();
  if (!session.authenticated) throw new Error("Accesso admin non autorizzato.");
  csrfToken=session.csrfToken;
  return csrfToken;
}
