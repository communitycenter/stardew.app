import Image from "next/image";

import objects from "@/data/objects.json";

import type { ShippingItem } from "@/types/items";

import { cn } from "@/lib/utils";
import { useContext, useMemo, useState } from "react";

import { PlayersContext } from "@/contexts/players-context";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useMixpanel } from "@/contexts/mixpanel-context";
import { IconChevronRight, IconExternalLink } from "@tabler/icons-react";
import { CreatePlayerRedirect } from "../createPlayerRedirect";

interface Props {
  item: ShippingItem;
}

const classes = [
  "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-800",
  "border-yellow-900 bg-yellow-500/20 hover:bg-yellow-500/30 dark:bg-yellow-500/10 hover:dark:bg-yellow-500/20",
  "border-green-900 bg-green-500/20 hover:bg-green-500/30 dark:bg-green-500/10 hover:dark:bg-green-500/20",
];

export const ShippingCard = ({ item }: Props) => {
  const { activePlayer, patchPlayer } = useContext(PlayersContext);
  const mixpanel = useMixpanel();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);

  const [_status, _count] = useMemo(() => {
    if (
      !activePlayer ||
      !activePlayer.shipping ||
      !activePlayer.shipping.shipped ||
      !activePlayer.shipping.shipped[item.itemID]
    )
      return [0, 0];

    // status = 0 => not shipped
    // status = 1 => counts for polyculture but count < 15
    // status = 2 => count > 0 if not polyculture, count >= 15 if polyculture
    let _status = 0;
    const _count = activePlayer.shipping.shipped[item.itemID];

    if (_count === null) return [0, 0];

    if (item.polyculture) {
      if (_count >= 15) _status = 2;
      else _status = 1;
    } else {
      if (_count > 0) _status = 2;
    }

    return [_status, _count];
  }, [activePlayer, item]);

  const iconURL =
    objects[item.itemID.toString() as keyof typeof objects].iconURL ??
    "https://stardewvalleywiki.com/mediawiki/images/5/59/Secret_Heart.png";

  const name = objects[item.itemID.toString() as keyof typeof objects].name;

  const description =
    objects[item.itemID.toString() as keyof typeof objects].description;

  async function handleSave() {
    if (!activePlayer) return;

    // don't make any requests if the value hasn't changed
    if (value === _count || value < 0) {
      setOpen(false);
      return;
    }

    const patch = {
      shipping: {
        shipped: {
          [item.itemID]: value === 0 ? null : value,
        },
      },
    };

    await patchPlayer(patch);
    setOpen(false);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          className={cn(
            "flex select-none items-center text-left space-x-3 rounded-lg border py-4 px-5 text-neutral-950 dark:text-neutral-50 shadow-sm hover:cursor-pointer transition-colors",
            classes[_status]
          )}
        >
          <Image
            src={iconURL}
            alt={name}
            className="rounded-sm"
            width={32}
            height={32}
          />
          <div className="min-w-0 flex-1 pr-3">
            <p className="font-medium truncate">{`${name} (${_count}x)`}</p>
            <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
              {description}
            </p>
          </div>
          <IconChevronRight className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <Image
            src={iconURL}
            alt={name}
            className="rounded-sm mx-auto"
            width={42}
            height={42}
          />
          <DialogTitle className="text-center">{name}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>
        <Label htmlFor="count">Amount Shipped:</Label>
        <Input
          id="count"
          type="number"
          min={0}
          defaultValue={_count ?? 0}
          onChange={(e) => setValue(parseInt(e.target.value))}
          disabled={!activePlayer}
        />
        <DialogFooter className="sm:justify-between gap-3 sm:gap-0">
          <Button variant="outline">
            <a
              className="flex items-center"
              target="_blank"
              rel="noreferrer"
              href={`https://stardewvalleywiki.com/${name.replaceAll(
                " ",
                "_"
              )}`}
            >
              Visit Wiki Page
              <IconExternalLink className="h-4"></IconExternalLink>
            </a>
          </Button>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-3 sm:gap-0">
            <Button
              disabled={!activePlayer}
              variant="secondary"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={!activePlayer}
              onClick={() => {
                handleSave();
                mixpanel?.track("Value Input", {
                  Value: value,
                  "Card type": "Shipping card",
                });
              }}
            >
              Save
            </Button>
          </div>
        </DialogFooter>
        {!activePlayer && <CreatePlayerRedirect />}
      </DialogContent>
    </Dialog>
  );
};
