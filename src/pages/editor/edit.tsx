import Head from "next/head";
import Link from "next/link";

import type { PlayerType } from "@/contexts/players-context";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as v from "valibot";

import { usePlayers } from "@/contexts/players-context";

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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const formSchema = v.object({
  name: v.string([
    v.minLength(1),
    v.maxLength(32, "Name must be 32 characters or less"),
    v.toTrimmed(),
  ]),
  gameVersion: v.string(),
  questsCompleted: v.coerce(
    v.number([v.toMinValue(0), v.toMaxValue(1000)]),
    Number,
  ),
  farmName: v.string([
    v.minLength(1),
    v.maxLength(32, "Name must be 32 characters or less"),
    v.toTrimmed(),
  ]),
  farmType: v.string([v.minLength(1), v.maxLength(32), v.toTrimmed()]),
  totalMoneyEarned: v.optional(
    v.coerce(
      v.number([v.toMinValue(0), v.toMaxValue(1000000000), v.integer()]),
      Number,
    ),
  ),
  fishCaught: v.optional(
    v.coerce(
      v.number([v.toMinValue(0), v.toMaxValue(100000), v.integer()]),
      Number,
    ),
  ),
  numObelisks: v.optional(
    v.coerce(v.number([v.toMinValue(0), v.toMaxValue(4), v.integer()]), Number),
  ),
  goldenClock: v.optional(v.boolean()),
  childrenCount: v.optional(
    v.coerce(v.number([v.toMinValue(0), v.toMaxValue(2), v.integer()]), Number),
  ),
  houseUpgradeLevel: v.optional(
    v.coerce(v.number([v.toMinValue(0), v.toMaxValue(3), v.integer()]), Number),
  ),
  farming: v.optional(
    v.coerce(
      v.number([v.toMinValue(0), v.toMaxValue(10), v.integer()]),
      Number,
    ),
  ),
  fishing: v.optional(
    v.coerce(
      v.number([v.toMinValue(0), v.toMaxValue(10), v.integer()]),
      Number,
    ),
  ),
  foraging: v.optional(
    v.coerce(
      v.number([v.toMinValue(0), v.toMaxValue(10), v.integer()]),
      Number,
    ),
  ),
  mining: v.optional(
    v.coerce(
      v.number([v.toMinValue(0), v.toMaxValue(10), v.integer()]),
      Number,
    ),
  ),
  combat: v.optional(
    v.coerce(
      v.number([v.toMinValue(0), v.toMaxValue(10), v.integer()]),
      Number,
    ),
  ),
});
export default function Editor() {
  const { activePlayer, uploadPlayers } = usePlayers();

  const [_farmType, _setFarmType] = useState<string | undefined>(undefined);
  const [_numObelisks, _setNumObelisks] = useState<string | undefined>(
    undefined,
  );
  const [_childrenCount, _setChildrenCount] = useState<string | undefined>(
    undefined,
  );
  const [_houseUpgradeLevel, _setHouseUpgradeLevel] = useState<
    string | undefined
  >(undefined);
  const [_farming, _setFarming] = useState<string | undefined>(undefined);
  const [_fishing, _setFishing] = useState<string | undefined>(undefined);
  const [_foraging, _setForaging] = useState<string | undefined>(undefined);
  const [_mining, _setMining] = useState<string | undefined>(undefined);
  const [_combat, _setCombat] = useState<string | undefined>(undefined);
  const [_gameVersion, _setGameVersion] = useState<string | undefined>(
    undefined,
  );

  const [deletionOpen, setDeletionOpen] = useState(false);

  const farmListInfo = useMemo(() => {
    if (!activePlayer?.general?.farmInfo) return ["", undefined];

    const farmName = activePlayer.general.farmInfo.split(" (")[0];
    const farmType = activePlayer.general.farmInfo.split(" (")[1].slice(0, -1);

    return [farmName, farmType];
  }, [activePlayer]);

  const form = useForm<v.Input<typeof formSchema>>({
    resolver: valibotResolver(formSchema as any),
    defaultValues: {
      name: "",
      gameVersion: undefined,
      questsCompleted: 0,
      farmName: "",
      farmType: undefined,
      totalMoneyEarned: 0,
      fishCaught: 0,
      numObelisks: undefined,
      goldenClock: false,
      childrenCount: undefined,
      houseUpgradeLevel: undefined,
      farming: undefined,
      fishing: undefined,
      foraging: undefined,
      mining: undefined,
      combat: undefined,
    },
  });

  // whenever activePlayer changes update the form
  useEffect(() => {
    form.reset({
      name: activePlayer?.general?.name ?? "",
      gameVersion: activePlayer?.general?.gameVersion ?? undefined,
      questsCompleted: activePlayer?.general?.questsCompleted ?? 0,
      farmName: farmListInfo[0],
      farmType: farmListInfo[1],
      totalMoneyEarned: activePlayer?.general?.totalMoneyEarned ?? 0,
      fishCaught: activePlayer?.fishing?.totalCaught ?? 0,
      numObelisks: activePlayer?.perfection?.numObelisks ?? undefined,
      goldenClock: activePlayer?.perfection?.goldenClock ?? false,
      childrenCount: activePlayer?.social?.childrenCount ?? undefined,
      houseUpgradeLevel: activePlayer?.social?.houseUpgradeLevel ?? undefined,
      farming: activePlayer?.general?.skills?.farming ?? undefined,
      fishing: activePlayer?.general?.skills?.fishing ?? undefined,
      foraging: activePlayer?.general?.skills?.foraging ?? undefined,
      mining: activePlayer?.general?.skills?.mining ?? undefined,
      combat: activePlayer?.general?.skills?.combat ?? undefined,
    });
    // TODO: bro there has to be a better way to do this
    _setFarmType(farmListInfo[1]);
    _setNumObelisks(
      activePlayer?.perfection?.numObelisks?.toString() ?? undefined,
    );
    _setChildrenCount(
      activePlayer?.social?.childrenCount?.toString() ?? undefined,
    );
    _setHouseUpgradeLevel(
      activePlayer?.social?.houseUpgradeLevel?.toString() ?? undefined,
    );
    _setFarming(
      activePlayer?.general?.skills?.farming?.toString() ?? undefined,
    );
    _setFishing(
      activePlayer?.general?.skills?.fishing?.toString() ?? undefined,
    );
    _setForaging(
      activePlayer?.general?.skills?.foraging?.toString() ?? undefined,
    );
    _setMining(activePlayer?.general?.skills?.mining?.toString() ?? undefined);
    _setCombat(activePlayer?.general?.skills?.combat?.toString() ?? undefined);
    _setGameVersion(activePlayer?.general?.gameVersion ?? undefined);
  }, [activePlayer, form, farmListInfo]);

  const onSubmit = async (values: v.Input<typeof formSchema>) => {
    if (!activePlayer?._id) {
      toast.error("An error occurred creating your farmhand.", {
        description: (
          <>
            No active player found. Try{" "}
            <Link href="/editor/create" className="underline">
              creating a farmhand.
            </Link>
          </>
        ),
      });
      return;
    }
    const player: PlayerType = {
      _id: activePlayer._id,
      general: {
        name: values.name,
        gameVersion: values.gameVersion,
        questsCompleted: values.questsCompleted,
        farmInfo: `${values.farmName} (${values.farmType})`,
        totalMoneyEarned: values.totalMoneyEarned,
        skills: {
          farming: values.farming ?? 0,
          fishing: values.fishing ?? 0,
          foraging: values.foraging ?? 0,
          mining: values.mining ?? 0,
          combat: values.combat ?? 0,
          luck: 0,
        },
        experience: {
          farming:
            values.farming === activePlayer.general?.skills?.farming
              ? activePlayer.general?.experience?.farming ?? 0
              : 0,
          fishing:
            values.fishing === activePlayer.general?.skills?.fishing
              ? activePlayer.general?.experience?.fishing ?? 0
              : 0,
          foraging:
            values.foraging === activePlayer.general?.skills?.foraging
              ? activePlayer.general?.experience?.foraging ?? 0
              : 0,
          mining:
            values.mining === activePlayer.general?.skills?.mining
              ? activePlayer.general?.experience?.mining ?? 0
              : 0,
          combat:
            values.combat === activePlayer.general?.skills?.combat
              ? activePlayer.general?.experience?.combat ?? 0
              : 0,
          luck: 0,
        },
        timePlayed: activePlayer?.general?.timePlayed ?? undefined,
        stardrops: activePlayer?.general?.stardrops ?? [],
      },
      fishing: {
        totalCaught: values.fishCaught,
        fishCaught: activePlayer?.fishing?.fishCaught ?? [],
      },
      social: {
        relationships: activePlayer?.social?.relationships ?? {},
        childrenCount: values.childrenCount ?? 0,
        houseUpgradeLevel: values.houseUpgradeLevel ?? 0,
        spouse: activePlayer?.social?.spouse ?? undefined,
      },
      perfection: {
        numObelisks: values.numObelisks ?? 0,
        goldenClock: values.goldenClock ?? false,
      },
      cooking: activePlayer?.cooking ?? undefined,
      crafting: activePlayer?.crafting ?? undefined,
      shipping: activePlayer?.shipping ?? undefined,
      monsters: activePlayer?.monsters ?? undefined,
      museum: activePlayer?.museum ?? undefined,
      notes: activePlayer?.notes ?? undefined,
      scraps: activePlayer?.scraps ?? undefined,
      walnuts: activePlayer?.walnuts ?? undefined,
    };

    await uploadPlayers([player]);
    toast.success("Successfully updated farmhand!");
  };

  return (
    <>
      <Head>
        <title>stardew.app | Editor</title>
        <meta
          name="description"
          content="Create or edit the current farmhand. Nintendo Switch, PC, and Mobile players can all use this tool to create their farmhand and track their progress towards 100% completion."
        />
        <meta
          name="keywords"
          content="stardew valley tracker, stardew tracker, stardew valley perfection tracker, stardew perfection tracker, stardew completion tracker, stardew valley collection tracker, stardew progress checker, stardew valley checklist app, stardew valley tracker app, stardew valley app, stardew app, perfection tracker stardew, stardew checker, stardew valley checker, stardew valley completion tracker, tracker stardew valley, stardew valley save checker, stardew valley companion app, stardew valley progress tracker, stardew valley checklist app, stardew valley, stardew valley tracker app, stardew valley app"
        />
      </Head>
      <main
        className={`flex min-h-[calc(100vh-65px)] justify-center border-neutral-200 px-0 dark:border-neutral-800 md:items-center md:border-l md:px-8`}
      >
        <div className="mx-auto max-w-xl space-y-4">
          <Card className="border-0 md:border">
            <CardHeader>
              {/* TODO: check based on if the players array is populated? But then would we only allow CREATION of 1 farmhand? */}
              <CardTitle>Edit Farmhand</CardTitle>
              <CardDescription>
                Edit your farmhand&apos;s important metadata. This will be used
                to calculate completion of some achievements!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  className="grid gap-4"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  {/* General Section */}
                  {/* Name & Quests */}
                  <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="name">Name</FormLabel>
                          <FormControl>
                            <Input
                              id="name"
                              autoComplete="off"
                              placeholder="Jack"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gameVersion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="gameVersion">
                            Game Version{" "}
                            <span className="text-red-500 dark:text-red-500">
                              *
                            </span>
                          </FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              _setGameVersion(value);
                            }}
                            value={_gameVersion}
                          >
                            <FormControl id="gameVersion">
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1.5.4">1.5.4</SelectItem>
                              <SelectItem value="1.6.0">1.6.0</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* Farm Name & Type */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="farmName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="farmName">Farm Name</FormLabel>
                          <FormControl>
                            <Input
                              id="farmName"
                              placeholder="Flame Farm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="farmType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="farmType">Farm Type</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              _setFarmType(value);
                            }}
                            value={_farmType}
                          >
                            <FormControl id="farmType">
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Standard">Standard</SelectItem>
                              <SelectItem value="Riverland">
                                Riverland
                              </SelectItem>
                              <SelectItem value="Forest">Forest</SelectItem>
                              <SelectItem value="Hill-top">Hill-top</SelectItem>
                              <SelectItem value="Wilderness">
                                Wilderness
                              </SelectItem>
                              <SelectItem value="Four Corners">
                                Four Corners
                              </SelectItem>
                              <SelectItem value="Beach">Beach</SelectItem>
                              <SelectItem value="Meadowlands">
                                Meadowlands
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* Money Earned & Fish Caught */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="totalMoneyEarned"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="totalMoneyEarned">
                            Money Earned
                          </FormLabel>
                          <FormDescription>
                            A rough estimate is fine!
                          </FormDescription>
                          <FormControl>
                            <Input
                              id="totalMoneyEarned"
                              type="number"
                              placeholder="1000000"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="fishCaught"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="fishCaught">
                            Fish Caught
                          </FormLabel>
                          <FormDescription>Total amount caught</FormDescription>
                          <FormControl>
                            <Input
                              id="fishCaught"
                              type="number"
                              placeholder="100"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* Number of obelisks (0-4) & golden clock true/false */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="numObelisks"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="numObelisks">
                            Number of Obelisks
                          </FormLabel>
                          <Select
                            onValueChange={(v) => {
                              field.onChange(v);
                              _setNumObelisks(v);
                            }}
                            value={_numObelisks}
                          >
                            <FormControl id="numObelisks">
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0">0</SelectItem>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="goldenClock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="goldenClock">
                            Golden Clock
                          </FormLabel>
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                id="goldenClock"
                              />
                              <FormDescription>
                                has built golden clock?
                              </FormDescription>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* Children Count & House Upgrade Level */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="childrenCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="childrenCount">
                            Number of Children
                          </FormLabel>
                          <Select
                            onValueChange={(v) => {
                              field.onChange(v);
                              _setChildrenCount(v);
                            }}
                            value={_childrenCount}
                          >
                            <FormControl id="childrenCount">
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0">0</SelectItem>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="houseUpgradeLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="houseUpgradeLevel">
                            House Upgrade
                          </FormLabel>
                          <Select
                            onValueChange={(v) => {
                              field.onChange(v);
                              _setHouseUpgradeLevel(v);
                            }}
                            value={_houseUpgradeLevel}
                          >
                            <FormControl id="houseUpgradeLevel">
                              <SelectTrigger>
                                <SelectValue placeholder="Level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0">0</SelectItem>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* Skills */}
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="farming"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="farming">Farming</FormLabel>
                          <Select
                            onValueChange={(v) => {
                              field.onChange(v);
                              _setFarming(v);
                            }}
                            value={_farming}
                          >
                            <FormControl id="farming">
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0">0</SelectItem>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                              <SelectItem value="5">5</SelectItem>
                              <SelectItem value="6">6</SelectItem>
                              <SelectItem value="7">7</SelectItem>
                              <SelectItem value="8">8</SelectItem>
                              <SelectItem value="9">9</SelectItem>
                              <SelectItem value="10">10</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="fishing"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="fishing">Fishing</FormLabel>
                          <Select
                            onValueChange={(v) => {
                              field.onChange(v);
                              _setFishing(v);
                            }}
                            value={_fishing}
                          >
                            <FormControl id="fishing">
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0">0</SelectItem>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                              <SelectItem value="5">5</SelectItem>
                              <SelectItem value="6">6</SelectItem>
                              <SelectItem value="7">7</SelectItem>
                              <SelectItem value="8">8</SelectItem>
                              <SelectItem value="9">9</SelectItem>
                              <SelectItem value="10">10</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="foraging"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="foraging">Foraging</FormLabel>
                          <Select
                            onValueChange={(v) => {
                              field.onChange(v);
                              _setForaging(v);
                            }}
                            value={_foraging}
                          >
                            <FormControl id="foraging">
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0">0</SelectItem>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                              <SelectItem value="5">5</SelectItem>
                              <SelectItem value="6">6</SelectItem>
                              <SelectItem value="7">7</SelectItem>
                              <SelectItem value="8">8</SelectItem>
                              <SelectItem value="9">9</SelectItem>
                              <SelectItem value="10">10</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="mining"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="mining">Mining</FormLabel>
                          <Select
                            onValueChange={(v) => {
                              field.onChange(v);
                              _setMining(v);
                            }}
                            value={_mining}
                          >
                            <FormControl id="mining">
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0">0</SelectItem>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                              <SelectItem value="5">5</SelectItem>
                              <SelectItem value="6">6</SelectItem>
                              <SelectItem value="7">7</SelectItem>
                              <SelectItem value="8">8</SelectItem>
                              <SelectItem value="9">9</SelectItem>
                              <SelectItem value="10">10</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="combat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="combat">Combat</FormLabel>
                          <Select
                            onValueChange={(v) => {
                              field.onChange(v);
                              _setCombat(v);
                            }}
                            value={_combat}
                          >
                            <FormControl id="combat">
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0">0</SelectItem>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                              <SelectItem value="5">5</SelectItem>
                              <SelectItem value="6">6</SelectItem>
                              <SelectItem value="7">7</SelectItem>
                              <SelectItem value="8">8</SelectItem>
                              <SelectItem value="9">9</SelectItem>
                              <SelectItem value="10">10</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="questsCompleted"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="questsCompleted">
                            Quests Completed
                          </FormLabel>
                          <FormControl id="questsCompleted">
                            <Input type="number" placeholder="40" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex w-full gap-3">
                    <Button
                      variant="destructive"
                      type="button"
                      className="w-1/4"
                      disabled={!activePlayer?._id}
                      onClick={() => setDeletionOpen(true)}
                    >
                      Delete
                    </Button>
                    <Button variant="default" type="submit" className="w-3/4">
                      Save
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      <DeletionDialog
        open={deletionOpen}
        setOpen={setDeletionOpen}
        playerID={activePlayer?._id}
        type="player"
      />
    </>
  );
}
