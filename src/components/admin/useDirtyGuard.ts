import { useEffect, useRef } from 'react';

/**
 * Tracks whether `value` has diverged from its last-set baseline and reports
 * that via `registerDirty`. Call `setBaseline` whenever the form is reset or
 * seeded with saved data (create/cancel/load-for-edit) to mark it as clean again.
 */
export function useDirtyGuard<T>(value: T, registerDirty?: (dirty: boolean) => void) {
  const baselineRef = useRef<T>(value);

  useEffect(() => {
    registerDirty?.(JSON.stringify(value) !== JSON.stringify(baselineRef.current));
  }, [value, registerDirty]);

  const setBaseline = (next: T) => {
    baselineRef.current = next;
    registerDirty?.(false);
  };

  return { setBaseline };
}
