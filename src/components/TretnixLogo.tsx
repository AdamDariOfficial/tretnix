type Props = {
  variant?: "horizontal" | "icon";
  className?: string;
};

export function TretnixLogo({ variant = "horizontal", className = "" }: Props) {
  if (variant === "icon") {
    return (
      <svg viewBox="0 0 40 40" className={className} aria-label="Tretnix">
        <defs>
          <linearGradient id="tx-g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#1E7BFF" />
            <stop offset="1" stopColor="#0B63FF" />
          </linearGradient>
        </defs>
        <rect x="1" y="1" width="38" height="38" rx="9" fill="none" stroke="rgba(255,255,255,0.18)" />
        <path d="M10 13 H30 M20 13 V29" stroke="url(#tx-g)" strokeWidth="2.6" strokeLinecap="square" fill="none" />
        <circle cx="30" cy="13" r="2" fill="#1E7BFF" />
      </svg>
    );
  }
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`} aria-label="Tretnix Software Studio">
      <svg viewBox="0 0 40 40" className="h-full w-auto shrink-0" aria-hidden="true">
        <defs>
          <linearGradient id="tx-h" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#1E7BFF" />
            <stop offset="1" stopColor="#0B63FF" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="36" height="36" rx="8" fill="none" stroke="rgba(255,255,255,0.22)" />
        <path d="M10 13 H30 M20 13 V29" stroke="url(#tx-h)" strokeWidth="2.8" strokeLinecap="square" fill="none" />
        <circle cx="30" cy="13" r="2.2" fill="#1E7BFF" />
      </svg>
      <span className="font-serif text-[1.35em] leading-none tracking-tight text-foreground">
        Tretnix
      </span>
    </div>
  );
}
