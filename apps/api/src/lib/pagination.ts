/** Slice a full sorted list into an offset/limit page for catalog endpoints. */
export function paginateItems<T>(
  items: readonly T[],
  offset: number,
  limit: number,
): { items: T[]; hasMore: boolean } {
  const page = items.slice(offset, offset + limit);
  return {
    items: page,
    hasMore: offset + page.length < items.length,
  };
}
