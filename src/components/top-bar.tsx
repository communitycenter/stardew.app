import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";

import packageJson from "../../package.json";
const { version } = packageJson;

import { deleteCookie } from "cookies-next";
import { useContext, useEffect, useRef, useState } from "react";

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

import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useFeatureFlagVariantKey } from "posthog-js/react";
import { toast } from "sonner";
import { BugReportDialog } from "./dialogs/bugreport-dialog";
import { ChangelogDialog } from "./dialogs/changelog-dialog";
import { FeedbackDialog } from "./dialogs/feedback-dialog";
import { UploadDialog } from "./dialogs/upload-dialog";

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
    { refreshInterval: 0, revalidateOnFocus: false },
  );
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);
  const [deletionOpen, setDeletionOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [changelogOpen, setChangelogOpen] = useState(false);
  const [bugreportOpen, setBugreportOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  const [isDevelopment, setIsDevelopment] = useState(false);

  const { activePlayer, uploadPlayers } = useContext(PlayersContext);

  const seeChangelog = useFeatureFlagVariantKey("changelog_location");

  useEffect(() => {
    setIsDevelopment(parseInt(process.env.NEXT_PUBLIC_DEVELOPMENT!) === 1);
  }, []);

  useEffect(() => {
    const hasSeenChangelog = window.localStorage.getItem("has_seen_changelog");

    if (hasSeenChangelog) {
      return;
    }

    if (!seeChangelog) return;

    switch (seeChangelog) {
      case "control":
        break;
      case "toast":
        toast.message("stardew.app 2.2.0 is out!", {
          description: "We now support the 1.6 update!",
          action: {
            label: "Check it out!",
            onClick: () => {
              setChangelogOpen(true);
            },
          },
        });
        window.localStorage.setItem("has_seen_changelog", JSON.stringify(true));
        break;
      case "popup":
        setChangelogOpen(true);
        window.localStorage.setItem("has_seen_changelog", JSON.stringify(true));
        break;
    }
  }, [seeChangelog]);

  return (
    <>
      <div className="flex items-center justify-between bg-white px-7 py-3.5 dark:bg-neutral-950 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
        <div className="flex flex-shrink-0 items-center">
          <Image
            width={36}
            height={36}
            className="h-9 w-auto"
            src="/favicon.png"
            alt="stardew.app logo"
          />
          <h1 className="pl-3 font-medium">stardew.app</h1>
          {isDevelopment && (
            <span className="ml-2 rounded-full bg-red-100 px-2 py-1 text-xs text-red-500 dark:bg-red-800 dark:text-red-400">
              Internal
            </span>
          )}
        </div>
        {/* Mobile Menu */}
        <div className="flex justify-end md:hidden">
          <Button variant="outline" onClick={() => setMobileOpen(true)}>
            <HamburgerMenuIcon className="h-4 w-4" />
          </Button>
        </div>
        {/* Desktop Version */}
        <div className="ml-auto hidden w-full space-x-2 sm:justify-end md:flex">
          <PresetSelector />
          {activePlayer && (
            <Button variant="outline" data-umami-event="Edit player">
              <Link href={`/editor/edit`}>Edit Player</Link>
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={() => setUploadOpen(true)}
            data-umami-event="Upload save"
            className="hover:bg-green-500 hover:text-neutral-50 dark:hover:bg-green-500 dark:hover:text-neutral-50"
          >
            Upload Save
          </Button>
          {/* Not Logged In */}
          {!api.data?.discord_id && (
            <Button
              className="hover:bg-[#5865F2] dark:hover:bg-[#5865F2] dark:hover:text-white"
              data-umami-event="Log in"
            >
              <Link href="/api/oauth">Log In With Discord</Link>
            </Button>
          )}
          {/* Logged In */}
          {api.data?.discord_id && (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  className="max-w-[200px] space-x-2 px-2.5"
                  onClick={(e) => e.preventDefault()}
                >
                  <Avatar className="h-6 w-6">
                    {api.data.discord_avatar ? (
                      <AvatarImage
                        src={`https://cdn.discordapp.com/avatars/${api.data.discord_id}/${api.data.discord_avatar}.png`}
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
              <DropdownMenuContent className="mr-[26px] w-[200px]">
                <DropdownMenuLabel className="text-xs font-normal text-gray-400">
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
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  data-umami-event="Open feedback"
                  onClick={() => {
                    setFeedbackOpen(true);
                  }}
                >
                  Send us a message!
                </DropdownMenuItem>
                <DropdownMenuItem
                  data-umami-event="Open bug report"
                  onClick={() => {
                    setBugreportOpen(true);
                  }}
                >
                  Report a bug!
                </DropdownMenuItem>
                <DropdownMenuSeparator />

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
                      domain: parseInt(process.env.NEXT_PUBLIC_DEVELOPMENT!)
                        ? "localhost"
                        : "stardew.app",
                    });
                    deleteCookie("uid", {
                      maxAge: 0,
                      domain: parseInt(process.env.NEXT_PUBLIC_DEVELOPMENT!)
                        ? "localhost"
                        : "stardew.app",
                    });
                    deleteCookie("oauth_state", {
                      maxAge: 0,
                      domain: parseInt(process.env.NEXT_PUBLIC_DEVELOPMENT!)
                        ? "localhost"
                        : "stardew.app",
                    });
                    deleteCookie("discord_user", {
                      maxAge: 0,
                      domain: parseInt(process.env.NEXT_PUBLIC_DEVELOPMENT!)
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
        setFeedbackOpen={setFeedbackOpen}
        setCreditsOpen={setCreditsOpen}
        inputRef={inputRef}
      />
      <CreditsDialog open={creditsOpen} setOpen={setCreditsOpen} />
      <DeletionDialog open={deletionOpen} setOpen={setDeletionOpen} />
      <FeedbackDialog open={feedbackOpen} setOpen={setFeedbackOpen} />
      <ChangelogDialog open={changelogOpen} setOpen={setChangelogOpen} />
      <BugReportDialog open={bugreportOpen} setOpen={setBugreportOpen} />
      <UploadDialog open={uploadOpen} setOpen={setUploadOpen} />
    </>
  );
}
