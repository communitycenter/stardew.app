import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";

import type { User } from "@/components/top-bar";

import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { deleteCookie } from "cookies-next";
import { usePathname } from "next/navigation";

import { PlayersContext } from "@/contexts/players-context";

import {
  miscNavigation,
  playerNavigation,
  collectionsNavigation,
} from "@/components/sidebar";
import {
  Sheet,
  SheetTitle,
  SheetHeader,
  SheetContent,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setDeletionOpen: Dispatch<SetStateAction<boolean>>;
  inputRef: MutableRefObject<HTMLInputElement | null>;
}

export const MobileNav = ({
  open,
  setIsOpen,
  inputRef,
  setDeletionOpen,
}: Props) => {
  const api = useSWR<User>(
    "/api",
    // @ts-expect-error
    (...args) => fetch(...args).then((res) => res.json()),
    { refreshInterval: 0, revalidateOnFocus: false }
  );

  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
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
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant="default"
                onClick={() => inputRef.current?.click()}
              >
                Upload
              </Button>
              {activePlayer && (
                <Button
                  variant="secondary"
                  className="w-full"
                  asChild
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  <Link href="/editor/edit">Edit Farmhand</Link>
                </Button>
              )}
              {!api.data?.discord_id && (
                <Button className="dark:hover:bg-[#5865F2] hover:bg-[#5865F2] dark:hover:text-white">
                  <Link href="/api/oauth">Log In With Discord</Link>
                  Log In With Discord
                </Button>
              )}
              {api.data?.discord_id && (
                <>
                  <Button className="space-x-2 px-2.5" variant="secondary">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={`https://cdn.discordapp.com/avatars/${api.data?.discord_id}/${api.data?.discord_avatar}.png`}
                      />
                      <AvatarFallback>
                        {api.data?.discord_name.slice(0, 1).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate">{api.data.discord_name}</span>
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="destructive"
                      onClick={() => setDeletionOpen(true)}
                    >
                      Delete save
                    </Button>
                    <Button
                      onClick={() => {
                        deleteCookie("token", {
                          maxAge: 0,
                          domain: process.env.NEXT_PUBLIC_DEVELOPMENT
                            ? "localhost"
                            : "stardew.app",
                        });
                        deleteCookie("uid", {
                          maxAge: 0,
                          domain: process.env.NEXT_PUBLIC_DEVELOPMENT
                            ? "localhost"
                            : "stardew.app",
                        });
                        deleteCookie("oauth_state", {
                          maxAge: 0,
                          domain: process.env.NEXT_PUBLIC_DEVELOPMENT
                            ? "localhost"
                            : "stardew.app",
                        });
                        deleteCookie("discord_user", {
                          maxAge: 0,
                          domain: process.env.NEXT_PUBLIC_DEVELOPMENT
                            ? "localhost"
                            : "stardew.app",
                        });
                        return (window.location.href = "/");
                      }}
                    >
                      Log out
                    </Button>
                  </div>
                </>
              )}
            </div>
            {/* Player Selection */}
            <section className="space-y-2">
              {players?.length ? (
                <h4 className="text-sm font-semibold">Select Farmhand</h4>
              ) : null}
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
                      {player.general?.name ?? "Unknown"}
                    </Button>
                  ))}
              </div>
              <Button
                variant="secondary"
                className="w-full"
                asChild
                onClick={() => setIsOpen(false)}
              >
                <Link href="/editor/create">New Farmhand</Link>
              </Button>
              {activePlayer && (
                <Button
                  variant="secondary"
                  className="w-full"
                  asChild
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/editor/edit">Edit Farmhand</Link>
                </Button>
              )}
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
