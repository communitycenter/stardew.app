import Image from "next/image";

import { cn } from "@/lib/utils";

interface Props {
  title: string;
  sourceURL: string;
  description: string;
  id: number | string;
  additionalDescription?: string;
  completed: boolean;
}

export const AchievementCard = ({
  title,
  sourceURL,
  description,
  id,
  additionalDescription,
  completed,
}: Props) => {
  /* -------------------- clickable classes (not used yet) -------------------- */
  /*
  let checkedClass = completed
    ? "border-green-900 bg-green-500/20 hover:bg-green-500/30 dark:bg-green-500/10 hover:dark:bg-green-500/20 hover:cursor-pointer"
    : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:cursor-pointer";
  */
  let checkedClass = completed
    ? "border-green-900 bg-green-500/20 dark:bg-green-500/10"
    : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950";

  return (
    <div
      className={cn(
        "flex select-none items-center space-x-3 rounded-lg border py-4 px-5  text-neutral-950 dark:text-neutral-50 shadow-sm",
        checkedClass
      )}
    >
      <Image
        src={sourceURL}
        alt={title}
        className="rounded-sm"
        width={48}
        height={48}
      />
      <div className="min-w-0 flex-1">
        <p className="font-medium truncate">{title}</p>
        <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
          {description + " " + additionalDescription}
        </p>
      </div>
    </div>
  );
};
