import Image from "next/image";

import type { FishType } from "@/types/items";

import { Dispatch, SetStateAction } from "react";

import {
  Sheet,
  SheetTitle,
  SheetHeader,
  SheetContent,
  SheetDescription,
} from "@/components/ui/sheet";

interface Props {
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  fish: FishType | null;
}

export const FishSheet = ({ open, setIsOpen, fish }: Props) => {
  return (
    <Sheet open={open} onOpenChange={setIsOpen}>
      <SheetContent>
        <SheetHeader className="mt-4">
          <div className="flex justify-center">
            <Image
              src={
                fish
                  ? fish.iconURL
                  : "https://stardewvalleywiki.com/mediawiki/images/b/ba/Pufferfish.png"
              }
              alt={fish ? fish.name : "No Info"}
              height={64}
              width={64}
            />
          </div>
          <SheetTitle className="text-center">
            {fish ? fish.name : "No Info"}
          </SheetTitle>
          <SheetDescription className="text-center italic">
            {fish ? fish.description : "No Description Found"}
          </SheetDescription>
        </SheetHeader>
        {fish && (
          <div className="space-y-4 mt-4">
            <section className="space-y-1">
              <h3 className="font-semibold">Location</h3>
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
                <section className="space-y-1">
                  <h3 className="font-semibold">Season</h3>
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
                <section className="space-y-1">
                  <h3 className="font-semibold">Time</h3>
                  <p className="mt-1 text-neutral-500 dark:text-neutral-400 text-sm">
                    {fish.time}
                  </p>
                </section>
                <section className="space-y-1">
                  <h3 className="font-semibold">Weather</h3>
                  <p className="mt-1 text-neutral-500 dark:text-neutral-400 text-sm">
                    {fish.weather}
                  </p>
                </section>
                <section className="space-y-1">
                  <h3 className="font-semibold">Difficulty</h3>
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
