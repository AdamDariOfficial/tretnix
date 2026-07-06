import logoAsset from "@/assets/tretnix-logo.svg.asset.json";

type Props = {
  variant?: "horizontal" | "icon";
  className?: string;
};

/**
 * Reusable Tretnix brand logo. Uses the master SVG uploaded to CDN.
 * - "horizontal": full logo with wordmark (navbar, footer)
 * - "icon": crop of the T symbol (compact placements)
 */
export function TretnixLogo({ variant = "horizontal", className = "" }: Props) {
  if (variant === "icon") {
    // Icon crop of the source SVG (viewBox aligned to the T mark)
    return (
      <svg
        viewBox="150 90 250 240"
        className={className}
        role="img"
        aria-label="Tretnix Software Studio"
        preserveAspectRatio="xMidYMid meet"
      >
        <path fill="#f5f7fa" d="m280 320l40-40v-140l-40 40z" />
        <path fill="#0b63ff" d="m280 140l40-40h-160l40 40z" />
        <path fill="#f5f7fa" d="m360 100l-40 40h120l-40-40z" />
        <path fill="#0b63ff" d="m340 260v-100h20v80z" />
      </svg>
    );
  }
  return (
    <img
      src={logoAsset.url}
      alt="Tretnix Software Studio"
      className={`block w-auto object-contain ${className}`}
      draggable={false}
    />
  );
}
