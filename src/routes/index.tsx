import { createFileRoute } from "@tanstack/react-router";
import TretnixLanding from "@/components/TretnixLanding";

export const Route = createFileRoute("/")({
  component: TretnixLanding,
});
