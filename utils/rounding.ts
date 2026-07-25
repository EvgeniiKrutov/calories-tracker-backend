export function roundTo2(value: number): number {
  return Number(value.toFixed(2));
}

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
