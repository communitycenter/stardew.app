import useSWR from "swr";

const fetcher = async (url: RequestInfo | URL) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    throw error;
  }

  return res.json();
};

export function useCategory(category: string, type: string) {
  const baseUrl = process.env.NEXT_PUBLIC_DEVELOPMENT
    ? "http://localhost:3000"
    : "https://stardew.app";

  const { data, error } = useSWR(
    `${baseUrl}/api/getCategoryInfo?category=${category}&type=${type}`,
    // @ts-ignore
    fetcher,
    {
      onErrorRetry(err, key, config, revalidate, { retryCount }) {
        // never retry on 404 (data not found)
        if (err.status === 404) return;
        if (retryCount >= 5) return;
      },
    }
  );

  return {
    data,
    error,
    isLoading: !error && !data,
  };
}

// (...opts: any) => fetch(...opts).then((r) => r.json())
