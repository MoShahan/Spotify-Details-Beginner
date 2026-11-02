/** Shared rating average helpers for song / artist list + top endpoints. */

export function averageFromValues(
  values: { value: { toString(): string } }[],
): {
  averageRating: number | null;
  ratingCount: number;
} {
  if (values.length === 0) {
    return { averageRating: null, ratingCount: 0 };
  }
  const sum = values.reduce(
    (acc, row) => acc + Number(row.value.toString()),
    0,
  );
  const average = sum / values.length;
  return {
    averageRating: Math.round(average * 10) / 10,
    ratingCount: values.length,
  };
}

/** Sort rated items first (higher avg), unrated last; stable by name. */
export function compareByAverageThenName(
  a: { averageRating: number | null; name: string },
  b: { averageRating: number | null; name: string },
): number {
  if (a.averageRating === null && b.averageRating === null) {
    return a.name.localeCompare(b.name);
  }
  if (a.averageRating === null) {
    return 1;
  }
  if (b.averageRating === null) {
    return -1;
  }
  if (b.averageRating !== a.averageRating) {
    return b.averageRating - a.averageRating;
  }
  return a.name.localeCompare(b.name);
}
