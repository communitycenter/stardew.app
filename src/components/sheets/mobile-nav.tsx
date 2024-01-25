import Link from "next/link";
import useSWR from "swr";

import type { User } from "@/components/top-bar";

import { cn } from "@/lib/utils";
import { deleteCookie } from "cookies-next";
import { usePathname } from "next/navigation";
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useContext,
  useState,
} from "react";

import { PlayersContext } from "@/contexts/players-context";

import {
  collectionsNavigation,
  linksNavigation,
  miscNavigation,
  playerNavigation,
} from "@/components/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "../ui/scroll-area";

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
    <Drawer open={open} onOpenChange={setIsOpen}>
      <DrawerContent className="fixed bottom-0 left-0 right-0 max-h-[90dvh]">
        <ScrollArea className="overflow-auto">
          <div className="space-y-6 p-6">
            {/* Actions */}
            <section className="space-y-2">
              <h3 className="font-semibold">Actions</h3>
              {/* Upload, Login with Discord */}
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant="default"
                  onClick={() => inputRef.current?.click()}
                >
                  Upload
                </Button>

                {!api.data?.discord_id && (
                  <Button className="dark:hover:bg-[#5865F2] hover:bg-[#5865F2] dark:hover:text-white">
                    <Link href="/api/oauth">Log In With Discord</Link>
                  </Button>
                )}
                {api.data?.discord_id && (
                  <>
                    <Button className="space-x-2 px-2.5" variant="secondary">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={`https://cdn.discorapp.com/avatars/${api.data?.discord_id}/${api.data?.discord_avatar}.png`}
                        />
                        <AvatarFallback delayMs={600}>
                          {api.data?.discord_name.slice(0, 1).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate">{api.data.discord_name}</span>
                    </Button>
                    <div className="grid grid-cols-1 gap-2">
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
                            domain: parseInt(
                              process.env.NEXT_PUBLIC_DEVELOPMENT
                            )
                              ? "localhost"
                              : "stardew.app",
                          });
                          deleteCookie("uid", {
                            maxAge: 0,
                            domain: parseInt(
                              process.env.NEXT_PUBLIC_DEVELOPMENT
                            )
                              ? "localhost"
                              : "stardew.app",
                          });
                          deleteCookie("oauth_state", {
                            maxAge: 0,
                            domain: parseInt(
                              process.env.NEXT_PUBLIC_DEVELOPMENT
                            )
                              ? "localhost"
                              : "stardew.app",
                          });
                          deleteCookie("discord_user", {
                            maxAge: 0,
                            domain: parseInt(
                              process.env.NEXT_PUBLIC_DEVELOPMENT
                            )
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
                <div className="grid grid-cols-1 gap-2 mb-2">
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
                <div className="grid grid-cols-2 gap-2">
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
                        <item.icon
                          className="w-4 h-4 mr-2"
                          aria-hidden="true"
                        />
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
                        <item.icon
                          className="w-4 h-4 mr-2"
                          aria-hidden="true"
                        />
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
                        <item.icon
                          className="w-4 h-4 mr-2"
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </Button>
                  ))}
                </div>
              </section>
              {/* Links, because fuck link buttons */}
              <section>
                <h4 className="mt-4 mb-2 font-semibold tracking-tight text-neutral-700 dark:text-neutral-300">
                  Links
                </h4>
                <div className="space-y-1">
                  {linksNavigation.map((item) => (
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
                        <item.icon
                          className="w-4 h-4 mr-2"
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </Button>
                  ))}
                </div>
              </section>
            </nav>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};
