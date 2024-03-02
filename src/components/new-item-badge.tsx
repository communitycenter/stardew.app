export function NewItemBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute -right-3 -top-3 z-30 rounded-full border border-neutral-200 bg-white px-2 py-1  text-xs text-black dark:border-neutral-600 dark:bg-neutral-800 dark:text-white">
      {children}
    </span>
  );
}
