/**
 * Normalize artist ID lists for equality checks (dedupe + sort).
 * Used when detecting duplicate songs (same title + same artist set).
 */
export function normalizeArtistIds(artistIds: readonly string[]): string[] {
  return [...new Set(artistIds)].sort((a, b) => a.localeCompare(b));
}

/** True when both lists represent the same set of artists. */
export function artistIdsEqual(
  left: readonly string[],
  right: readonly string[],
): boolean {
  const a = normalizeArtistIds(left);
  const b = normalizeArtistIds(right);
  if (a.length !== b.length) {
    return false;
  }
  return a.every((id, index) => id === b[index]);
}
