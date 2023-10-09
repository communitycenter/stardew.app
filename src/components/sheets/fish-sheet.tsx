import Image from "next/image";

import objects from "@/data/objects.json";

import type { FishType } from "@/types/items";

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
import clsx from "clsx";
import * as Fathom from "fathom-client";
import { CreatePlayerRedirect } from "../createPlayerRedirect";

interface Props {
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  fish: FishType | null;
}

type Seasons = "Winter" | "Spring" | "Summer" | "Fall";
type Weather = "Sunny" | "Rainy" | "Both";

const Seasons: Record<Seasons, { icon: string; color: string }> = {
  Winter: {
    icon: "https://stardewvalleywiki.com/mediawiki/images/thumb/6/60/Emojis103.png/48px-Emojis103.png",
    color: "bg-blue-50 border border-blue-100",
  },
  Spring: {
    icon: "https://stardewvalleywiki.com/mediawiki/images/thumb/d/d9/Emojis111.png/48px-Emojis111.png",
    color: "bg-green-50 border border-green-100",
  },
  Summer: {
    icon: "https://stardewvalleywiki.com/mediawiki/images/thumb/0/00/Emojis099.png/48px-Emojis099.png",
    color: "bg-yellow-50 border border-yellow-100",
  },
  Fall: {
    icon: "https://stardewvalleywiki.com/mediawiki/images/thumb/2/2b/Emojis110.png/48px-Emojis110.png",
    color: "bg-orange-50 border border-orange-100",
  },
};

const Weather: Record<Weather, { icon: string; color: string }> = {
  Sunny: {
    icon: "https://stardewvalleywiki.com/mediawiki/images/thumb/0/00/Emojis099.png/48px-Emojis099.png",
    color: "bg-yellow-50 border border-yellow-100",
  },
  Rainy: {
    icon: "https://stardewvalleywiki.com/mediawiki/images/thumb/2/2f/Emojis100.png/48px-Emojis100.png",
    color: "bg-blue-50 border border-blue-100",
  },
  Both: {
    icon: "https://stardewvalleywiki.com/mediawiki/images/thumb/1/1a/Emojis097.png/48px-Emojis097.png",
    color: "bg-blue-50 border border-blue-100",
  },
};

export const FishSheet = ({ open, setIsOpen, fish }: Props) => {
  const { activePlayer, patchPlayer } = useContext(PlayersContext);

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
                    onClick={() => {
                      handleStatusChange(0);
                      Fathom.trackGoal("OYQKZJFI", 0);
                    }}
                  >
                    Set Uncaught
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    disabled={!activePlayer || fishCaught.has(fish.itemID)}
                    onClick={() => {
                      handleStatusChange(2);
                      Fathom.trackGoal("VMKLGIUD", 0);
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
              {/* <Separator /> */}
              <ul className="grid grid-cols-2 gap-2">
                {fish.locations.map((location) => (
                  <div
                    key={location}
                    className="rounded-full p-2 flex gap-1 space-x-2 items-center text-sm text-neutral-500 dark:text-neutral-800 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
                  >
                    <span className="ml-2">{location}</span>
                  </div>
                ))}
              </ul>
            </section>
            {!fish.trapFish && (
              <>
                <section className="space-y-2">
                  <h3 className="font-semibold">Seasons</h3>
                  {/* <Separator /> */}
                  <div className="grid grid-cols-2 gap-2">
                    {fish.seasons.map((season, index) => (
                      <div
                        key={season}
                        className={clsx(
                          "rounded-full p-2 flex gap-1 space-x-2 items-center",
                          Seasons[season as Seasons].color
                        )}
                      >
                        <Image
                          src={Seasons[season as Seasons].icon}
                          alt={""}
                          width={20}
                          height={20}
                          className="ml-2"
                        />
                        <p className="text-sm text-neutral-500 dark:text-neutral-800">
                          {season}
                        </p>
                      </div>
                    ))}
                  </div>
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
                  <div
                    className={clsx(
                      "rounded-full p-2 flex gap-1 space-x-2 items-center",
                      Weather[fish.weather as Weather].color
                    )}
                  >
                    <Image
                      src={Weather[fish.weather as Weather].icon}
                      alt={""}
                      width={20}
                      height={20}
                      className="ml-2"
                    />
                    <p className="text-sm text-neutral-500 dark:text-neutral-800">
                      {fish.weather}
                    </p>
                  </div>
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
};
