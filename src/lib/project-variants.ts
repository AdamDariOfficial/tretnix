import { listPublicProjectVariants,listAdminProjectVariants,replaceAdminProjectVariants } from "@/features/tretnix/live.functions";
import { requireAdminCsrfToken } from "./admin-session";
export type ProjectPlan="START"|"BUSINESS"|"BUSINESS_PLUS";
export type ProjectVariant={id:string;project_id:string;plan:ProjectPlan;label:string;short_description:string;goal:string;features:string[];demo_url:string|null;publish_status:"draft"|"published";sort_order:number};
export type ProjectVariantInput=Omit<ProjectVariant,"id"|"project_id">;
export async function listProjectVariants(projectId:string){return listPublicProjectVariants({data:{projectId}}) as Promise<ProjectVariant[]>;}
export const listPublishedProjectVariants=listProjectVariants;
export async function adminListProjectVariants(projectId:string){return listAdminProjectVariants({data:{projectId}}) as Promise<ProjectVariant[]>;}
export async function adminReplaceProjectVariants(projectId:string,variants:ProjectVariantInput[]){const normalized=variants.map(v=>({id:"",project_id:projectId,...v,publish_status:v.plan==="BUSINESS_PLUS"?"draft":v.publish_status})) as ProjectVariant[];await replaceAdminProjectVariants({data:{projectId,variants:normalized,csrfToken:await requireAdminCsrfToken()}});}
