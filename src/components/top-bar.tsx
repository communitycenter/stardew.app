import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";

import { parseSaveFile } from "@/lib/file";
import { deleteCookie } from "cookies-next";
import { ChangeEvent, useContext, useRef, useState } from "react";

import { PlayersContext } from "@/contexts/players-context";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { MobileNav } from "@/components/sheets/mobile-nav";
import { PresetSelector } from "@/components/preset-selector";
import { CreditsDialog } from "@/components/dialogs/credits-dialog";
import { DeletionDialog } from "./dialogs/deletion-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { IconLoader2 } from "@tabler/icons-react";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

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

  const [loading, setLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);
  const [deletionOpen, setDeletionOpen] = useState(false);

  const { toast } = useToast();
  const { activePlayer, uploadPlayers } = useContext(PlayersContext);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const file = e.target!.files![0];

    if (typeof file === "undefined" || !file) return;

    if (file.type !== "") {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please upload a Stardew Valley save file.",
      });
      return;
    }

    const reader = new FileReader();

    reader.onloadstart = () => setLoading(true);

    reader.onload = async function (event) {
      try {
        const players = parseSaveFile(event.target?.result as string);
        await uploadPlayers(players);
        setLoading(false);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error Parsing File",
          description: err instanceof Error ? err.message : "Unknown error.",
        });
        setLoading(false);
      }
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
            <Button variant="outline" asChild>
              <Link href={`/editor/edit`}>Edit Player</Link>
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={() => inputRef.current?.click()}
            className="hover:bg-green-500 hover:text-neutral-50 dark:hover:bg-green-500 dark:hover:text-neutral-50 w-20"
            disabled={loading}
          >
            {!loading && "Upload"}
            {loading && <IconLoader2 className="animate-spin h-4 w-4" />}
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
              // asChild
              disabled
            >
              {/* <Link href="/api/oauth">Log In With Discord</Link> */}
              Log In With Discord
            </Button>
          )}
          {/* Logged In */}
          {api.data?.discord_id && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="space-x-2 px-2.5 max-w-[200px]">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={`https://cdn.discordapp.com/avatars/${api.data.discord_id}/${api.data.discord_avatar}.png`}
                    />
                    <AvatarFallback>
                      {api.data?.discord_name.slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{api.data.discord_name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[200px] mr-[26px]">
                <DropdownMenuLabel className="text-xs text-gray-400 font-normal">
                  stardew.app 2.0.0
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setCreditsOpen(true)}>
                  Credits
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="focus:text-red-400 dark:focus:text-red-400"
                  onClick={() => setDeletionOpen(true)}
                >
                  Delete Save Data
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
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
