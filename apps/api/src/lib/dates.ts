/** Format a Date as YYYY-MM-DD in UTC. */
export function toDateOnly(value: Date): string {
  return value.toISOString().slice(0, 10);
}

/** UTC calendar year from a Date. */
export function releaseYearUtc(value: Date): number {
  return value.getUTCFullYear();
}
