import { cn } from '../../lib/utils';

type CatalogThumbSize = 'sm' | 'md';

type CatalogThumbProps = {
  src: string | null;
  alt: string;
  size?: CatalogThumbSize;
  className?: string;
};

const sizeClass: Record<CatalogThumbSize, string> = {
  sm: 'size-10',
  md: 'size-12',
};

/** Square catalog thumb for tables (sm) and ranked lists (md). */
export function CatalogThumb({
  src,
  alt,
  size = 'sm',
  className,
}: CatalogThumbProps) {
  return (
    <div
      className={cn(
        'shrink-0 overflow-hidden rounded-[calc(var(--cadence-radius)-2px)] border border-[var(--cadence-border)] bg-[var(--cadence-muted)]',
        sizeClass[size],
        className,
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="cadence-cover-settle size-full object-cover"
        />
      ) : (
        <div className="size-full bg-[var(--cadence-muted)]" aria-hidden />
      )}
    </div>
  );
}
