export type ProjectDemo = {
  label: string;
  description: string;
  href: string;
};

const PROJECT_DEMOS: Record<string, readonly ProjectDemo[]> = {
  "forno-lume": [
    {
      label: "Esplora START",
      description: "Esperienza single-page mobile-first",
      href: "https://forno-lume.tretnix.com",
    },
    {
      label: "Esplora BUSINESS",
      description: "Esperienza multipagina estesa",
      href: "https://forno-lume-business.tretnix.com",
    },
  ],
  "rito-studio": [
    {
      label: "Esplora START",
      description: "Esperienza one-page mobile-first",
      href: "https://rito-studio.tretnix.com",
    },
    {
      label: "Esplora BUSINESS",
      description: "Esperienza multipagina estesa",
      href: "https://rito-studio-business.tretnix.com",
    },
  ],
};

export function getProjectDemos(slug: string): readonly ProjectDemo[] {
  return PROJECT_DEMOS[slug] ?? [];
}
