import { useMediaQuery } from "@react-hook/media-query";
import Image from "next/image";

import objects from "@/data/objects.json";

import type { BundleItem } from "@/types/bundles";

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
import { IconExternalLink } from "@tabler/icons-react";
import { CreatePlayerRedirect } from "../createPlayerRedirect";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { ScrollArea } from "../ui/scroll-area";

interface Props {
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  bundleItem: BundleItem | null;
}

export const BundleSheet = ({ open, setIsOpen, bundleItem }: Props) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { activePlayer, patchPlayer } = useContext(PlayersContext);

  const [artifacts, minerals] = useMemo(() => {
    if (!activePlayer) return [new Set([]), new Set([])];

    const artifacts = activePlayer?.museum?.artifacts ?? [];
    const minerals = activePlayer?.museum?.minerals ?? [];

    return [new Set(artifacts), new Set(minerals)];
  }, [activePlayer]);

  const iconURL =
    bundleItem && `https://cdn.stardew.app/images/(O)${bundleItem.itemID}.webp`;

  const name =
    bundleItem &&
    objects[bundleItem.itemID.toString() as keyof typeof objects].name;

  const description =
    bundleItem &&
    objects[bundleItem.itemID.toString() as keyof typeof objects].description;

  // Either "Mineral" or "Artifact"
  const category =
    bundleItem && objects[bundleItem.itemID as keyof typeof objects].category;

  async function handleStatusChange(status: number) {
    if (!activePlayer || !bundleItem) return;

    if (category !== "Mineral" && category !== "Artifact") return;

    let patch = {};
    if (category === "Artifact") {
      if (status === 2) artifacts.add(bundleItem.itemID);
      if (status === 0) artifacts.delete(bundleItem.itemID);

      patch = {
        museum: {
          artifacts: Array.from(artifacts),
        },
      };
    } else if (category === "Mineral") {
      if (status === 2) minerals.add(bundleItem.itemID);
      if (status === 0) minerals.delete(bundleItem.itemID);

      patch = {
        museum: {
          minerals: Array.from(minerals),
        },
      };
    }

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
                src={iconURL ? iconURL : ""}
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
          {bundleItem && (
            <div className="mt-4 space-y-6">
              <section className="space-y-2">
                <div className="grid grid-cols-1 gap-2">
                  {artifacts.has(bundleItem.itemID) ? (
                    <Button
                      variant="secondary"
                      disabled={
                        !activePlayer ||
                        (!artifacts.has(bundleItem.itemID) &&
                          !minerals.has(bundleItem.itemID))
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
                        artifacts.has(bundleItem.itemID) ||
                        minerals.has(bundleItem.itemID)
                      }
                      data-umami-event="Set completed"
                      onClick={() => {
                        handleStatusChange(2);
                      }}
                    >
                      Set Completed
                    </Button>
                  )}
                  {!activePlayer && <CreatePlayerRedirect />}
                  {name && (
                    <Button
                      variant="outline"
                      data-umami-event="Visit wiki"
                      asChild
                    >
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
                  )}
                </div>
              </section>
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
          <DrawerHeader className="-mb-4 mt-4">
            <div className="flex justify-center">
              <Image
                src={iconURL ? iconURL : ""}
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
          {bundleItem && (
            <div className="space-y-6 p-6">
              <section className="space-y-2">
                <div className="grid grid-cols-1 gap-2">
                  {artifacts.has(bundleItem.itemID) ? (
                    <Button
                      variant="secondary"
                      disabled={
                        !activePlayer ||
                        (!artifacts.has(bundleItem.itemID) &&
                          !minerals.has(bundleItem.itemID))
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
                        artifacts.has(bundleItem.itemID) ||
                        minerals.has(bundleItem.itemID)
                      }
                      data-umami-event="Set completed"
                      onClick={() => {
                        handleStatusChange(2);
                      }}
                    >
                      Set Completed
                    </Button>
                  )}
                  {!activePlayer && <CreatePlayerRedirect />}
                  {name && (
                    <Button
                      variant="outline"
                      data-umami-event="Visit wiki"
                      asChild
                    >
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
                  )}
                </div>
              </section>
            </div>
          )}
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};
