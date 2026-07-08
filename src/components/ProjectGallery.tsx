import { useCallback, useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { StorageImage, StorageVideo } from "@/components/StorageMedia";
import type { ProjectMedia } from "@/lib/project-media";

type Props = {
  items: ProjectMedia[];
  projectTitle: string;
};

export function ProjectGallery({ items, projectTitle }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const close = useCallback(() => setLightboxIndex(null), []);
  const prev = useCallback(
    () => setLightboxIndex((i) => (i === null ? i : (i - 1 + items.length) % items.length)),
    [items.length],
  );
  const next = useCallback(
    () => setLightboxIndex((i) => (i === null ? i : (i + 1) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxIndex, close, prev, next]);

  if (items.length === 0) return null;

  const active = lightboxIndex !== null ? items[lightboxIndex] : null;

  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((m, i) => (
          <figure
            key={m.id}
            className="group overflow-hidden rounded-2xl border border-border bg-white/[0.02] transition-all duration-200 ease-out hover:-translate-y-1 hover:border-primary-glow/50 hover:shadow-[0_20px_60px_-20px_rgba(11,99,255,0.35)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(i)}
              className="block w-full text-left"
              aria-label={`Apri ${m.caption ?? m.alt_text ?? "media"} a schermo intero`}
            >
              {m.type === "video" ? (
                <StorageVideo
                  src={m.url}
                  muted
                  playsInline
                  className="aspect-video w-full object-cover"
                  aria-label={m.alt_text ?? m.caption ?? "Video del progetto"}
                />
              ) : (
                <StorageImage
                  src={m.url}
                  alt={m.alt_text ?? m.caption ?? projectTitle}
                  className="aspect-video w-full object-cover"
                  loading="lazy"
                />
              )}
            </button>
            {m.caption && (
              <figcaption className="border-t border-border px-4 py-2.5 text-xs text-subtle">
                {m.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {active && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-8 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Chiudi"
            className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/40 p-2 text-white transition hover:border-white/60 hover:bg-black/70"
          >
            <X className="h-5 w-5" />
          </button>

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="Precedente"
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-2.5 text-white transition hover:border-white/60 hover:bg-black/70"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="Successiva"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-2.5 text-white transition hover:border-white/60 hover:bg-black/70"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-black/50 px-3 py-1 text-xs text-white/85">
                {lightboxIndex + 1} / {items.length}
              </div>
            </>
          )}

          <div
            className="relative flex max-h-full max-w-6xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {active.type === "video" ? (
              <StorageVideo
                src={active.url}
                controls
                autoPlay
                playsInline
                className="max-h-[85vh] w-auto max-w-full rounded-xl"
              />
            ) : (
              <StorageImage
                src={active.url}
                alt={active.alt_text ?? active.caption ?? projectTitle}
                className="max-h-[85vh] w-auto max-w-full rounded-xl object-contain"
              />
            )}
            {active.caption && (
              <div className="mt-3 max-w-2xl text-center text-sm text-white/80">
                {active.caption}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
