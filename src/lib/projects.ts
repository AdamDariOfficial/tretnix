import {
  listPublicProjects,getPublicProjectBySlug,listAdminProjects,getAdminProject,saveAdminProject,deleteAdminProject,patchAdminProject,
} from "@/features/tretnix/live.functions";
import { requireAdminCsrfToken } from "./admin-session";
export type Project={id:string;slug:string;title:string;category:string;short_description:string;overview:string;problem:string;solution:string;audience:string;features:string[];impact_points:string[];modules:string[];workflow_steps:string[];customizations:string[];tech_stack:string[];image_url:string|null;gradient:string;badge:string|null;is_concept:boolean;is_visible:boolean;is_featured:boolean;sort_order:number};
export async function listVisibleProjects(){return listPublicProjects({data:{}}) as Promise<Project[]>;}
export async function listFeaturedProjects(limit=2){const rows=await listPublicProjects({data:{featured:true}}) as Project[];return rows.slice(0,limit);}
export async function getProjectBySlug(slug:string){return getPublicProjectBySlug({data:{slug}}) as Promise<Project|null>;}
export async function adminListProjects(){return listAdminProjects() as Promise<Project[]>;}
export async function adminGetProject(id:string){return getAdminProject({data:{id}}) as Promise<Project|null>;}
export async function adminUpsertProject(project:Partial<Project>&{slug:string;title:string}){return saveAdminProject({data:{project,csrfToken:await requireAdminCsrfToken()}}) as Promise<Project>;}
export async function adminDeleteProject(id:string){await deleteAdminProject({data:{id,csrfToken:await requireAdminCsrfToken()}});}
export async function adminSetVisibility(id:string,is_visible:boolean){await patchAdminProject({data:{id,is_visible,csrfToken:await requireAdminCsrfToken()}});}
export async function adminSetFeatured(id:string,is_featured:boolean){await patchAdminProject({data:{id,is_featured,csrfToken:await requireAdminCsrfToken()}});}
export async function adminUpdateOrder(id:string,sort_order:number){await patchAdminProject({data:{id,sort_order,csrfToken:await requireAdminCsrfToken()}});}
