import { useState } from "react";
import { useResolvedUrl } from "@/lib/storage";

type ImgProps = React.ImgHTMLAttributes<HTMLImageElement> & { src?: string | null };
type VidProps = React.VideoHTMLAttributes<HTMLVideoElement> & { src?: string | null };

function Placeholder({ className }: { className?: string }) {
  return (
    <div
      className={
        "flex items-center justify-center bg-gradient-to-br from-white/[0.03] to-white/[0.01] text-[11px] uppercase tracking-[0.22em] text-subtle " +
        (className ?? "")
      }
      aria-hidden
    >
      Anteprima in arrivo
    </div>
  );
}

/** <img> that resolves Supabase storage URLs (private bucket → signed URL). */
export function StorageImage({ src, alt = "", className, ...rest }: ImgProps) {
  const resolved = useResolvedUrl(src);
  const [errored, setErrored] = useState(false);
  if (!resolved || errored) return <Placeholder className={className} />;
  return (
    <img
      src={resolved}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
      {...rest}
    />
  );
}

/** <video> that resolves Supabase storage URLs. */
export function StorageVideo({ src, className, ...rest }: VidProps) {
  const resolved = useResolvedUrl(src);
  const [errored, setErrored] = useState(false);
  if (!resolved || errored) return <Placeholder className={className} />;
  return (
    <video
      src={resolved}
      className={className}
      onError={() => setErrored(true)}
      {...rest}
    />
  );
}
