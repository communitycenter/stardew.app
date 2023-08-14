import Image from "next/image";

import { ChangeEvent, useContext, useRef, useState } from "react";

import { parseSaveFile } from "@/lib/file";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { MobileNav } from "@/components/sheets/mobile-nav";
import { PresetSelector } from "@/components/preset-selector";

import { PlayersContext } from "@/contexts/players-context";

import { DropdownMenuIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { IconLoader2, IconLogout, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import useSWR from "swr";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { deleteCookie } from "cookies-next";

export function Topbar() {
  // @ts-expect-error
  const api = useSWR<Player>(
    "/api",
    // @ts-expect-error
    (...args) => fetch(...args).then((res) => res.json()),
    { refreshInterval: 0, revalidateOnFocus: false }
  );
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [open, setIsOpen] = useState(false);

  const { toast } = useToast();
  const { uploadPlayers } = useContext(PlayersContext);

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
          <Button variant="outline" onClick={() => setIsOpen(true)}>
            <HamburgerMenuIcon className="h-4 w-4" />
          </Button>
        </div>
        {/* Desktop Version */}
        <div className="hidden ml-auto w-full space-x-2 sm:justify-end md:flex">
          <PresetSelector />
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
          {!api.data?.discord_id && (
            <Link href="/api/oauth">
              <Button
                disabled
                className="dark:hover:bg-[#5865F2] hover:bg-[#5865F2] dark:hover:text-white"
              >
                Log In With Discord
              </Button>
            </Link>
          )}
          {api.data?.discord_id && (
            <Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button className="dark:hover:bg-[#5865F2] hover:bg-[#5865F2] dark:hover:text-white space-x-2 px-2.5">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={`https://cdn.discordapp.com/avatars/${api.data?.discord_id}/${api.data?.discord_avatar}.png`}
                      />
                      <AvatarFallback>
                        {api.data?.discord_name.slice(0, 1).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{api.data?.discord_name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[200px] mr-[26px]">
                  <DropdownMenuLabel className="text-xs text-gray-400 font-normal">
                    stardew.app 2.0.0
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DialogTrigger asChild>
                    <DropdownMenuItem>Credits</DropdownMenuItem>
                  </DialogTrigger>

                  <DropdownMenuItem
                    disabled={true}
                    className="dark:focus:bg-red-400/50 dark:focus:text-red-100 focus:bg-red-400/50 focus:text-red-100"
                  >
                    Delete uploaded save
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
                <DialogContent>
                  <div className="flex justify-center">
                    <Image
                      src="https://stardewvalleywiki.com/mediawiki/images/c/c8/Emojis043.png"
                      alt={"Heart icon"}
                      width={48}
                      height={48}
                    />
                  </div>
                  <DialogHeader>
                    <DialogTitle className="text-center">Credits</DialogTitle>
                  </DialogHeader>
                  <DialogDescription>
                    stardew.app was developed, designed, and created by{" "}
                    <a href="https://jack.bio" className="underline">
                      Jack LaFond
                    </a>{" "}
                    and{" "}
                    <a href="https://solorio.dev" className="underline">
                      Clemente Solorio
                    </a>
                    .
                  </DialogDescription>
                  <DialogDescription>
                    However, it wouldn&apos;t be possible without the help of
                    the{" "}
                    <a href="https://solorio.dev" className="underline">
                      Leah Lundqvist
                    </a>{" "}
                    (backend),{" "}
                    <a href="https://solorio.dev" className="underline">
                      Brandon Saldan
                    </a>{" "}
                    (frontend), and our countless contributors on{" "}
                    <a href="https://stardew.app/github" className="underline">
                      GitHub
                    </a>
                    .
                  </DialogDescription>
                  <DialogHeader>
                    <DialogTitle className="text-sm">
                      Notable Mentions
                    </DialogTitle>
                  </DialogHeader>
                  <DialogDescription>
                    <li>Stardew Valley Wiki</li>
                    <li>Stardew Valley&apos;s Discord #seasoned-farmers</li>
                    <li>ConcernedApe</li>
                    <li>You, the user - thank you!</li>
                  </DialogDescription>
                </DialogContent>
              </DropdownMenu>
            </Dialog>
          )}
        </div>
        <MobileNav open={open} setIsOpen={setIsOpen} inputRef={inputRef} />
      </div>
      <Separator />
    </>
  );
}
