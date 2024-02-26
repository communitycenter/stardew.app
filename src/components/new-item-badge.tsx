export function NewItemBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute bg-neutral-700 text-white dark:bg-neutral-800 text-xs px-2 py-1 rounded-full -top-3 -right-3">
      {children}
    </span>
  );
}
