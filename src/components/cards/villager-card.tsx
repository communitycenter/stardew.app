import Image from "next/image";

import type { Villager } from "@/types/items";

import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useContext, useMemo } from "react";

import { PlayersContext } from "@/contexts/players-context";

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { useMixpanel } from "@/contexts/mixpanel-context";
import { HeartIcon } from "@heroicons/react/24/outline";
import { IconChevronRight } from "@tabler/icons-react";

interface Props {
  villager: Villager;
  points: number;
  status: string | null;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setVillager: Dispatch<SetStateAction<Villager>>;
}

const classes = [
  "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-800",
  "border-green-900 bg-green-500/20 hover:bg-green-500/30 dark:bg-green-500/10 hover:dark:bg-green-500/20",
];

export const VillagerCard = ({
  villager,
  points,
  status,
  setIsOpen,
  setVillager,
}: Props) => {
  const { activePlayer, patchPlayer } = useContext(PlayersContext);
  const mixpanel = useMixpanel();

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

  const hearts = Math.floor(points / 250);

  const getHearts = (count: number) => {
    let icons: JSX.Element[] = [];

    for (let i = 1; i < count + 1; i++) {
      icons.push(
        <HeartIcon
          key={i}
          className={cn(
            "h-5 w-5 text-neutral-500 dark:text-neutral-700",
            hearts >= i
              ? "fill-red-500 text-red-500 dark:text-red-500"
              : !status && villager.datable && i >= 9
              ? "fill-neutral-500 text-neutral-500 dark:text-neutral-700 dark:fill-neutral-700"
              : ""
          )}
        />
      );
    }

    return icons;
  };

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
    await patchPlayer(patch);
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
                points: hearts * 250,
              },
            },
          },
        };
        break;
    }

    await patchPlayer(patch);
  }

  const _status = useMemo(() => {
    if (!activePlayer || !activePlayer.social) return 0;

    if (villager.datable) {
      if (points >= 8 * 250) return 1;
    } else {
      if (points >= 10 * 250) return 1;
    }

    return 0;
  }, [activePlayer, villager, points]);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <button
          className={cn(
            "overflow-x-clip flex select-none items-center text-left space-x-3 rounded-lg border py-4 px-5 text-neutral-950 dark:text-neutral-50 shadow-sm hover:cursor-pointer transition-colors",
            classes[_status]
          )}
          onClick={() => {
            setVillager(villager);
            setIsOpen(true);
          }}
        >
          <Image
            src={villager.iconURL}
            alt={villager.name}
            width={32}
            height={32}
          />
          <div className="flex-1">
            <p className="font-medium truncate">{villager.name}</p>
            <div className="flex">
              {status === "Married" ? getHearts(14) : getHearts(10)}
            </div>
          </div>
          <IconChevronRight className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
        </button>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        {activePlayer?.social?.spouse === villager.name ? (
          <ContextMenuItem
            inset
            onClick={() => {
              handleStatusChange("", "removeSpouse");
              mixpanel?.track("Context Button Clicked", {
                Action: "Remove Spouse",
                "Card Type": "Village card",
              });
            }}
            disabled={!activePlayer}
          >
            Remove Spouse
          </ContextMenuItem>
        ) : activePlayer?.social?.relationships?.[villager.name]?.status ===
          "Dating" ? (
          <ContextMenuItem
            inset
            onClick={() => {
              handleStatusChange("Married", "setSpouse");
              mixpanel?.track("Context Button Clicked", {
                Action: "Set Spouse",
                "Card Type": "Village card",
              });
            }}
            disabled={!activePlayer}
          >
            Set Spouse
          </ContextMenuItem>
        ) : (
          <ContextMenuItem
            inset
            disabled={
              !villager.datable ||
              typeof activePlayer?.social?.spouse === "string" ||
              !activePlayer
            }
            onClick={() => {
              handleStatusChange("Dating", "setDating");
              mixpanel?.track("Context Button Clicked", {
                Action: "Set Dating",
                "Card Type": "Village card",
              });
            }}
          >
            Set Dating
          </ContextMenuItem>
        )}
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>Set Hearts</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            {[...Array(maxHeartCount)].map((_, i) => (
              <ContextMenuCheckboxItem
                key={i}
                disabled={shouldHeartBeDisabled(i) || !activePlayer}
                checked={hearts === i}
                onClick={() => handleHeartChange(i.toString())}
              >
                {i.toString()}
              </ContextMenuCheckboxItem>
            ))}
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
};
