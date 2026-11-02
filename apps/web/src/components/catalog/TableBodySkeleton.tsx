import { Skeleton } from '../ui/skeleton';

/** Row skeletons only - use under a real `<thead>` that stays mounted while loading. */
export function TableBodySkeleton({
  columns,
  rows = 6,
}: {
  columns: number;
  rows?: number;
}) {
  return (
    <>
      {Array.from({ length: rows }, (_, row) => (
        <tr key={`skeleton-row-${row}`}>
          {Array.from({ length: columns }, (_, col) => (
            <td
              key={`skeleton-cell-${row}-${col}`}
              className="border-b border-[var(--cadence-border)] px-3 py-3"
            >
              <Skeleton className="h-5 w-full" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
