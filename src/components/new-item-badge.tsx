export function NewItemBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute -right-3 -top-3 rounded-full bg-neutral-700 px-2 py-1 text-xs text-white dark:bg-neutral-800">
      {children}
    </span>
  );
}
