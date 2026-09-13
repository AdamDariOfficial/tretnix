import { listPublicProjectMedia,listAdminProjectMedia,addAdminProjectMedia,updateAdminProjectMedia,deleteAdminProjectMedia } from "@/features/tretnix/live.functions";
import { requireAdminCsrfToken } from "./admin-session";
export type ProjectMedia={id:string;project_id:string;type:"image"|"video";url:string;caption:string|null;alt_text:string|null;sort_order:number;created_at:string;updated_at:string};
export async function listProjectMedia(projectId:string){return listPublicProjectMedia({data:{projectId}}) as Promise<ProjectMedia[]>;}
export async function adminListProjectMedia(projectId:string){return listAdminProjectMedia({data:{projectId}}) as Promise<ProjectMedia[]>;}
export async function adminAddMedia(input:Omit<ProjectMedia,"id"|"created_at"|"updated_at">){return addAdminProjectMedia({data:{media:input,csrfToken:await requireAdminCsrfToken()}}) as Promise<ProjectMedia>;}
export async function adminUpdateMedia(id:string,patch:Partial<Pick<ProjectMedia,"url"|"caption"|"alt_text"|"sort_order"|"type">>){await updateAdminProjectMedia({data:{id,patch,csrfToken:await requireAdminCsrfToken()}});}
export async function adminDeleteMedia(id:string){await deleteAdminProjectMedia({data:{id,csrfToken:await requireAdminCsrfToken()}});}
export async function adminSwapMediaOrder(a:ProjectMedia,b:ProjectMedia){await adminUpdateMedia(a.id,{sort_order:b.sort_order});await adminUpdateMedia(b.id,{sort_order:a.sort_order});}
