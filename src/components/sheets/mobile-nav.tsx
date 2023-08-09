import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Dispatch, MutableRefObject, SetStateAction, useContext } from "react";

import { PlayersContext } from "@/contexts/players-context";

import {
  Sheet,
  SheetTitle,
  SheetHeader,
  SheetContent,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { DiscordLogoIcon } from "@radix-ui/react-icons";

import {
  miscNavigation,
  playerNavigation,
  collectionsNavigation,
  SidebarCategory,
} from "@/components/sidebar";

interface Props {
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  inputRef: MutableRefObject<HTMLInputElement | null>;
}

export const MobileNav = ({ open, setIsOpen, inputRef }: Props) => {
  const pathname = usePathname();
  const { players, activePlayer, setActivePlayer } = useContext(PlayersContext);
  return (
    <Sheet open={open} onOpenChange={setIsOpen}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader className="mt-4">
          <div className="flex justify-center">
            <Image
              src="/favicon.png"
              alt="stardew.app logo"
              height={64}
              width={64}
            />
          </div>
          <SheetTitle className="text-center">stardew.app</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 mt-4">
          {/* Actions */}
          <section className="space-y-2">
            <h3 className="font-semibold">Actions</h3>
            <Separator />
            {/* Upload, Login with Discord */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="secondary"
                onClick={() => inputRef.current?.click()}
              >
                Upload
              </Button>
              {/* TODO: remove disabled when implemented */}
              <Button disabled>
                <DiscordLogoIcon className="mr-2 w-4 h-4" />
                Log In
              </Button>
            </div>
            {/* Player Selection */}
            <section className="space-y-2">
              <h4 className="text-sm font-semibold">Select Farmhand</h4>
              {!players && (
                <Button disabled className="w-full">
                  No player data
                </Button>
              )}
              <div className="grid grid-cols-2 gap-2">
                {players &&
                  players.map((player) => (
                    <Button
                      variant={
                        activePlayer?._id === player._id
                          ? "outline"
                          : "secondary"
                      }
                      key={player._id}
                      onClick={() => {
                        {
                          setActivePlayer(player);
                          setIsOpen(false);
                        }
                      }}
                      className="truncate"
                    >
                      {player.general.name}
                    </Button>
                  ))}
              </div>
            </section>
          </section>
          {/* Navigation */}
          <nav className="space-y-2">
            <h3 className="font-semibold">Navigation</h3>
            <Separator />
            {/* Player */}
            <section>
              <h4 className="mt-4 mb-2 font-semibold tracking-tight text-neutral-700 dark:text-neutral-300">
                Player
              </h4>
              <div className="space-y-1">
                {playerNavigation.map((item) => (
                  <Button
                    key={item.href}
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      item.href === pathname
                        ? ""
                        : "text-neutral-600 dark:text-neutral-400"
                    )}
                    asChild
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href={item.href}>
                      <item.icon className="w-4 h-4 mr-2" aria-hidden="true" />
                      {item.name}
                    </Link>
                  </Button>
                ))}
              </div>
            </section>
            {/* Collections */}
            <section>
              <h4 className="mt-4 mb-2 font-semibold tracking-tight text-neutral-700 dark:text-neutral-300">
                Collections
              </h4>
              <div className="space-y-1">
                {collectionsNavigation.map((item) => (
                  <Button
                    key={item.href}
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      item.href === pathname
                        ? ""
                        : "text-neutral-600 dark:text-neutral-400"
                    )}
                    asChild
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href={item.href}>
                      <item.icon className="w-4 h-4 mr-2" aria-hidden="true" />
                      {item.name}
                    </Link>
                  </Button>
                ))}
              </div>
            </section>
            {/* Misc */}
            <section>
              <h4 className="mt-4 mb-2 font-semibold tracking-tight text-neutral-700 dark:text-neutral-300">
                Misc
              </h4>
              <div className="space-y-1">
                {miscNavigation.map((item) => (
                  <Button
                    key={item.href}
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      item.href === pathname
                        ? ""
                        : "text-neutral-600 dark:text-neutral-400"
                    )}
                    asChild
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href={item.href}>
                      <item.icon className="w-4 h-4 mr-2" aria-hidden="true" />
                      {item.name}
                    </Link>
                  </Button>
                ))}
              </div>
            </section>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};
