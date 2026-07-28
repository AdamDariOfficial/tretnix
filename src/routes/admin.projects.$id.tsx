import { createFileRoute } from "@tanstack/react-router";
import { ProjectForm } from "./admin.projects.new";

export const Route = createFileRoute("/admin/projects/$id")({
  component: AdminProjectEditPage,
});

function AdminProjectEditPage() {
  const { id } = Route.useParams();
  return <ProjectForm mode="edit" id={id} />;
}
