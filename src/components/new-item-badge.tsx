function removeTrailingZeroVersions(version: string) {
	const verZero = ".0";
	while (version.endsWith(verZero)) {
		version = version.substring(0, version.length - verZero.length);
	}
	return version;
}

export function NewItemBadge({
	version,
	position = "border",
}: {
	version: string;
	position?: string;
}) {
	return (
		<span
			className={`absolute ${position === "inside" ? "right-4 top-4 rounded-full border" : "right-0 top-0 rounded-bl-lg rounded-tr-lg border-b border-l"} z-0 border-neutral-200 bg-white px-2 py-1  text-xs text-black dark:border-neutral-600 dark:bg-neutral-800 dark:text-white`}
		>
			✨ {removeTrailingZeroVersions(version)}
		</span>
	);
}
