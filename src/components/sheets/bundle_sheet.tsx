import { useMediaQuery } from "@react-hook/media-query";
import Image from "next/image";

import objects from "@/data/objects.json";
import bundleData from "@/data/bundles.json";

import {
  isRandomizer,
  type BundleItem,
  type BundleItemWithLocation,
  BundleItemWithOptions,
  BundleWithStatus,
} from "@/types/bundles";

import { Dispatch, SetStateAction, useContext, useMemo } from "react";

import {
  PlayerType,
  PlayersContext,
  usePlayers,
} from "@/contexts/players-context";

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
import { DeepPartial } from "react-hook-form";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { object } from "valibot";

interface Props {
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  bundleItemWithLocation: BundleItemWithLocation | null;
}

export function BundleSheet({
  open,
  setIsOpen,
  bundleItemWithLocation,
}: Props) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { activePlayer, patchPlayer } = usePlayers();

  const [bundles, completed] = useMemo(() => {
    console.log("running...");
    if (!activePlayer) return [[], false];
    const bundles = activePlayer?.bundles ?? [];
    if (!bundleItemWithLocation) return [bundles, false];
    const bundleIndex = bundles.findIndex(
      (bundleWithStatus) =>
        bundleWithStatus.bundle.name === bundleItemWithLocation.bundleID,
    );
    const completed =
      activePlayer?.bundles?.[bundleIndex]?.bundleStatus[
        bundleItemWithLocation.index
      ] ?? false;
    return [bundles, completed];
  }, [activePlayer]);

  const iconURL =
    bundleItemWithLocation &&
    `https://cdn.stardew.app/images/(O)${bundleItemWithLocation.itemID}.webp`;

  const name =
    bundleItemWithLocation &&
    objects[bundleItemWithLocation.itemID as keyof typeof objects].name;

  const description =
    bundleItemWithLocation &&
    objects[bundleItemWithLocation.itemID as keyof typeof objects].description;

  async function handleStatusChange(status: number) {
    if (!activePlayer || !bundleItemWithLocation) return;

    const bundleItem = bundleItemWithLocation as BundleItemWithLocation;
    const bundleIndex = bundles.findIndex(
      (bundleWithStatus) =>
        bundleWithStatus.bundle.name === bundleItem.bundleID,
    );

    if (bundleIndex === -1) return;

    const patch = {
      bundles: {
        [bundleIndex]: {
          bundleStatus: {
            [bundleItem.index]: status === 2,
          },
        },
      },
    };

    // Cheating the type system a bit by using object syntax to sparsely
    // access the nested arrays. Ideally we'd have a playerpatch type that
    // coerces all the nested array types into objects, so we can update
    // values without having to instantiate the whole array up to the index
    // we care about.
    // @ts-ignore
    await patchPlayer(patch);
    setIsOpen(false);
  }

  async function handleItemChange(newItem: BundleItem) {
    if (!activePlayer || !bundleItemWithLocation) return;

    const bundleItem = bundleItemWithLocation;
    const bundleIndex = bundles.findIndex(
      (bundleWithStatus) =>
        bundleWithStatus.bundle.name === bundleItem.bundleID,
    );

    if (bundleIndex === -1) return;

    const patch = {
      bundles: {
        [bundleIndex]: {
          bundle: {
            items: {
              [bundleItem.index]: newItem,
            },
          },
          bundleStatus: {
            [bundleItem.index]: false,
          },
        },
      },
    };

    // See note in handleStatusChange
    // @ts-ignore
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
          {bundleItemWithLocation && (
            <div className="mt-4 space-y-6">
              <section className="space-y-2">
                <div className="grid grid-cols-1 gap-2">
                  {completed ? (
                    <Button
                      variant="secondary"
                      disabled={!activePlayer || !completed}
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
                      disabled={!activePlayer || completed}
                      data-umami-event="Set completed"
                      onClick={() => {
                        handleStatusChange(2);
                      }}
                    >
                      Set Completed
                    </Button>
                  )}
                  {(
                    bundleItemWithLocation as BundleItem as BundleItemWithOptions
                  ).options && (
                    <BundleItemOptionDropdown
                      options={
                        (
                          bundleItemWithLocation as BundleItem as BundleItemWithOptions
                        ).options
                      }
                      disabled={!activePlayer}
                      handleItemChange={handleItemChange}
                    />
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
          {bundleItemWithLocation && (
            <div className="space-y-6 p-6">
              <section className="space-y-2">
                <div className="grid grid-cols-1 gap-2">
                  {completed ? (
                    <Button
                      variant="secondary"
                      disabled={!activePlayer || !completed}
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
                      disabled={!activePlayer || completed}
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
}

interface BundleItemDropdownProps {
  options: BundleItem[];
  disabled: boolean;
  handleItemChange: (newItem: BundleItem) => void;
}

function BundleItemOptionDropdown({
  options,
  handleItemChange,
  disabled,
}: BundleItemDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={disabled} variant="outline">
          Options
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        {options.map((option) => {
          let name = objects[option.itemID as keyof typeof objects].name;
          return (
            <DropdownMenuItem
              key={option.itemID}
              onClick={() => {
                handleItemChange(option);
              }}
            >
              {name}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
