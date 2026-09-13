type Props = {
  title: string;
  category: string;
  compact?: boolean;
};

function themeFor(category: string) {
  const normalized = category.toLowerCase();

  if (normalized.includes("hospitality")) {
    return {
      shell: "bg-[#17100c] text-[#f4ede8]",
      panel: "border-[#d97848]/25 bg-[#24160f]",
      accent: "bg-[#d97848]",
      accentText: "text-[#e38a5e]",
      muted: "text-[#c8b6aa]",
      rule: "bg-[#d97848]/35",
      halo: "bg-[radial-gradient(circle,rgba(217,120,72,0.22),transparent_68%)]",
      family: "Hospitality",
    };
  }

  if (normalized.includes("beauty") || normalized.includes("wellness")) {
    return {
      shell: "bg-[#ede8df] text-[#231d1e]",
      panel: "border-[#6a3f4b]/20 bg-[#f5f1e9]",
      accent: "bg-[#6a3f4b]",
      accentText: "text-[#6a3f4b]",
      muted: "text-[#6a625f]",
      rule: "bg-[#6a3f4b]/30",
      halo: "bg-[radial-gradient(circle,rgba(106,63,75,0.16),transparent_68%)]",
      family: "Beauty & Wellness",
    };
  }

  return {
    shell: "bg-[#030b1a] text-[#f5f7fa]",
    panel: "border-primary/25 bg-[#061326]",
    accent: "bg-primary-glow",
    accentText: "text-primary-glow",
    muted: "text-muted-foreground",
    rule: "bg-primary/35",
    halo: "bg-[radial-gradient(circle,rgba(30,123,255,0.2),transparent_68%)]",
    family: category,
  };
}

export function ProjectPortfolioCover({ title, category, compact = false }: Props) {
  const theme = themeFor(category);

  return (
    <div className={`relative h-full w-full overflow-hidden ${theme.shell}`} aria-hidden="true">
      <div className={`absolute -right-[18%] -top-[18%] h-[70%] w-[70%] rounded-full blur-2xl ${theme.halo}`} />
      <div className="absolute inset-0 opacity-[0.16] bg-grid" />

      <div className={`absolute inset-[8%] overflow-hidden rounded-[1.35rem] border ${theme.panel}`}>
        <div className="flex h-10 items-center gap-1.5 border-b border-current/10 px-4">
          <span className="h-1.5 w-1.5 rounded-full bg-current/20" />
          <span className="h-1.5 w-1.5 rounded-full bg-current/20" />
          <span className="h-1.5 w-1.5 rounded-full bg-current/20" />
          <span className={`ml-auto text-[9px] uppercase tracking-[0.24em] ${theme.muted}`}>
            Concept Tretnix
          </span>
        </div>

        <div className="grid h-[calc(100%_-_2.5rem)] grid-cols-[1.1fr_0.9fr] gap-4 p-5 sm:p-6">
          <div className="flex min-w-0 flex-col justify-between">
            <div>
              <div className={`h-px w-10 ${theme.rule}`} />
              <div className={`mt-3 text-[9px] uppercase tracking-[0.24em] ${theme.accentText}`}>
                {theme.family}
              </div>
              <div className={`mt-2 font-serif leading-none ${compact ? "text-xl" : "text-3xl sm:text-4xl"}`}>
                {title}
              </div>
            </div>

            <div className="space-y-2">
              <div className={`h-1.5 w-4/5 rounded-full ${theme.accent} opacity-75`} />
              <div className="h-1.5 w-3/5 rounded-full bg-current/10" />
              <div className="h-1.5 w-2/5 rounded-full bg-current/10" />
            </div>
          </div>

          <div className="grid grid-rows-[1.25fr_0.75fr] gap-3">
            <div className="relative overflow-hidden rounded-xl border border-current/10 bg-current/[0.04]">
              <div className={`absolute inset-x-[14%] top-[16%] h-[52%] rounded-full blur-xl ${theme.halo}`} />
              <div className={`absolute bottom-4 left-4 h-1.5 w-10 rounded-full ${theme.accent}`} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-current/10 bg-current/[0.035]" />
              <div className="rounded-lg border border-current/10 bg-current/[0.035]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
