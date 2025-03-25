import { useEffect, useState } from "react";

export function useDebouncedValue(value: boolean, debounceInMs: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setDebouncedValue(value),
      debounceInMs,
    );
    return () => window.clearTimeout(timeout);
  }, [value, debounceInMs]);

  return debouncedValue;
}
