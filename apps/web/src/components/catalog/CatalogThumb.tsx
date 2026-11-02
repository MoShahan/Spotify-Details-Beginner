type CatalogThumbProps = {
  src: string | null;
  alt: string;
};

/** Compact square thumb for catalog tables (~40px). */
export function CatalogThumb({ src, alt }: CatalogThumbProps) {
  return (
    <div className="size-10 shrink-0 overflow-hidden rounded-[calc(var(--cadence-radius)-2px)] border border-[var(--cadence-border)] bg-[var(--cadence-muted)]/40 shadow-[var(--cadence-shadow-sm)]">
      {src ? (
        <img src={src} alt={alt} className="size-full object-cover" />
      ) : (
        <div
          className="flex size-full items-center justify-center text-[10px] font-medium tracking-wide text-[var(--cadence-fg-muted)] uppercase"
          aria-hidden
        >
          N/A
        </div>
      )}
    </div>
  );
}
