import Head from "next/head";

import type { PlayerType } from "@/contexts/players-context";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect, useMemo, useState } from "react";

import { PlayersContext } from "@/contexts/players-context";

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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

function generateUniqueIdentifier() {
  const timestamp = Date.now().toString(16);
  const r = Math.random().toString(16).substring(2, 8);

  const uniqueIdentifier = timestamp + r;
  return uniqueIdentifier.substring(0, 32);
}

const formSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(32, {
      message: "Name must 32 characters or less",
    })
    .trim()
    .nonempty(),
  questsCompleted: z.coerce.number().nonnegative().int().max(100000).optional(),
  farmName: z.string().min(1).max(32).trim().nonempty(),
  farmType: z.string().min(1).max(32).trim().nonempty(),
  totalMoneyEarned: z.coerce
    .number()
    .nonnegative()
    .int()
    .max(1000000000)
    .optional(),
  fishCaught: z.coerce.number().nonnegative().int().max(100000).optional(),
  numObelisks: z.coerce.number().nonnegative().int().max(4).optional(),
  goldenClock: z.boolean().optional(),
  childrenCount: z.coerce.number().nonnegative().int().max(2).optional(),
  houseUpgradeLevel: z.coerce.number().nonnegative().int().max(3).optional(),
  farming: z.coerce.number().nonnegative().int().max(10).optional(),
  fishing: z.coerce.number().nonnegative().int().max(10).optional(),
  foraging: z.coerce.number().nonnegative().int().max(10).optional(),
  mining: z.coerce.number().nonnegative().int().max(10).optional(),
  combat: z.coerce.number().nonnegative().int().max(10).optional(),
});

export default function Editor() {
  const { uploadPlayers } = useContext(PlayersContext);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      name: "",
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const player: PlayerType = {
      _id: generateUniqueIdentifier(),
      general: {
        name: values.name,
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

    await uploadPlayers([player]);
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
        className={`flex min-h-[calc(100vh-65px)] md:border-l border-neutral-200 dark:border-neutral-800 px-0 md:px-8 md:items-center justify-center`}
      >
        <div className="mx-auto max-w-xl space-y-4">
          <Card className="border-0 md:border">
            <CardHeader>
              {/* TODO: check based on if the players array is populated? But then would we only allow CREATION of 1 farmhand? */}
              <CardTitle>Create/Edit Farmhand</CardTitle>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
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
                  {/* Farm Name & Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            onValueChange={field.onChange}
                            defaultValue={field.value}
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
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* Money Earned & Fish Caught */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <div className="flex space-x-2 items-center">
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
                    <FormField
                      control={form.control}
                      name="farming"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="farming">Farming</FormLabel>
                          <Select onValueChange={field.onChange}>
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
                          <Select onValueChange={field.onChange}>
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
                          <Select onValueChange={field.onChange}>
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
                          <Select onValueChange={field.onChange}>
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
                          <Select onValueChange={field.onChange}>
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
                  </div>
                  <Button variant="default" type="submit">
                    Save
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
