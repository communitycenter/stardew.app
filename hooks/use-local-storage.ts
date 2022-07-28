import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

export function useLocalStorageState<T = any>(
  key: string,
  defaultValue: T
): [value: T, setValue: Dispatch<SetStateAction<T>>, reload: () => void] {
  const [value, setValue] = useState<T | null>(null);

  const reload = useCallback(() => {
    const loaded = JSON.parse(
      localStorage.getItem(key) || JSON.stringify(defaultValue)
    );
    setValue(loaded);
  }, [key, setValue, defaultValue]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (value === null) reload();
  }, [reload, value]);

  const setter = useCallback(
    (newValue: SetStateAction<T>) => {
      if (!value) {
        throw new Error("Cannot update state while hydrating");
      }

      const resolvedValue =
        newValue instanceof Function ? newValue(value) : newValue;

      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(resolvedValue));
      }

      setValue(resolvedValue);
    },
    [key, value]
  );

  return [value === null ? defaultValue : value, setter, reload];
}
