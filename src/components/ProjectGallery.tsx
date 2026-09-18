import { useCallback, useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { StorageImage, StorageVideo } from "@/components/StorageMedia";
import type { ProjectMedia } from "@/lib/project-media";

type Props = {
  items: ProjectMedia[];
  projectTitle: string;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function ProjectGallery({ items, projectTitle }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => setLightboxIndex(null), []);
  const prev = useCallback(
    () => setLightboxIndex((index) => (index === null ? index : (index - 1 + items.length) % items.length)),
    [items.length],
  );
  const next = useCallback(
    () => setLightboxIndex((index) => (index === null ? index : (index + 1) % items.length)),
    [items.length],
  );

  const isOpen = lightboxIndex !== null;

  useEffect(() => {
    if (!isOpen) return;

    const trigger = openerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        prev();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        next();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      window.requestAnimationFrame(() => trigger?.focus());
    };
  }, [isOpen, close, prev, next]);

  if (items.length === 0) return null;

  const active = lightboxIndex !== null ? items[lightboxIndex] : null;

  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((media, index) => (
          <figure
            key={media.id}
            className="group overflow-hidden rounded-2xl border border-border bg-white/[0.02] transition-all duration-200 ease-out hover:-translate-y-1 hover:border-primary-glow/50 hover:shadow-[0_20px_60px_-20px_rgba(11,99,255,0.35)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <button
              type="button"
              onClick={(event) => {
                openerRef.current = event.currentTarget;
                setLightboxIndex(index);
              }}
              className="block w-full text-left"
              aria-label={`Apri ${media.caption ?? media.alt_text ?? "media"} a schermo intero`}
            >
              {media.type === "video" ? (
                <StorageVideo
                  src={media.url}
                  muted
                  playsInline
                  className="aspect-video w-full object-cover"
                  aria-label={media.alt_text ?? media.caption ?? "Video del progetto"}
                />
              ) : (
                <StorageImage
                  src={media.url}
                  alt={media.alt_text ?? media.caption ?? projectTitle}
                  className="aspect-video w-full object-cover"
                  loading="lazy"
                />
              )}
            </button>
            {media.caption && (
              <figcaption className="border-t border-border px-4 py-2.5 text-xs text-subtle">
                {media.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {active && lightboxIndex !== null && (
        <div
          ref={dialogRef}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md sm:p-8 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-label={`Galleria ${projectTitle}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Chiudi galleria"
            className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/40 p-2 text-white transition hover:border-white/60 hover:bg-black/70"
          >
            <X className="h-5 w-5" />
          </button>

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Media precedente"
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-2.5 text-white transition hover:border-white/60 hover:bg-black/70"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Media successivo"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-2.5 text-white transition hover:border-white/60 hover:bg-black/70"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-black/50 px-3 py-1 text-xs text-white/85">
                {lightboxIndex + 1} / {items.length}
              </div>
            </>
          )}

          <div className="relative flex max-h-full max-w-6xl flex-col items-center">
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
