function removeTrailingZeroVersions(version: string) {
  const verZero = '.0';
  while (version.endsWith(verZero)) {
    version = version.substring(0, version.length-verZero.length);
  }
  return version;
}

export function NewItemBadge({ version, position = "border" }: { version: string, position?: string }) {
  return (
    <span className={`absolute ${position==="inside" ? "right-4 top-4" :"-right-3 -top-3"} z-0 rounded-full border border-neutral-200 bg-white px-2 py-1  text-xs text-black dark:border-neutral-600 dark:bg-neutral-800 dark:text-white`}>
      ✨ {removeTrailingZeroVersions(version)}
    </span>
  );
}
