export function NewItemBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute -right-3 -top-3 rounded-full bg-white border border-neutral-200 dark:border-neutral-600 text-black  px-2 py-1 text-xs dark:text-white dark:bg-neutral-800">
      {children}
    </span>
  );
}
