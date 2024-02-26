import Image from "next/image";

import objects from "@/data/objects.json";

import type { ShippingItem } from "@/types/items";

import { cn } from "@/lib/utils";
import { getCookie } from "cookies-next";
import { useMemo, useState } from "react";

import { usePlayers } from "@/contexts/players-context";

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
import { Button } from "@/components/ui/button";
import { NewItemBadge } from "@/components/new-item-badge";

import { useMixpanel } from "@/contexts/mixpanel-context";
import { IconChevronRight, IconExternalLink } from "@tabler/icons-react";
import { CreatePlayerRedirect } from "../createPlayerRedirect";

interface Props {
  item: ShippingItem;
  setShowNewContentOpen?: (value: boolean) => void;
}

const classes = [
  "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-800",
  "border-yellow-900 bg-yellow-500/20 hover:bg-yellow-500/30 dark:bg-yellow-500/10 hover:dark:bg-yellow-500/20",
  "border-green-900 bg-green-500/20 hover:bg-green-500/30 dark:bg-green-500/10 hover:dark:bg-green-500/20",
];

export const ShippingCard = ({ item, setShowNewContentOpen }: Props) => {
  const showNewContent = getCookie("show_new_content");

  const { activePlayer, patchPlayer } = usePlayers();
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
    objects[item.itemID as keyof typeof objects].iconURL ??
    "https://stardewvalleywiki.com/mediawiki/images/5/59/Secret_Heart.png";
  const name = objects[item.itemID as keyof typeof objects].name;
  const description = objects[item.itemID as keyof typeof objects].description;

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
            "relative flex select-none items-center justify-between rounded-lg border px-5 py-4 text-left text-neutral-950 shadow-sm transition-colors hover:cursor-pointer dark:text-neutral-50",
            classes[_status],
          )}
          onClick={(e) => {
            if (item.minVersion === "1.6.0" && !showNewContent && _status < 1) {
              e.preventDefault();
              setShowNewContentOpen?.(true);
              return;
            }
          }}
        >
          {item.minVersion === "1.6.0" && <NewItemBadge>✨1.6</NewItemBadge>}
          <div
            className={cn(
              "flex items-center space-x-3 truncate text-left",
              item.minVersion === "1.6.0" &&
                !showNewContent &&
                _status < 1 &&
                "blur-sm",
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
              <p className="truncate font-medium">{`${name} (${_count}x)`}</p>
              <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
                {description}
              </p>
            </div>
          </div>
          <IconChevronRight className="h-5 w-5 flex-shrink-0 text-neutral-500 dark:text-neutral-400" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <Image
            src={iconURL}
            alt={name}
            className="mx-auto rounded-sm"
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
        <DialogFooter className="gap-3 sm:justify-between sm:gap-0">
          <Button variant="outline">
            <a
              className="flex items-center"
              target="_blank"
              rel="noreferrer"
              href={`https://stardewvalleywiki.com/${name.replaceAll(
                " ",
                "_",
              )}`}
            >
              Visit Wiki Page
              <IconExternalLink className="h-4"></IconExternalLink>
            </a>
          </Button>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-0 sm:space-x-2">
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
