import { useCallback, useContext } from "react";
import { KVContext } from "../contexts/KVContext";

// example usage:
// import { useKV } from "hooks/useKV"
// const [hasItem, setHasItem] = useKV("bundle-item", "10", false)
export function useKV<T>(
  tag: string,
  key: string,
  defaultValue: T
): [T, (newValue: T | ((oldValue: T) => T)) => void] {
  const context = useContext(KVContext);

  if (!context) {
    throw new Error("useKV must be used within a KVProvider");
  }

  const value = context.get(tag, key) ?? defaultValue;

  const setValue = useCallback(
    (newValue: T | ((oldValue: T) => T)) => {
      const resolvedValue =
        newValue instanceof Function ? newValue(value) : newValue;
      context.set(resolvedValue, tag, key);
    },
    [context, tag, key, value]
  );

  return [value, setValue];
}
