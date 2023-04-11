import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import useSWR, { useSWRConfig } from "swr";

interface IKVContext {
  loaded: boolean;
  get: (tag: string, key?: string) => any | undefined;
  set: (value: any, tag: string, key?: string) => void;
}

export const KVContext = createContext<IKVContext>({
  loaded: false,
  get: () => "",
  set: () => {},
});

export const KVProvider = ({ children }: { children: React.ReactNode }) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [kv, setKv] = useState<Record<string, any>>({});

  const api = useSWR("/api/kv", (...opts) =>
    fetch(...opts).then((r) => r.json())
  );

  useEffect(() => {
    if (api.data) setKv(api.data);
    setLoaded(true);
  }, [api.data]);

  const get = useCallback(
    (tag: string, key?: string) => (key ? kv[tag]?.[key] : kv[tag]),
    [kv]
  );
  const set = useCallback(
    async (value: any, tag: string, key?: string) => {
      // if no key is provided, set the entire tag to the value
      const nv = key ? { [key]: value } : value;

      // update the local state using Object.assign which merges two objects into a new one
      setKv((prev) =>
        Object.assign({}, prev, { [tag]: Object.assign({}, prev[tag], nv) })
      );

      // push updated values to the api
      await fetch("/api/kv", {
        method: "PATCH",
        body: JSON.stringify({ [tag]: nv }),
      });
    },
    [setKv]
  );

  return (
    <KVContext.Provider value={{ get, set, loaded }}>
      {children}
    </KVContext.Provider>
  );
};
