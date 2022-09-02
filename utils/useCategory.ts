import useSWR from "swr";

export function useCategory(category: string, type: string) {
  const { data, error } = useSWR(
    `http://localhost:3000/api/getCategoryInfo?category=${category}&type=${type}`,
    (...opts) => fetch(...opts).then((r) => r.json())
  );

  return {
    data,
    error,
    isLoading: !error && !data,
  };
}
