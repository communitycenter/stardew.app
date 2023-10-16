import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";

import packageJson from "../../package.json";
const { version } = packageJson;

import { parseSaveFile } from "@/lib/file";
import { deleteCookie } from "cookies-next";
import { ChangeEvent, useContext, useRef, useState } from "react";

import { PlayersContext } from "@/contexts/players-context";

import { CreditsDialog } from "@/components/dialogs/credits-dialog";
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
import { useToast } from "@/components/ui/use-toast";
import { DeletionDialog } from "./dialogs/deletion-dialog";

import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import * as Fathom from "fathom-client";

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

    reader.onloadstart = () => {
      toast({
        variant: "default",
        title: "Uploading Save File",
        description: "Please wait while we upload your save file.",
      });
    };

    reader.onload = async function (event) {
      try {
        const players = parseSaveFile(event.target?.result as string);
        await uploadPlayers(players);
        toast({
          variant: "default",
          title: "Save File Uploaded",
          description: "Your save file has been successfully uploaded.",
        });
      } catch (err) {
        console.error(
          "[DEBUG] There's been an error parsing your save file. Please screenshot the text below, and send it in #bug-reports"
        );
        console.error(err);
        toast({
          variant: "destructive",
          title: "Error Parsing File",
          description: err instanceof Error ? err.message : "Unknown error.",
        });
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
            <Button
              variant="outline"
              onClick={() => Fathom.trackGoal("OWHYGHGB", 0)}
              asChild
            >
              <Link href={`/editor/edit`}>Edit Player</Link>
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={() => {
              Fathom.trackGoal("L85ILBEQ", 0);
              inputRef.current?.click();
            }}
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
              onClick={() => Fathom.trackGoal("H8PIRK79", 0)}
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
                  stardew.app {version}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setCreditsOpen(true);
                    Fathom.trackGoal("M3NR6ZVI", 0);
                  }}
                >
                  Credits
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="focus:text-red-400 dark:focus:text-red-400"
                  onClick={() => {
                    setDeletionOpen(true);
                    Fathom.trackGoal("6HIPZBRK", 0);
                  }}
                >
                  Delete Save Data
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    deleteCookie("token", {
                      maxAge: 0,
                      domain: "stardew.app",
                    });
                    deleteCookie("uid", {
                      maxAge: 0,
                      domain: "stardew.app",
                    });
                    deleteCookie("oauth_state", {
                      maxAge: 0,
                      domain: "stardew.app",
                    });
                    deleteCookie("discord_user", {
                      maxAge: 0,
                      domain: "stardew.app",
                    });
                    Fathom.trackGoal("ZMETRX0B", 0);
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
