import Image from "next/image";

import objects from "@/data/objects.json";

import type { Villager } from "@/types/items";

import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { PlayersContext } from "@/contexts/players-context";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useMediaQuery } from "@react-hook/media-query";
import { CreatePlayerRedirect } from "../createPlayerRedirect";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";

// look at villagers.py console output for categories that appear
const categories: Record<string, { name: string; iconURL: string }> = {
  "-2": {
    name: "All Gems",
    iconURL: "https://stardewvalleywiki.com/mediawiki/images/6/6a/Emerald.png",
  },
  "-5": {
    name: "Any Egg",
    iconURL:
      "https://stardewvalleywiki.com/mediawiki/images/5/5d/Large_Egg.png",
  },
  "-6": {
    name: "Any Milk",
    iconURL: "https://stardewvalleywiki.com/mediawiki/images/9/92/Milk.png",
  },
  "-7": {
    name: "All Cooked Dishes",
    iconURL:
      "https://stardewvalleywiki.com/mediawiki/images/8/87/Survival_Burger.png",
  },
  "-12": {
    name: "All Geode Minerals",
    iconURL:
      "https://stardewvalleywiki.com/mediawiki/images/3/3f/Star_Shards.png",
  },
  "-26": {
    name: "All Artisan Goods",
    iconURL: "https://stardewvalleywiki.com/mediawiki/images/6/69/Wine.png",
  },
  "-75": {
    name: "All Vegetables",
    iconURL: "https://stardewvalleywiki.com/mediawiki/images/9/9d/Tomato.png",
  },
  "-79": {
    name: "All Fruits",
    iconURL:
      "https://stardewvalleywiki.com/mediawiki/images/6/6d/Strawberry.png",
  },
  "-80": {
    name: "All Flowers",
    iconURL: "https://stardewvalleywiki.com/mediawiki/images/c/cf/Tulip.png",
  },
  "-81": {
    name: "All Forageables",
    iconURL: "https://stardewvalleywiki.com/mediawiki/images/4/4b/Daffodil.png",
  },
};

interface Props {
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  villager: Villager;
}

export const VillagerSheet = ({ open, setIsOpen, villager }: Props) => {
  const { activePlayer, patchPlayer } = useContext(PlayersContext);

  const [hearts, setHearts] = useState<string>("0");

  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    if (
      !activePlayer ||
      !activePlayer.social ||
      !activePlayer.social.relationships ||
      !activePlayer.social.relationships[villager.name]
    )
      return;

    setHearts(
      Math.floor(
        activePlayer.social.relationships[villager.name].points / 250
      ).toString()
    );
  }, [activePlayer, villager.name]);

  const maxHeartCount = useMemo(() => {
    if (activePlayer?.social?.spouse === villager.name) {
      return 15;
    }

    return 11;
  }, [activePlayer, villager.name]);

  function shouldHeartBeDisabled(heart: number) {
    if (heart >= 9 && villager.datable) {
      // first check if the villager is the player's spouse
      if (activePlayer?.social?.spouse === villager.name) {
        return false;
      }

      // if the player has a spouse and this villager is datable, disable
      if (
        activePlayer?.social?.spouse &&
        activePlayer.social.spouse !== villager.name
      ) {
        return true;
      }

      // no spouse, check if the player is dating this villager
      if (
        activePlayer?.social?.relationships?.[villager.name]?.status ===
        "Dating"
      ) {
        return false;
      }
      return true;
    }
    return false;
  }

  async function handleHeartChange(_hearts: string) {
    if (!activePlayer) return;

    const patch = {
      social: {
        relationships: {
          [villager.name]: {
            points: parseInt(_hearts) * 250,
          },
        },
      },
    };

    patchPlayer(patch);
    setIsOpen(false);
  }

  async function handleStatusChange(status: string, action: string) {
    if (!activePlayer) return;

    let patch = {};
    switch (action) {
      case "removeSpouse":
        patch = {
          social: {
            spouse: null,
            relationships: {
              [villager.name]: {
                status: status,
                points: 8 * 250,
              },
            },
          },
        };
        break;
      case "setSpouse":
        // we have to recreate the entire social object because when you set a spouse, it should to reset the statuses of all other dateable villagers
        // so on setSpouse action, recreate social object. If dateable villager, set status to null and set points to 8 * 250 if points are more than that
        let relationships: Record<string, any> = {};
        for (const [key, value] of Object.entries(
          activePlayer?.social?.relationships ?? {}
        )) {
          if (value.status === "Dating") {
            relationships[key] = {
              status: key === villager.name ? "Married" : null,
              points: value.points >= 8 * 250 ? 8 * 250 : value.points,
            };
          } else {
            relationships[key] = value;
          }
        }

        patch = {
          social: {
            spouse: villager.name,
            relationships: relationships,
          },
        };

        break;
      case "setDating":
        patch = {
          social: {
            relationships: {
              [villager.name]: {
                status: status,
                points: parseInt(hearts) * 250,
              },
            },
          },
        };
        break;
    }

    patchPlayer(patch);
    setIsOpen(false);
  }

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={setIsOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader className="mt-4">
            <div className="flex justify-center">
              <Image
                src={villager.iconURL}
                alt={villager.name}
                height={64}
                width={64}
              />
            </div>
            <SheetTitle className="text-center">{villager.name}</SheetTitle>
            <SheetDescription className="text-center italic">
              {villager.birthday}
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-6 mt-4">
            <section className="space-y-2">
              <h3 className="font-semibold">Actions</h3>
              <Separator />
              <div className="grid grid-cols-2 gap-3">
                <Select
                  value={hearts.toString()}
                  onValueChange={(val) => handleHeartChange(val)}
                  disabled={!activePlayer}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Set Hearts">
                      {hearts + " hearts"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Set Hearts</SelectLabel>
                      {[...Array(maxHeartCount)].map((_, i) => (
                        <SelectItem
                          key={i}
                          value={`${i}`}
                          disabled={shouldHeartBeDisabled(i)}
                        >
                          {`${i}`}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {activePlayer?.social?.spouse === villager.name ? (
                  <Button
                    variant="secondary"
                    onClick={() => handleStatusChange("", "removeSpouse")}
                  >
                    Remove Spouse
                  </Button>
                ) : activePlayer?.social?.relationships?.[villager.name]
                    ?.status === "Dating" ? (
                  <Button
                    variant="secondary"
                    onClick={() => handleStatusChange("Married", "setSpouse")}
                  >
                    Set Spouse
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={() => handleStatusChange("Dating", "setDating")}
                    disabled={
                      !villager.datable ||
                      typeof activePlayer?.social?.spouse === "string" ||
                      !activePlayer
                    }
                  >
                    Set Dating
                  </Button>
                )}
              </div>
              <div>{!activePlayer && <CreatePlayerRedirect />}</div>
            </section>
            <section className="space-y-2">
              <h3 className="font-semibold">Loved Gifts</h3>
              <Separator />
              <ul className="list-none list-inside grid grid-cols-2 gap-y-4">
                {villager.loves.map((itemID) => {
                  let item;
                  if (itemID > 0) {
                    item = objects[itemID.toString() as keyof typeof objects];
                  } else {
                    item = { ...categories[itemID] };
                  }
                  return (
                    <li
                      key={itemID}
                      className="mt-1 text-neutral-500 dark:text-neutral-400 text-sm truncate"
                    >
                      <div className="flex items-center space-x-1">
                        <Image
                          src={item.iconURL}
                          alt={item.name}
                          width={24}
                          height={24}
                          quality={25}
                        />
                        <p className="font-semibold truncate">• {item.name}</p>
                      </div>
                      {}
                    </li>
                  );
                })}
              </ul>
            </section>
            <section className="space-y-2">
              <h3 className="font-semibold">Likes</h3>
              <Separator />
              <ul className="list-none list-inside grid grid-cols-2 gap-y-4">
                {villager.likes.map((itemID) => {
                  let item;
                  if (itemID > 0) {
                    item = objects[itemID.toString() as keyof typeof objects];
                  } else {
                    item = { ...categories[itemID] };
                  }
                  return (
                    <li
                      key={itemID}
                      className="mt-1 text-neutral-500 dark:text-neutral-400 text-sm truncate"
                    >
                      <div className="flex items-center space-x-1">
                        <Image
                          src={item.iconURL}
                          alt={item.name}
                          width={24}
                          height={24}
                          quality={25}
                        />
                        <p className="font-semibold truncate">• {item.name}</p>
                      </div>
                      {}
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>
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
                src={villager.iconURL}
                alt={villager.name}
                height={64}
                width={64}
              />
            </div>
            <DrawerTitle className="text-center">{villager.name}</DrawerTitle>
            <DrawerDescription className="text-center italic">
              {villager.birthday}
            </DrawerDescription>
          </DrawerHeader>
          <div className="space-y-6 p-6">
            <section className="space-y-2">
              <h3 className="font-semibold">Actions</h3>
              <Separator />
              <div className="grid grid-cols-2 gap-3">
                <Select
                  value={hearts.toString()}
                  onValueChange={(val) => handleHeartChange(val)}
                  disabled={!activePlayer}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Set Hearts">
                      {hearts + " hearts"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Set Hearts</SelectLabel>
                      {[...Array(maxHeartCount)].map((_, i) => (
                        <SelectItem
                          key={i}
                          value={`${i}`}
                          disabled={shouldHeartBeDisabled(i)}
                        >
                          {`${i}`}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {activePlayer?.social?.spouse === villager.name ? (
                  <Button
                    variant="secondary"
                    onClick={() => handleStatusChange("", "removeSpouse")}
                  >
                    Remove Spouse
                  </Button>
                ) : activePlayer?.social?.relationships?.[villager.name]
                    ?.status === "Dating" ? (
                  <Button
                    variant="secondary"
                    onClick={() => handleStatusChange("Married", "setSpouse")}
                  >
                    Set Spouse
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={() => handleStatusChange("Dating", "setDating")}
                    disabled={
                      !villager.datable ||
                      typeof activePlayer?.social?.spouse === "string" ||
                      !activePlayer
                    }
                  >
                    Set Dating
                  </Button>
                )}
              </div>
              <div>{!activePlayer && <CreatePlayerRedirect />}</div>
            </section>
            <section className="space-y-2">
              <h3 className="font-semibold">Loved Gifts</h3>
              <Separator />
              <ul className="list-none list-inside grid grid-cols-2 gap-y-4">
                {villager.loves.map((itemID) => {
                  let item;
                  if (itemID > 0) {
                    item = objects[itemID.toString() as keyof typeof objects];
                  } else {
                    item = { ...categories[itemID] };
                  }
                  return (
                    <li
                      key={itemID}
                      className="mt-1 text-neutral-500 dark:text-neutral-400 text-sm truncate"
                    >
                      <div className="flex items-center space-x-1">
                        <Image
                          src={item.iconURL}
                          alt={item.name}
                          width={24}
                          height={24}
                          quality={25}
                        />
                        <p className="font-semibold truncate">• {item.name}</p>
                      </div>
                      {}
                    </li>
                  );
                })}
              </ul>
            </section>
            <section className="space-y-2">
              <h3 className="font-semibold">Likes</h3>
              <Separator />
              <ul className="list-none list-inside grid grid-cols-2 gap-y-4">
                {villager.likes.map((itemID) => {
                  let item;
                  if (itemID > 0) {
                    item = objects[itemID.toString() as keyof typeof objects];
                  } else {
                    item = { ...categories[itemID] };
                  }
                  return (
                    <li
                      key={itemID}
                      className="mt-1 text-neutral-500 dark:text-neutral-400 text-sm truncate"
                    >
                      <div className="flex items-center space-x-1">
                        <Image
                          src={item.iconURL}
                          alt={item.name}
                          width={24}
                          height={24}
                          quality={25}
                        />
                        <p className="font-semibold truncate">• {item.name}</p>
                      </div>
                      {}
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};
