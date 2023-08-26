import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { useContext, useState } from "react";

import { PlayersContext } from "@/contexts/players-context";
import { walnuts as walnutType } from "@/lib/parsers/walnuts";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { ChevronRightIcon } from "@radix-ui/react-icons";

import * as Fathom from "fathom-client";

interface Props {
  title: string;
  description: string;
  iconURL: string;
  completed?: boolean;
  _id: string;
  _type: "stardrop" | "note" | "scrap" | "walnut";
}

export const DialogCard = ({
  title,
  description,
  iconURL,
  completed,
  _id,
  _type,
}: Props) => {
  const { activePlayer, patchPlayer } = useContext(PlayersContext);

  const [open, setOpen] = useState(false);

  let checkedClass = completed
    ? "border-green-900 bg-green-500/20 hover:bg-green-500/30 dark:bg-green-500/10 hover:dark:bg-green-500/20"
    : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-800";

  async function handleStatusChange(status: boolean) {
    if (!activePlayer) return;

    let patch = {};
    switch (_type) {
      case "stardrop":
        const stardrops = new Set(activePlayer.general?.stardrops ?? []);
        if (status) stardrops.add(_id);
        else stardrops.delete(_id);

        patch = {
          general: {
            stardrops: Array.from(stardrops),
          },
        };
        break;

      case "note":
        const notes = new Set(activePlayer.notes?.found ?? []);
        if (status) notes.add(parseInt(_id));
        else notes.delete(parseInt(_id));

        patch = {
          notes: {
            found: Array.from(notes),
          },
        };
        break;

      case "scrap":
        const scraps = new Set(activePlayer.scraps?.found ?? []);
        if (status) scraps.add(parseInt(_id));
        else scraps.delete(parseInt(_id));

        patch = {
          scraps: {
            found: Array.from(scraps),
          },
        };
        break;

      case "walnut":
        const walnuts = activePlayer.walnuts?.found ?? {};
        if (status) walnuts[_id] = walnutType[_id].num;
        else walnuts[_id] = 0;

        patch = {
          walnuts: {
            found: walnuts,
          },
        };
        break;
    }

    if (Object.keys(patch).length === 0) return;

    await patchPlayer(patch);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
        <DialogFooter className="gap-4 sm:gap-0">
          <Button
            variant="secondary"
            disabled={!activePlayer || !completed}
            onClick={() => {
              handleStatusChange(false);
              Fathom.trackGoal("OYQKZJFI", 0);
            }}
          >
            Set Incomplete
          </Button>
          <Button
            variant="secondary"
            disabled={!activePlayer || completed}
            onClick={() => {
              handleStatusChange(true);
              Fathom.trackGoal("VMKLGIUD", 0);
            }}
          >
            Set Completed
          </Button>
        </DialogFooter>
        {!activePlayer && (
          <p className="text-blue-500 dark:text-blue-400 text-sm">
            <Link href="/editor/create" className="underline">
              Create a character
            </Link>{" "}
            to beginning editing stats.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};
