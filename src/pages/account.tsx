import type { User } from "@/components/top-bar";

import Head from "next/head";
import useSWR from "swr";

import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useContext, useMemo, useState } from "react";

import { PlayerType, PlayersContext } from "@/contexts/players-context";

import { DeletionDialog } from "@/components/dialogs/deletion-dialog";
import { Button } from "@/components/ui/button";
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

import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const data = [
  {
    value: "old",
    label: "1.5",
  },
  {
    value: "new",
    label: "1.6",
  },
];

function InlineInput({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center w-full">
      <label
        htmlFor={label.replace(" ", "-").toLowerCase()}
        className="min-w-fit text-sm px-3 bg-neutral-100 text-neutral-500 dark:bg-neutral-900 h-9 items-center flex rounded-md rounded-r-none border border-neutral-200 dark:border-neutral-800"
      >
        {label}
      </label>
      <div className="relative w-full flex items-center">
        <Input
          type="text"
          readOnly
          autoComplete="off"
          id={label.replace(" ", "-").toLowerCase()}
          value={value}
          className="pr-9 border-l-0 rounded-l-none text-ellipsis"
        />
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-0 group hover:bg-inherit dark:hover:bg-inherit"
          onClick={() => {
            navigator.clipboard.writeText(value);
            toast.info(`Your ${label} has been copied to your clipboard.`);
          }}
        >
          <ClipboardIcon className="w-5 h-5 group-hover:text-neutral-500 dark:group-hover:text-neutral-400" />
        </Button>
      </div>
    </div>
  );
}

function PlayerCard({ player }: { player: PlayerType }) {
  const router = useRouter();
  const { setActivePlayer } = useContext(PlayersContext);

  const [deletionOpen, setDeletionOpen] = useState(false);

  return (
    <>
      <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 rounded-md flex items-center p-4 justify-between space-x-2">
        <div className="flex-col gap-1 overflow-hidden">
          <p className="text-neutral-950 dark:text-white font-semibold text-sm text-ellipsis overflow-hidden">
            {player.general?.name}
          </p>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm text-ellipsis overflow-hidden">
            {player._id}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <EllipsisHorizontalIcon className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48" align="end">
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(player._id);
                toast.info(
                  "Your farmhand ID has been copied to your clipboard."
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
                  `Your active farmhand has been changed to ${player.general?.name}.`
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
        <CardTitle className="whitespace-nowrap overflow-hidden text-ellipsis">
          {farmInfo}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-3">{children}</CardContent>
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
    { refreshInterval: 0, revalidateOnFocus: false }
  );

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const { players } = useContext(PlayersContext);

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
      <main className="flex min-h-[calc(100vh-65px)] md:border-l border-neutral-200 dark:border-neutral-800 pt-2 pb-8 px-5 md:px-8">
        <div className="mx-auto max-w-5xl w-full space-y-8 mt-4">
          <Tabs defaultValue="authentication">
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
                  <p className="text-neutral-500 dark:text-neutral-400 text-sm md:text-base">
                    Manage and view your site settings.
                  </p>
                </div>
                <Card>
                  <CardHeader className=" border-neutral-200 dark:border-neutral-800">
                    <span className="flex flex-row items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle>Enable 1.6 Content</CardTitle>
                        <CardDescription>
                          <p>
                            This will enable 1.6 content on the site -
                            don&apos;t use if you don&apos;t want to see 1.6
                            spoilers!
                          </p>
                        </CardDescription>
                      </div>
                      <div>
                        <Switch
                          id="1_6"
                          defaultChecked={getCookie("enable_1_6") as boolean}
                          onCheckedChange={() => {
                            console.log(
                              parseInt(process.env.NEXT_PUBLIC_DEVELOPMENT!)
                                ? "localhost"
                                : "stardew.app"
                            );
                            getCookie("enable_1_6") === true
                              ? deleteCookie("enable_1_6", {
                                  domain: parseInt(
                                    process.env.NEXT_PUBLIC_DEVELOPMENT!
                                  )
                                    ? "localhost"
                                    : "stardew.app",
                                })
                              : setCookie("enable_1_6", true, {
                                  domain: parseInt(
                                    process.env.NEXT_PUBLIC_DEVELOPMENT!
                                  )
                                    ? "localhost"
                                    : "stardew.app",
                                });
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
                <p className="text-neutral-500 dark:text-neutral-400 text-sm md:text-base">
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
                      <CardContent className="p-5 space-y-3">
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
                        className="pr-[72px] text-ellipsis"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute right-9 group hover:bg-inherit dark:hover:bg-inherit"
                        onClick={() =>
                          setInputType((prev) =>
                            prev === "password" ? "text" : "password"
                          )
                        }
                      >
                        <EyeIcon className="w-5 h-5 group-hover:text-neutral-500 dark:group-hover:text-neutral-400" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute right-0 group hover:bg-inherit dark:hover:bg-inherit"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            getCookie("uid") as string
                          );
                          toast.info(
                            "Your user ID has been copied to your clipboard."
                          );
                        }}
                      >
                        <ClipboardIcon className="w-5 h-5 group-hover:text-neutral-500 dark:group-hover:text-neutral-400" />
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
                <p className="text-neutral-500 dark:text-neutral-400 text-sm md:text-base">
                  Manage and view your Stardew Valley Saves.
                </p>

                {/* Players/Farms */}
                {players?.length === 0 && (
                  <div className="flex items-center w-full bg-blue-200 rounded-md p-3 space-x-2">
                    <InformationCircleIcon className="w-5 h-5 text-blue-700" />
                    <p className="text-blue-700 font-semibold text-center">
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
