import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

import type { SortOrder } from '../../lib/catalog';
import { cn } from '../../lib/utils';

type SortableThProps<T extends string> = {
  label: string;
  column: T;
  activeColumn: T;
  sortOrder: SortOrder;
  onSort: (column: T) => void;
  className?: string;
  align?: 'left' | 'right';
};

export function SortableTh<T extends string>({
  label,
  column,
  activeColumn,
  sortOrder,
  onSort,
  className,
  align = 'left',
}: SortableThProps<T>) {
  const active = activeColumn === column;
  const ariaSort = active
    ? sortOrder === 'asc'
      ? 'ascending'
      : 'descending'
    : 'none';

  return (
    <th
      scope="col"
      aria-sort={ariaSort}
      className={cn(
        'border-b border-[var(--cadence-border)] px-3 py-3 text-xs font-semibold tracking-wide text-[var(--cadence-fg-muted)] uppercase',
        align === 'right' ? 'text-right' : 'text-left',
        className,
      )}
    >
      <button
        type="button"
        className={cn(
          'inline-flex items-center gap-1.5 rounded-sm transition-colors hover:text-[var(--cadence-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cadence-ring)]',
          align === 'right' && 'flex-row-reverse',
          active && 'text-[var(--cadence-fg)]',
        )}
        onClick={() => {
          onSort(column);
        }}
      >
        <span>{label}</span>
        {active && sortOrder === 'asc' ? (
          <ArrowUp className="size-3.5 shrink-0" aria-hidden />
        ) : null}
        {active && sortOrder === 'desc' ? (
          <ArrowDown className="size-3.5 shrink-0" aria-hidden />
        ) : null}
        {!active ? (
          <ArrowUpDown className="size-3.5 shrink-0 opacity-40" aria-hidden />
        ) : null}
      </button>
    </th>
  );
}
