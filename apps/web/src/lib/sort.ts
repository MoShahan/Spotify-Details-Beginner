import type { SortOrder } from './catalog';

/** Click header: new column -> asc; same column -> toggle. */
export function nextSortState<T extends string>(
  currentColumn: T,
  currentOrder: SortOrder,
  clickedColumn: T,
): { sortBy: T; sortOrder: SortOrder } {
  if (clickedColumn === currentColumn) {
    return {
      sortBy: currentColumn,
      sortOrder: currentOrder === 'asc' ? 'desc' : 'asc',
    };
  }
  return { sortBy: clickedColumn, sortOrder: 'asc' };
}
