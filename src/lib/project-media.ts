import { supabase } from "@/integrations/supabase/client";

export type ProjectMedia = {
  id: string;
  project_id: string;
  type: "image" | "video";
  url: string;
  caption: string | null;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

const SELECT = "id,project_id,type,url,caption,alt_text,sort_order,created_at,updated_at";

export async function listProjectMedia(projectId: string): Promise<ProjectMedia[]> {
  const { data, error } = await supabase
    .from("project_media")
    .select(SELECT)
    .eq("project_id", projectId)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as ProjectMedia[];
}

export async function adminAddMedia(
  input: Omit<ProjectMedia, "id" | "created_at" | "updated_at">,
): Promise<ProjectMedia> {
  const { data, error } = await supabase
    .from("project_media")
    .insert(input)
    .select(SELECT)
    .single();
  if (error) throw error;
  return data as ProjectMedia;
}

export async function adminUpdateMedia(
  id: string,
  patch: Partial<Pick<ProjectMedia, "url" | "caption" | "alt_text" | "sort_order" | "type">>,
): Promise<void> {
  const { error } = await supabase.from("project_media").update(patch).eq("id", id);
  if (error) throw error;
}

export async function adminDeleteMedia(id: string): Promise<void> {
  const { error } = await supabase.from("project_media").delete().eq("id", id);
  if (error) throw error;
}

export async function adminSwapMediaOrder(a: ProjectMedia, b: ProjectMedia): Promise<void> {
  await Promise.all([
    adminUpdateMedia(a.id, { sort_order: b.sort_order }),
    adminUpdateMedia(b.id, { sort_order: a.sort_order }),
  ]);
}
