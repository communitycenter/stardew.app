function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSparseArrayPatch(value: unknown): value is Record<string, unknown> {
	return (
		isObject(value) && Object.keys(value).every((key) => /^\d+$/.test(key))
	);
}

export function applyPlayerPatch<T>(target: T, patch: unknown): T {
	if (typeof patch === "undefined") {
		return target;
	}

	if (Array.isArray(patch)) {
		return patch.map((item) => applyPlayerPatch(undefined, item)) as T;
	}

	if (isSparseArrayPatch(patch) && Array.isArray(target)) {
		const next = [...target];

		for (const [key, value] of Object.entries(patch)) {
			const index = Number(key);
			next[index] = applyPlayerPatch(next[index], value);
		}

		return next as T;
	}

	if (isObject(patch)) {
		const next: Record<string, unknown> = isObject(target) ? { ...target } : {};

		for (const [key, value] of Object.entries(patch)) {
			next[key] = applyPlayerPatch(next[key], value);
		}

		return next as T;
	}

	return patch as T;
}
