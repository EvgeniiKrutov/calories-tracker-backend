/**
 * Rounds a number to 2 decimal places, returning a number (not a string).
 * Uses toFixed(2) for the rounding, then coerces back to a numeric value so
 * it fits the float columns cleanly.
 */
export function roundTo2(value: number): number {
  return Number(value.toFixed(2));
}

/**
 * Returns a copy of `obj` with the listed numeric keys rounded to 2 decimals.
 * Keys whose value is undefined are left untouched (useful for partial updates).
 */
export function roundNumericFields<T extends object>(
  obj: T,
  keys: (keyof T)[],
): T {
  const result = { ...obj };
  for (const key of keys) {
    const value = result[key];
    if (typeof value === 'number') {
      result[key] = roundTo2(value) as T[keyof T];
    }
  }
  return result;
}
