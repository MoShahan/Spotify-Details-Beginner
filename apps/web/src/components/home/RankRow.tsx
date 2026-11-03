import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { cn } from '../../lib/utils';
import { CatalogThumb } from '../catalog/CatalogThumb';

type RankRowProps = {
  rank: number;
  to: string;
  title: string;
  meta: ReactNode;
  rating: string;
  imageSrc: string | null;
  imageAlt: string;
};

export function RankRow({
  rank,
  to,
  title,
  meta,
  rating,
  imageSrc,
  imageAlt,
}: RankRowProps) {
  const isTopThree = rank <= 3;

  return (
    <li className="flex items-center gap-3 px-1 py-2.5 transition-colors hover:bg-[var(--cadence-muted)]/40">
      <span
        className={cn(
          'w-6 shrink-0 text-center text-sm tabular-nums',
          isTopThree
            ? 'font-semibold text-[var(--cadence-accent)]'
            : 'font-medium text-[var(--cadence-fg-muted)]',
        )}
      >
        {rank}
      </span>
      <Link to={to} tabIndex={-1} className="shrink-0">
        <CatalogThumb src={imageSrc} alt={imageAlt} size="md" />
      </Link>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'truncate text-[var(--cadence-fg)]',
            isTopThree ? 'font-semibold' : 'font-medium',
          )}
        >
          <Link to={to} className="underline-offset-4 hover:underline">
            {title}
          </Link>
        </p>
        <p className="truncate text-sm text-[var(--cadence-fg-muted)]">
          {meta}
        </p>
      </div>
      <span
        className={cn(
          'shrink-0 text-sm tabular-nums',
          isTopThree
            ? 'font-semibold text-[var(--cadence-fg)]'
            : 'font-medium text-[var(--cadence-fg)]',
        )}
      >
        {rating}
      </span>
    </li>
  );
}
