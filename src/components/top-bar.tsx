import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";

import packageJson from "../../package.json";
const { version } = packageJson;

import { parseSaveFile } from "@/lib/file";
import { deleteCookie } from "cookies-next";
import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";

import { PlayersContext } from "@/contexts/players-context";

import { CreditsDialog } from "@/components/dialogs/credits-dialog";
import { DeletionDialog } from "@/components/dialogs/deletion-dialog";
import { PresetSelector } from "@/components/preset-selector";
import { MobileNav } from "@/components/sheets/mobile-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

import { useMixpanel } from "@/contexts/mixpanel-context";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
export interface User {
  id: string;
  discord_id: string;
  cookie_secret: string;
  discord_avatar: string;
  discord_name: string;
}

export function Topbar() {
  const api = useSWR<User>(
    "/api",
    // @ts-expect-error
    (...args) => fetch(...args).then((res) => res.json()),
    { refreshInterval: 0, revalidateOnFocus: false }
  );
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);
  const [deletionOpen, setDeletionOpen] = useState(false);

  const { activePlayer, uploadPlayers } = useContext(PlayersContext);
  const mixpanel = useMixpanel();

  useEffect(() => {
    mixpanel?.identify(api.data?.discord_id);

    mixpanel?.people?.set({
      discord_id: api.data?.discord_id,
      $name: api.data?.discord_name,
      $avatar: `https://cdn.discordapp.com/avatars/${api.data?.discord_id}/${api.data?.discord_avatar}.png`,
    });
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const file = e.target!.files![0];

    if (typeof file === "undefined" || !file) return;

    if (file.type !== "") {
      toast.error("Invalid file type", {
        description: "Please upload a Stardew Valley save file.",
      });
      return;
    }

    const reader = new FileReader();

    let uploadPromise;

    reader.onloadstart = () => {
      uploadPromise = new Promise((resolve, reject) => {
        reader.onload = async function (event) {
          try {
            const players = parseSaveFile(event.target?.result as string);
            await uploadPlayers(players);
            resolve("Your save file was successfully uploaded!");
            mixpanel?.track("Upload Save File", {
              Players: players.length,
            });
          } catch (err) {
            reject(err instanceof Error ? err.message : "Unknown error.");
          }
        };
      });

      // Start the loading toast
      toast.promise(uploadPromise, {
        loading: "Uploading your save file...",
        success: (data) => `${data}`,
        error: (err) => `There was an error parsing your save file:\n${err}`,
      });

      // Reset the input
      e.target.value = "";
      uploadPromise = null;
    };

    reader.readAsText(file);
  };

  return (
    <>
      <div className="flex items-center justify-between py-3.5 sm:flex-row sm:items-center sm:space-y-0 md:h-16 px-7 bg-white dark:bg-neutral-950">
        <div className="flex flex-shrink-0 items-center">
          <Image
            width={36}
            height={36}
            className="h-9 w-auto"
            src="/favicon.png"
            alt="stardew.app logo"
          />
          <h1 className="pl-3 font-medium">stardew.app</h1>
        </div>
        {/* Mobile Menu */}
        <div className="md:hidden flex justify-end">
          <Button variant="outline" onClick={() => setMobileOpen(true)}>
            <HamburgerMenuIcon className="h-4 w-4" />
          </Button>
        </div>
        {/* Desktop Version */}
        <div className="hidden ml-auto w-full space-x-2 sm:justify-end md:flex">
          <PresetSelector />
          {activePlayer && (
            <Button variant="outline" data-umami-event="Edit player">
              <Link href={`/editor/edit`}>Edit Player</Link>
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={() => {
              inputRef.current?.click();
            }}
            data-umami-event="Upload save"
            className="hover:bg-green-500 hover:text-neutral-50 dark:hover:bg-green-500 dark:hover:text-neutral-50"
          >
            Upload Save
            <input
              type="file"
              ref={inputRef}
              className="hidden"
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
            />
          </Button>
          {/* Not Logged In */}
          {!api.data?.discord_id && (
            <Button
              className="dark:hover:bg-[#5865F2] hover:bg-[#5865F2] dark:hover:text-white"
              data-umami-event="Log in"
            >
              <Link href="/api/oauth">Log In With Discord</Link>
            </Button>
          )}
          {/* Logged In */}
          {api.data?.discord_id && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="space-x-2 px-2.5 max-w-[200px]">
                  <Avatar className="h-6 w-6">
                    {api.data.discord_avatar ? (
                      <AvatarImage
                        src={`https://cdn.discordapfp.com/avatars/${api.data.discord_id}/${api.data.discord_avatar}.png`}
                      />
                    ) : (
                      <AvatarImage
                        src={`https://cdn.discordapp.com/embed/avatars/0.png`}
                      />
                    )}
                    <AvatarFallback delayMs={600}>
                      {api.data?.discord_name.slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <span className="truncate">{api.data.discord_name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[200px] mr-[26px]">
                <DropdownMenuLabel className="text-xs text-gray-400 font-normal">
                  stardew.app {version}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  data-umami-event="Open credits"
                  onClick={() => {
                    setCreditsOpen(true);
                  }}
                >
                  Credits
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="focus:text-red-400 dark:focus:text-red-400"
                  data-umami-event="Delete save data"
                  onClick={() => {
                    setDeletionOpen(true);
                  }}
                >
                  Delete Save Data
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  data-umami-event="Log out"
                  onClick={() => {
                    deleteCookie("token", {
                      maxAge: 0,
                      domain: parseInt(process.env.NEXT_PUBLIC_DEVELOPMENT)
                        ? "localhost"
                        : "stardew.app",
                    });
                    deleteCookie("uid", {
                      maxAge: 0,
                      domain: parseInt(process.env.NEXT_PUBLIC_DEVELOPMENT)
                        ? "localhost"
                        : "stardew.app",
                    });
                    deleteCookie("oauth_state", {
                      maxAge: 0,
                      domain: parseInt(process.env.NEXT_PUBLIC_DEVELOPMENT)
                        ? "localhost"
                        : "stardew.app",
                    });
                    deleteCookie("discord_user", {
                      maxAge: 0,
                      domain: parseInt(process.env.NEXT_PUBLIC_DEVELOPMENT)
                        ? "localhost"
                        : "stardew.app",
                    });

                    mixpanel?.reset();
                    return (window.location.href = "/");
                  }}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      <Separator />
      <MobileNav
        open={mobileOpen}
        setIsOpen={setMobileOpen}
        setDeletionOpen={setDeletionOpen}
        inputRef={inputRef}
      />
      <CreditsDialog open={creditsOpen} setOpen={setCreditsOpen} />
      <DeletionDialog open={deletionOpen} setOpen={setDeletionOpen} />
    </>
  );
}
