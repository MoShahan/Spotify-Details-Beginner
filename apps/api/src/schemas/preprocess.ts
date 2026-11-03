/** Treat empty string / null as omitted optional fields for Zod preprocess. */
export function emptyToUndefined(value: unknown): unknown {
  if (value === '' || value === null) {
    return undefined;
  }
  return value;
}

/** Treat empty string / null as explicit null (e.g. clear image URL). */
export function emptyToNull(value: unknown): unknown {
  if (value === '' || value === null) {
    return null;
  }
  return value;
}
