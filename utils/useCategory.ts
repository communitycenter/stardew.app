import useSWR from "swr";

export function useCategory(category: string, type: string) {
  const baseUrl = process.env.NEXT_PUBLIC_DEVELOPMENT
    ? "http://localhost:3000"
    : "https://stardew.app";

  const { data, error } = useSWR(
    `${baseUrl}/api/getCategoryInfo?category=${category}&type=${type}`,
    //@ts-ignore
    (...opts: any) => fetch(...opts).then((r) => r.json())
  );

  return {
    data,
    error,
    isLoading: !error && !data,
  };
}
