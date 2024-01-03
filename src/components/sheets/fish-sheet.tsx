import Image from "next/image";

import objects from "@/data/objects.json";

import type { FishType } from "@/types/items";

import { Dispatch, SetStateAction, useContext, useMemo } from "react";

import { PlayersContext } from "@/contexts/players-context";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "@react-hook/media-query";
import { CreatePlayerRedirect } from "../createPlayerRedirect";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { ScrollArea } from "../ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";

interface Props {
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  fish: FishType | null;
}

export const FishSheet = ({ open, setIsOpen, fish }: Props) => {
  const { activePlayer, patchPlayer } = useContext(PlayersContext);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const fishCaught = useMemo(() => {
    if (
      !activePlayer ||
      !activePlayer.fishing ||
      !activePlayer.fishing.fishCaught
    )
      return new Set([]);

    return new Set(activePlayer.fishing.fishCaught);
  }, [activePlayer]);

  const iconURL = fish
    ? objects[fish.itemID.toString() as keyof typeof objects].iconURL
    : "https://stardewvalleywiki.com/mediawiki/images/f/f3/Lost_Book.png";

  const name =
    fish && objects[fish.itemID.toString() as keyof typeof objects].name;

  const description =
    fish && objects[fish.itemID.toString() as keyof typeof objects].description;

  async function handleStatusChange(status: number) {
    if (!activePlayer || !fish) return;

    if (status === 2) fishCaught.add(fish.itemID);
    if (status === 0) fishCaught.delete(fish.itemID);

    const patch = {
      fishing: {
        fishCaught: Array.from(fishCaught),
      },
    };

    await patchPlayer(patch);
    setIsOpen(false);
  }

  if (isDesktop) {
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
          {fish && (
            <div className="space-y-6 mt-4">
              <section className="space-y-2">
                <div className="grid grid-cols-1 gap-3">
                  {fishCaught.has(fish.itemID) ? (
                    <Button
                      variant="secondary"
                      disabled={!activePlayer || !fishCaught.has(fish.itemID)}
                      data-umami-event="Set incompleted"
                      onClick={() => {
                        handleStatusChange(0);
                      }}
                    >
                      Set Uncaught
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      disabled={!activePlayer || fishCaught.has(fish.itemID)}
                      data-umami-event="Set completed"
                      onClick={() => {
                        handleStatusChange(2);
                      }}
                    >
                      Set Caught
                    </Button>
                  )}
                  {!activePlayer && <CreatePlayerRedirect />}
                </div>
              </section>
              <section className="space-y-2">
                <h3 className="font-semibold">Location</h3>
                <Separator />
                <ul className="list-disc list-inside">
                  {fish.locations.map((location) => (
                    <li
                      key={location}
                      className="mt-1 text-neutral-500 dark:text-neutral-400 text-sm"
                    >
                      {location}
                    </li>
                  ))}
                </ul>
              </section>
              {!fish.trapFish && (
                <>
                  <section className="space-y-2">
                    <h3 className="font-semibold">Season</h3>
                    <Separator />
                    <ul className="list-disc list-inside">
                      {fish.seasons.map((season) => (
                        <li
                          key={season}
                          className="mt-1 text-neutral-500 dark:text-neutral-400 text-sm"
                        >
                          {season}
                        </li>
                      ))}
                    </ul>
                  </section>
                  <section className="space-y-2">
                    <h3 className="font-semibold">Time</h3>
                    <Separator />
                    <p className="mt-1 text-neutral-500 dark:text-neutral-400 text-sm">
                      {fish.time}
                    </p>
                  </section>
                  <section className="space-y-2">
                    <h3 className="font-semibold">Weather</h3>
                    <Separator />
                    <p className="mt-1 text-neutral-500 dark:text-neutral-400 text-sm">
                      {fish.weather}
                    </p>
                  </section>
                  <section className="space-y-2">
                    <h3 className="font-semibold">Difficulty</h3>
                    <Separator />
                    <p className="mt-1 text-neutral-500 dark:text-neutral-400 text-sm">
                      {fish.difficulty}
                    </p>
                  </section>
                </>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setIsOpen}>
      <DrawerContent className="fixed bottom-0 left-0 right-0 max-h-[90dvh]">
        <ScrollArea className="overflow-auto">
          <DrawerHeader className="mt-4 -mb-4">
            <div className="flex justify-center">
              <Image
                src={iconURL}
                alt={name ? name : "No Info"}
                height={64}
                width={64}
              />
            </div>
            <DrawerTitle className="text-center">
              {name ? name : "No Info"}
            </DrawerTitle>
            <DrawerDescription className="text-center italic">
              {description ? description : "No Description Found"}
            </DrawerDescription>
          </DrawerHeader>
          {fish && (
            <div className="space-y-6 p-6">
              <section className="space-y-2">
                <div className="grid grid-cols-1 gap-3">
                  {fishCaught.has(fish.itemID) ? (
                    <Button
                      variant="secondary"
                      disabled={!activePlayer || !fishCaught.has(fish.itemID)}
                      data-umami-event="Set incompleted"
                      onClick={() => {
                        handleStatusChange(0);
                      }}
                    >
                      Set Uncaught
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      disabled={!activePlayer || fishCaught.has(fish.itemID)}
                      data-umami-event="Set completed"
                      onClick={() => {
                        handleStatusChange(2);
                      }}
                    >
                      Set Caught
                    </Button>
                  )}
                  {!activePlayer && <CreatePlayerRedirect />}
                </div>
              </section>
              <section className="space-y-2">
                <h3 className="font-semibold">Location</h3>
                <Separator />
                <ul className="list-disc list-inside">
                  {fish.locations.map((location) => (
                    <li
                      key={location}
                      className="mt-1 text-neutral-500 dark:text-neutral-400 text-sm"
                    >
                      {location}
                    </li>
                  ))}
                </ul>
              </section>
              {!fish.trapFish && (
                <>
                  <section className="space-y-2">
                    <h3 className="font-semibold">Season</h3>
                    <Separator />
                    <ul className="list-disc list-inside">
                      {fish.seasons.map((season) => (
                        <li
                          key={season}
                          className="mt-1 text-neutral-500 dark:text-neutral-400 text-sm"
                        >
                          {season}
                        </li>
                      ))}
                    </ul>
                  </section>
                  <section className="space-y-2">
                    <h3 className="font-semibold">Time</h3>
                    <Separator />
                    <p className="mt-1 text-neutral-500 dark:text-neutral-400 text-sm">
                      {fish.time}
                    </p>
                  </section>
                  <section className="space-y-2">
                    <h3 className="font-semibold">Weather</h3>
                    <Separator />
                    <p className="mt-1 text-neutral-500 dark:text-neutral-400 text-sm">
                      {fish.weather}
                    </p>
                  </section>
                  <section className="space-y-2">
                    <h3 className="font-semibold">Difficulty</h3>
                    <Separator />
                    <p className="mt-1 text-neutral-500 dark:text-neutral-400 text-sm">
                      {fish.difficulty}
                    </p>
                  </section>
                </>
              )}
            </div>
          )}
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};
