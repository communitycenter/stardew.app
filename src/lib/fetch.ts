export const fetchJson = async <T>(url: string): Promise<T> => {
	const res = await fetch(url, { cache: "no-store" });

	if (!res.ok) {
		throw new Error(`Request failed: ${res.status}`);
	}

	return res.json() as Promise<T>;
};
