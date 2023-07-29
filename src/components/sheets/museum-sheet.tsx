import { TrinketItem } from "@/types/items";
import { Dispatch, SetStateAction } from "react";
import objects from "@/data/objects.json";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../ui/sheet";
import Image from "next/image";
import { Separator } from "../ui/separator";

interface Props {
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  trinket: TrinketItem | null;
}

export const MuseumSheet = ({ open, setIsOpen, trinket }: Props) => {
  const iconURL = trinket
    ? objects[trinket.itemID.toString() as keyof typeof objects].iconURL
    : "https://stardewvalleywiki.com/mediawiki/images/f/f3/Lost_Book.png";

  const name =
    trinket && objects[trinket.itemID.toString() as keyof typeof objects].name;

  const description =
    trinket &&
    objects[trinket.itemID.toString() as keyof typeof objects].description;

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
