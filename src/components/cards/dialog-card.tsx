import Image from "next/image";

import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ChevronRightIcon } from "@radix-ui/react-icons";

interface Props {
  title: string;
  description: string;
  iconURL: string;
  completed?: boolean;
}

export const DialogCard = ({
  title,
  description,
  iconURL,
  completed,
}: Props) => {
  let checkedClass = completed
    ? "border-green-900 bg-green-500/20 hover:bg-green-500/30 dark:bg-green-500/10 hover:dark:bg-green-500/20"
    : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-800";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className={cn(
            "py-4 px-5 flex justify-between items-center hover:cursor-pointer border rounded-lg shadow-sm",
            checkedClass
          )}
        >
          <div className="flex space-x-3 items-center">
            <Image src={iconURL} alt={title} width={32} height={32} />
            <p>{title}</p>
          </div>
          <ChevronRightIcon className="h-5 w-5" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{description}</DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
