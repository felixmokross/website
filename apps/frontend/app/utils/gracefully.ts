function isObject<T>(obj: T | string | undefined | null): obj is T {
  return !!obj && typeof obj === "object";
}

export function gracefully<T, K extends keyof T>(
  obj: T | string | undefined | null,
  key: K,
): T[K] | undefined {
  return isObject(obj) ? obj[key] : undefined;
}
