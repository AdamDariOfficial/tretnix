import { useResolvedUrl } from "@/lib/storage";

type ImgProps = React.ImgHTMLAttributes<HTMLImageElement> & { src?: string | null };
type VidProps = React.VideoHTMLAttributes<HTMLVideoElement> & { src?: string | null };

/** <img> that resolves Supabase storage URLs (private bucket → signed URL). */
export function StorageImage({ src, alt = "", ...rest }: ImgProps) {
  const resolved = useResolvedUrl(src);
  if (!resolved) return null;
  return <img src={resolved} alt={alt} {...rest} />;
}

/** <video> that resolves Supabase storage URLs. */
export function StorageVideo({ src, ...rest }: VidProps) {
  const resolved = useResolvedUrl(src);
  if (!resolved) return null;
  return <video src={resolved} {...rest} />;
}
