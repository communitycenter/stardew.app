import Head from "next/head";
import { useRouter } from "next/router";

import type { PlayerType } from "@/contexts/players-context";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { usePlayers } from "@/contexts/players-context";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";

function generateUniqueIdentifier() {
  const timestamp = Date.now().toString(16);
  const r = Math.random().toString(16).substring(2, 8);

  const uniqueIdentifier = timestamp + r;
  return uniqueIdentifier.substring(0, 32);
}

export const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Please enter your farm name!" })
    .max(32, { message: "Name must be 32 characters or less" })
    .trim(),
  gameVersion: z.string(),
  questsCompleted: z.coerce.number().min(0).max(100_000).optional(),
  farmName: z
    .string()
    .min(1, { message: "Please enter your farm name!" })
    .max(32, { message: "Name must be 32 characters or less" })
    .trim(),
  farmType: z
    .string()
    .min(1, { message: "Please select a farm type!" })
    .max(32)
    .trim(),
  totalMoneyEarned: z.coerce.number().min(0).max(1_000_000_000).default(0),
  fishCaught: z.coerce.number().min(0).max(100_000).optional(),
  numObelisks: z.coerce.number().min(0).max(4).optional(),
  goldenClock: z.boolean().optional(),
  childrenCount: z.coerce.number().min(0).max(2).optional(),
  houseUpgradeLevel: z.coerce.number().min(0).max(3).optional(),
  farming: z.coerce.number().min(0).max(10).optional(),
  fishing: z.coerce.number().min(0).max(10).optional(),
  foraging: z.coerce.number().min(0).max(10).optional(),
  mining: z.coerce.number().min(0).max(10).optional(),
  combat: z.coerce.number().min(0).max(10).optional(),
});

export const skillsArray = [
  "farming",
  "fishing",
  "foraging",
  "mining",
  "combat",
] as const;

export default function Editor() {
  let [disabled, setDisabled] = useState(false);
  const router = useRouter();
  const { uploadPlayers } = usePlayers();

  const [isExpanded, setIsExpanded] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      gameVersion: "",
      questsCompleted: 0,
      farmName: "",
      farmType: "",
      totalMoneyEarned: 0,
      fishCaught: 0,
      numObelisks: 0,
      goldenClock: false,
      childrenCount: 0,
      houseUpgradeLevel: 0,
      farming: 0,
      fishing: 0,
      foraging: 0,
      mining: 0,
      combat: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setDisabled(true);
    const player: PlayerType = {
      _id: generateUniqueIdentifier(),
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
      },
      fishing: {
        totalCaught: values.fishCaught,
        fishCaught: [],
      },
      social: {
        relationships: {},
        childrenCount: values.childrenCount ?? 0,
        houseUpgradeLevel: values.houseUpgradeLevel ?? 0,
        spouse: undefined,
      },
      perfection: {
        numObelisks: values.numObelisks ?? 0,
        goldenClock: values.goldenClock ?? false,
      },
    };

    let res = await uploadPlayers([player]);
    if (res.status == 200) {
      router.push("/farmer");
      return toast.success("Successfully created your farmer!");
    } else {
      setDisabled(false);
      return toast.error("Failed to create your farmer!");
    }
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
        className={`flex min-h-screen flex-col items-center justify-center px-5 pb-8 pt-2 md:px-8`}
      >
        <div className="mx-auto max-w-xl space-y-4">
          <Card className="border-0 md:border">
            <CardHeader>
              <CardTitle>Create Farmhand</CardTitle>
              <CardDescription>
                Set your farmhand&apos;s important metadata. This will be used
                to calculate completion of some achievements!
              </CardDescription>
              <CardDescription>
                Only fields marked with a{" "}
                <span className="text-red-500 dark:text-red-500">*</span> are
                required.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <fieldset disabled={disabled} className="grid gap-4">
                    {/* General Section */}
                    {/* Name & Quests */}
                    <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="name">
                              Name{" "}
                              <span className="text-red-500 dark:text-red-500">
                                *
                              </span>
                            </FormLabel>
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
                              onValueChange={field.onChange}
                              defaultValue={field.value}
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
                            <FormLabel htmlFor="farmName">
                              Farm Name{" "}
                              <span className="text-red-500 dark:text-red-500">
                                *
                              </span>
                            </FormLabel>
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
                            <FormLabel htmlFor="farmType">
                              Farm Type{" "}
                              <span className="text-red-500 dark:text-red-500">
                                *
                              </span>
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl id="farmType">
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Standard">
                                  Standard
                                </SelectItem>
                                <SelectItem value="Riverland">
                                  Riverland
                                </SelectItem>
                                <SelectItem value="Forest">Forest</SelectItem>
                                <SelectItem value="Hill-top">
                                  Hill-top
                                </SelectItem>
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

                    {isExpanded && (
                      <>
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
                                <FormDescription>
                                  Total amount caught
                                </FormDescription>
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
                                <Select onValueChange={field.onChange}>
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
                                <Select onValueChange={field.onChange}>
                                  <FormControl id="childrenCount">
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="1">0</SelectItem>
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
                                <Select onValueChange={field.onChange}>
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
                          {skillsArray.map((fieldName) => (
                            <FormField
                              key={fieldName}
                              control={form.control}
                              name={fieldName}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel htmlFor={fieldName}>
                                    {fieldName.charAt(0).toUpperCase() +
                                      fieldName.slice(1)}
                                  </FormLabel>
                                  <Select onValueChange={field.onChange}>
                                    <FormControl id={fieldName}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {[...Array(11).keys()].map((value) => (
                                        <SelectItem
                                          key={value}
                                          value={value.toString()}
                                        >
                                          {value}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          ))}
                          <FormField
                            control={form.control}
                            name="questsCompleted"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel htmlFor="questsCompleted">
                                  Quests Completed
                                </FormLabel>
                                <FormControl id="questsCompleted">
                                  <Input
                                    type="number"
                                    placeholder="40"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </>
                    )}
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setIsExpanded((p) => !p)}
                    >
                      {isExpanded ? (
                        <ChevronUpIcon className="h-5 w-5" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5" />
                      )}
                    </Button>
                    <Button variant="default" type="submit">
                      Create
                    </Button>
                  </fieldset>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
