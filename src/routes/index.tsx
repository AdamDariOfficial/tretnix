import { createFileRoute } from "@tanstack/react-router";
import TretnixLanding from "@/components/TretnixLanding";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ property: "og:url", content: "https://tretnix.com/" }],
    links: [{ rel: "canonical", href: "https://tretnix.com/" }],
  }),
  component: TretnixLanding,
});
