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
  return compareNullableNumber(
    a.averageRating,
    b.averageRating,
    'desc',
    a.name.localeCompare(b.name),
  );
}

/**
 * Compare nullable numbers. Nulls always sort last regardless of order.
 * `tieBreak` used when values are equal / both null.
 */
export function compareNullableNumber(
  a: number | null,
  b: number | null,
  order: 'asc' | 'desc',
  tieBreak = 0,
): number {
  if (a === null && b === null) {
    return tieBreak;
  }
  if (a === null) {
    return 1;
  }
  if (b === null) {
    return -1;
  }
  if (a !== b) {
    return order === 'asc' ? a - b : b - a;
  }
  return tieBreak;
}

/** Compare nullable strings. Null/empty always last. */
export function compareNullableString(
  a: string | null | undefined,
  b: string | null | undefined,
  order: 'asc' | 'desc',
  tieBreak = 0,
): number {
  const left = a?.trim() ? a : null;
  const right = b?.trim() ? b : null;
  if (left === null && right === null) {
    return tieBreak;
  }
  if (left === null) {
    return 1;
  }
  if (right === null) {
    return -1;
  }
  const cmp = left.localeCompare(right);
  if (cmp !== 0) {
    return order === 'asc' ? cmp : -cmp;
  }
  return tieBreak;
}
