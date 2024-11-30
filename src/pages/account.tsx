import type { User } from "@/components/top-bar";

import Head from "next/head";
import useSWR from "swr";

import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { deleteCookie, getCookie } from "cookies-next";

import { usePreferences } from "@/contexts/preferences-context";
import { PlayerType, usePlayers } from "@/contexts/players-context";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DeletionDialog } from "@/components/dialogs/deletion-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  ClipboardIcon,
  CursorArrowRaysIcon,
  EllipsisHorizontalIcon,
  EyeIcon,
  InformationCircleIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import { toast } from "sonner";

function InlineInput({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex w-full items-center">
      <label
        htmlFor={label.replace(" ", "-").toLowerCase()}
        className="flex h-9 min-w-fit items-center rounded-md rounded-r-none border border-neutral-200 bg-neutral-100 px-3 text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900"
      >
        {label}
      </label>
      <div className="relative flex w-full items-center">
        <Input
          type="text"
          readOnly
          autoComplete="off"
          id={label.replace(" ", "-").toLowerCase()}
          value={value}
          className="text-ellipsis rounded-l-none border-l-0 pr-9"
        />
        <Button
          size="icon"
          variant="ghost"
          className="group absolute right-0 hover:bg-inherit dark:hover:bg-inherit"
          onClick={() => {
            navigator.clipboard.writeText(value);
            toast.info(`Your ${label} has been copied to your clipboard.`);
          }}
        >
          <ClipboardIcon className="h-5 w-5 group-hover:text-neutral-500 dark:group-hover:text-neutral-400" />
        </Button>
      </div>
    </div>
  );
}

function PlayerCard({ player }: { player: PlayerType }) {
  const router = useRouter();
  const { setActivePlayer } = usePlayers();

  const [deletionOpen, setDeletionOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between space-x-2 rounded-md border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
        <div className="flex-col gap-1 overflow-hidden">
          <p className="overflow-hidden text-ellipsis text-sm font-semibold text-neutral-950 dark:text-white">
            {player.general?.name}
          </p>
          <p className="overflow-hidden text-ellipsis text-sm text-neutral-500 dark:text-neutral-400">
            {player._id}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <EllipsisHorizontalIcon className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48" align="end">
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(player._id);
                toast.info(
                  "Your farmhand ID has been copied to your clipboard.",
                );
              }}
            >
              <ClipboardIcon className="mr-2 h-4 w-4" />
              <span>Copy Farmhand ID</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setActivePlayer(player);
                toast.info(
                  `Your active farmhand has been changed to ${player.general?.name}.`,
                );
              }}
            >
              <CursorArrowRaysIcon className="mr-2 h-4 w-4" />
              <span>Set Active Farmhand</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setActivePlayer(player);
                router.push(`/editor/edit`);
              }}
            >
              <PencilSquareIcon className="mr-2 h-4 w-4" />
              <span>Edit Farmhand</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDeletionOpen(true)}>
              <TrashIcon className="mr-2 h-4 w-4 text-red-400" />
              <span className="text-red-400">Delete Farmhand</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <DeletionDialog
        type="player"
        open={deletionOpen}
        playerID={player._id}
        setOpen={setDeletionOpen}
      />
    </>
  );
}

function FarmCard({
  farmInfo,
  children,
}: {
  farmInfo: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="border-b border-neutral-200 dark:border-neutral-800">
        <CardTitle className="overflow-hidden text-ellipsis whitespace-nowrap">
          {farmInfo}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-5">{children}</CardContent>
    </Card>
  );
}

type GroupedPlayers = {
  [key: string]: PlayerType[];
};

export default function Account() {
  const api = useSWR<User>(
    "/api",
    // @ts-expect-error
    (...args) => fetch(...args).then((res) => res.json()),
    { refreshInterval: 0, revalidateOnFocus: false },
  );

  const { players } = usePlayers();
  const { show, toggleShow } = usePreferences();

  const [deletionOpen, setDeletionOpen] = useState(false);
  const [inputType, setInputType] = useState<"password" | "text">("password");

  // group players by farmInfo
  const groupedPlayers: GroupedPlayers | undefined = useMemo(() => {
    if (!players) return;
    const groupedPlayers: GroupedPlayers = {};
    players.forEach((player) => {
      if (!groupedPlayers[player.general?.farmInfo!]) {
        groupedPlayers[player.general?.farmInfo!] = [];
      }
      groupedPlayers[player.general?.farmInfo!].push(player);
    });
    return groupedPlayers;
  }, [players]);

  return (
    <>
      <Head>
        <title>stardew.app | Account Settings</title>
        <meta
          name="description"
          content="Manage your stardew.app account. Manage your data, saves, and more."
        />
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <main className="flex min-h-[calc(100vh-65px)] border-neutral-200 px-5 pb-8 pt-2 dark:border-neutral-800 md:border-l md:px-8">
        <div className="mx-auto mt-4 w-full max-w-5xl space-y-8">
          <Tabs defaultValue="site">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="site">Site Settings</TabsTrigger>
              <TabsTrigger value="authentication">Authentication</TabsTrigger>
              <TabsTrigger value="saves">Saves</TabsTrigger>
            </TabsList>
            <TabsContent value="site" className="mt-4 space-y-8">
              <section className="flex flex-col space-y-3">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Site Settings
                  </h1>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 md:text-base">
                    Manage and view your site settings.
                  </p>
                </div>
                <Card>
                  <CardHeader className=" border-neutral-200 dark:border-neutral-800">
                    <span className="flex flex-row items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle>Show New Content</CardTitle>
                        <CardDescription>
                          This will enable 1.6 content on the site - don&apos;t
                          use if you don&apos;t want to see 1.6 spoilers!
                        </CardDescription>
                      </div>
                      <div>
                        <Switch
                          id="new-content-switch"
                          defaultChecked={show}
                          onCheckedChange={() => {
                            const res = toggleShow();
                            toast.success(
                              `1.6 content has been ${res ? "enabled" : "disabled"}.`,
                            );
                          }}
                        />
                      </div>
                    </span>
                  </CardHeader>
                </Card>
              </section>
            </TabsContent>
            <TabsContent value="authentication" className="mt-4 space-y-8">
              <section className="flex flex-col space-y-4">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Authentication
                </h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 md:text-base">
                  Manage and view your authentication information. Your user ID
                  is used to identify your account and is used to link your
                  saves to your account.
                </p>

                {/* Logged In */}
                {api.data && (
                  <>
                    <Card>
                      <CardHeader className="border-b border-neutral-200 dark:border-neutral-800">
                        <CardTitle>Account</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 p-5">
                        <InlineInput
                          label="Discord ID"
                          value={api.data.discord_id}
                        />
                        <InlineInput
                          label="Username"
                          value={api.data.discord_name}
                        />
                      </CardContent>
                    </Card>
                  </>
                )}

                <Card>
                  <CardHeader className="border-b border-neutral-200 dark:border-neutral-800">
                    <CardTitle>User ID</CardTitle>
                  </CardHeader>
                  <CardContent className="p-5">
                    <div className="relative flex w-full items-center">
                      <Input
                        type={inputType}
                        id="uid"
                        readOnly
                        value={getCookie("uid") as string}
                        className="text-ellipsis pr-[72px]"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="group absolute right-9 hover:bg-inherit dark:hover:bg-inherit"
                        onClick={() =>
                          setInputType((prev) =>
                            prev === "password" ? "text" : "password",
                          )
                        }
                      >
                        <EyeIcon className="h-5 w-5 group-hover:text-neutral-500 dark:group-hover:text-neutral-400" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="group absolute right-0 hover:bg-inherit dark:hover:bg-inherit"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            getCookie("uid") as string,
                          );
                          toast.info(
                            "Your user ID has been copied to your clipboard.",
                          );
                        }}
                      >
                        <ClipboardIcon className="h-5 w-5 group-hover:text-neutral-500 dark:group-hover:text-neutral-400" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </section>
              {api.data && (
                <section className="flex flex-col space-y-4">
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Danger Zone
                  </h1>
                  <div className="flex space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        deleteCookie("token", {
                          maxAge: 0,
                          domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
                        });
                        deleteCookie("uid", {
                          maxAge: 0,
                          domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
                        });
                        deleteCookie("oauth_state", {
                          maxAge: 0,
                          domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
                        });
                        deleteCookie("discord_user", {
                          maxAge: 0,
                          domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
                        });
                        return (window.location.href = "/");
                      }}
                    >
                      Log Out
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => setDeletionOpen(true)}
                    >
                      Delete Account
                    </Button>
                  </div>
                </section>
              )}
            </TabsContent>
            <TabsContent value="saves" className="mt-4 space-y-8">
              <section className="flex flex-col space-y-4">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Saves
                </h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 md:text-base">
                  Manage and view your Stardew Valley Saves.
                </p>

                {/* Players/Farms */}
                {players?.length === 0 && (
                  <div className="flex w-full items-center space-x-2 rounded-md bg-blue-200 p-3">
                    <InformationCircleIcon className="h-5 w-5 text-blue-700" />
                    <p className="text-center font-semibold text-blue-700">
                      No Players Found
                    </p>
                  </div>
                )}

                {/* Show farms and players */}
                {groupedPlayers && (
                  <>
                    {Object.keys(groupedPlayers).map((farmInfo) => (
                      <FarmCard key={farmInfo} farmInfo={farmInfo}>
                        {groupedPlayers[farmInfo].map((player) => (
                          <PlayerCard key={player._id} player={player} />
                        ))}
                      </FarmCard>
                    ))}
                  </>
                )}
              </section>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <DeletionDialog
        open={deletionOpen}
        setOpen={setDeletionOpen}
        type="account"
      />
    </>
  );
}
