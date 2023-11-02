import Image from "next/image";

import objects from "@/data/objects.json";

import type { TrinketItem } from "@/types/items";

import { Dispatch, SetStateAction, useContext, useMemo } from "react";

import { PlayersContext } from "@/contexts/players-context";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CreatePlayerRedirect } from "../createPlayerRedirect";

interface Props {
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  trinket: TrinketItem | null;
}

export const MuseumSheet = ({ open, setIsOpen, trinket }: Props) => {
  const { activePlayer, patchPlayer } = useContext(PlayersContext);

  const [artifacts, minerals] = useMemo(() => {
    if (!activePlayer) return [new Set([]), new Set([])];

    const artifacts = activePlayer?.museum?.artifacts ?? [];
    const minerals = activePlayer?.museum?.minerals ?? [];

    return [new Set(artifacts), new Set(minerals)];
  }, [activePlayer]);

  const iconURL = trinket
    ? objects[trinket.itemID.toString() as keyof typeof objects].iconURL
    : "https://stardewvalleywiki.com/mediawiki/images/f/f3/Lost_Book.png";

  const name =
    trinket && objects[trinket.itemID.toString() as keyof typeof objects].name;

  const description =
    trinket &&
    objects[trinket.itemID.toString() as keyof typeof objects].description;

  // Either "Minerals" or "Arch"
  const category =
    trinket && objects[trinket.itemID as keyof typeof objects].category;

  async function handleStatusChange(status: number) {
    if (!activePlayer || !trinket) return;

    if (category !== "Minerals" && category !== "Arch") return;

    let patch = {};
    if (category === "Arch") {
      if (status === 2) artifacts.add(parseInt(trinket.itemID));
      if (status === 0) artifacts.delete(parseInt(trinket.itemID));

      patch = {
        museum: {
          artifacts: Array.from(artifacts),
        },
      };
    } else if (category === "Minerals") {
      if (status === 2) minerals.add(parseInt(trinket.itemID));
      if (status === 0) minerals.delete(parseInt(trinket.itemID));

      patch = {
        museum: {
          minerals: Array.from(minerals),
        },
      };
    }

    await patchPlayer(patch);
    setIsOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setIsOpen}>
      <SheetContent>
        <SheetHeader className="mt-4">
          <div className="flex justify-center">
            <Image
              src={iconURL}
              alt={name ? name : "No Info"}
              height={64}
              width={64}
            />
          </div>
          <SheetTitle className="text-center">
            {name ? name : "No Info"}
          </SheetTitle>
          <SheetDescription className="text-center italic">
            {description ? description : "No Description Found"}
          </SheetDescription>
        </SheetHeader>
        {trinket && (
          <div className="space-y-6 mt-4">
            <section className="space-y-2">
              <div className="grid grid-cols-1 gap-3">
                {artifacts.has(parseInt(trinket.itemID)) ? (
                  <Button
                    variant="secondary"
                    disabled={
                      !activePlayer ||
                      (!artifacts.has(parseInt(trinket.itemID)) &&
                        !minerals.has(parseInt(trinket.itemID)))
                    }
                    data-umami-event="Set incompleted"
                    onClick={() => {
                      handleStatusChange(0);
                    }}
                  >
                    Set Incomplete
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    disabled={
                      !activePlayer ||
                      artifacts.has(parseInt(trinket.itemID)) ||
                      minerals.has(parseInt(trinket.itemID))
                    }
                    data-umami-event="Set complete"
                    onClick={() => {
                      handleStatusChange(2);
                    }}
                  >
                    Set Completed
                  </Button>
                )}
                {!activePlayer && <CreatePlayerRedirect />}
              </div>
            </section>
            <section className="space-y-2">
              {trinket.locations && (
                <>
                  <h3 className="font-semibold">Location</h3>
                  <Separator />
                  <ul className="list-disc list-inside">
                    {trinket.locations.map((location) => (
                      <li
                        key={location}
                        className="mt-1 text-neutral-500 dark:text-neutral-400 text-sm"
                      >
                        {location}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </section>
            <section className="space-y-2">
              {trinket.used_in && trinket.used_in.length > 0 && (
                <>
                  <h3 className="font-semibold">Used In</h3>
                  <Separator />
                  <ul className="list-disc list-inside">
                    {trinket.used_in.map((location) => (
                      <li
                        key={location}
                        className="mt-1 text-neutral-500 dark:text-neutral-400 text-sm"
                      >
                        {location}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </section>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
