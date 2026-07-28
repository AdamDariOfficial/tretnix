import { supabase } from "@/integrations/supabase/client";

export type Project = {
  id: string;
  slug: string;
  title: string;
  category: string;
  short_description: string;
  overview: string;
  problem: string;
  solution: string;
  audience: string;
  features: string[];
  impact_points: string[];
  modules: string[];
  workflow_steps: string[];
  customizations: string[];
  tech_stack: string[];
  image_url: string | null;
  gradient: string;
  badge: string | null;
  is_concept: boolean;
  is_visible: boolean;
  is_featured: boolean;
  sort_order: number;
};

const SELECT = "id,slug,title,category,short_description,overview,problem,solution,audience,features,impact_points,modules,workflow_steps,customizations,tech_stack,image_url,gradient,badge,is_concept,is_visible,is_featured,sort_order";

export async function listVisibleProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select(SELECT)
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Project[];
}

export async function listFeaturedProjects(limit = 2): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select(SELECT)
    .eq("is_visible", true)
    .eq("is_featured", true)
    .order("sort_order", { ascending: true })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as Project[];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from("projects")
    .select(SELECT)
    .eq("slug", slug)
    .eq("is_visible", true)
    .maybeSingle();
  if (error) throw error;
  return (data as Project) ?? null;
}

// ---------- Admin ----------
export async function adminListProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select(SELECT)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Project[];
}

export async function adminGetProject(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from("projects")
    .select(SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as Project) ?? null;
}

export async function adminUpsertProject(p: Partial<Project> & { slug: string; title: string }): Promise<Project> {
  if (p.id) {
    const { data, error } = await supabase.from("projects").update(p).eq("id", p.id).select(SELECT).single();
    if (error) throw error;
    return data as Project;
  }
  const { data, error } = await supabase.from("projects").insert(p).select(SELECT).single();
  if (error) throw error;
  return data as Project;
}

export async function adminDeleteProject(id: string) {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}

export async function adminSetVisibility(id: string, is_visible: boolean) {
  const { error } = await supabase.from("projects").update({ is_visible }).eq("id", id);
  if (error) throw error;
}
export async function adminSetFeatured(id: string, is_featured: boolean) {
  const { error } = await supabase.from("projects").update({ is_featured }).eq("id", id);
  if (error) throw error;
}
export async function adminUpdateOrder(id: string, sort_order: number) {
  const { error } = await supabase.from("projects").update({ sort_order }).eq("id", id);
  if (error) throw error;
}
