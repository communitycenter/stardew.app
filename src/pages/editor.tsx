import Head from "next/head";

import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function Editor() {
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
        className={`flex min-h-[calc(100vh-65px)] md:border-l border-neutral-200 dark:border-neutral-800 pt-2 pb-8 px-5 md:px-8 items-center justify-center`}
      >
        <div className="mx-auto max-w-xl space-y-4">
          <Card>
            <CardHeader>
              {/* TODO: check based on if the players array is populated? But then would we only allow CREATION of 1 farmhand? */}
              <CardTitle>Create/Edit Farmhand</CardTitle>
              <CardDescription>
                Edit your farmhand&apos;s important metadata. This will be used
                to calculate completion of some achievements!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4">
                {/* General Section */}
                {/* Name & Quests */}
                <div className="grid grid-cols-2 gap-4 items-center">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Jack" required />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="questsCompleted">Quests Completed</Label>
                    <Input
                      id="questsCompleted"
                      placeholder="40"
                      type="number"
                    />
                  </div>
                </div>
                {/* Farm Name & Type */}
                <div className="grid grid-cols-2 gap-4 items-center">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="farmInfo">Farm Name</Label>
                    {/* TODO: we could automatically append "Farm" to the state value to have consistent values. Also have to make sure no special characters are allowed */}
                    <Input id="farmInfo" placeholder="Flame Farm" required />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="farmType">Farm Type</Label>
                    <Select>
                      <SelectTrigger id="farmType">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Standard">Standard</SelectItem>
                        <SelectItem value="Riverland">Riverland</SelectItem>
                        <SelectItem value="Forest">Forest</SelectItem>
                        <SelectItem value="Hill-top">Hill-top</SelectItem>
                        <SelectItem value="Wilderness">Wilderness</SelectItem>
                        <SelectItem value="Four Corners">
                          Four Corners
                        </SelectItem>
                        <SelectItem value="Beach">Beach</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {/* Money Earned & Fish Caught */}
                <div className="grid grid-cols-2 gap-4 items-center">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="totalMoneyEarned">Money Earned</Label>
                    <CardDescription>A rough estimate is fine!</CardDescription>
                    <Input
                      id="totalMoneyEarned"
                      placeholder="10000000"
                      type="number"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="fishCaught">Fish Caught</Label>
                    <CardDescription>
                      Total amount of fish caught
                    </CardDescription>
                    <Input id="fishCaught" placeholder="100" type="number" />
                  </div>
                </div>
                {/* Number of obelisks (0-4) & golden clock true/false */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="numObelisks">Number of Obelisks</Label>
                    <Input
                      id="numObelisks"
                      placeholder="0-4"
                      type="number"
                      min={0}
                      max={4}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="goldenClock">Golden Clock</Label>
                    <div className="flex space-x-2 items-center">
                      <Switch id="goldenClock" />
                      <CardDescription>
                        <Label htmlFor="goldenClock" className="font-normal">
                          has built golden clock?
                        </Label>
                      </CardDescription>
                    </div>
                  </div>
                </div>
                {/* Children Count & House Upgrade Level */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="childrenCount">Children Count</Label>
                    <Input
                      id="childrenCount"
                      placeholder="0-2"
                      type="number"
                      min={0}
                      max={2}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="houseUpgradeLevel">Children Count</Label>
                    <Input
                      id="houseUpgradeLevel"
                      placeholder="0-3"
                      type="number"
                      min={0}
                      max={3}
                    />
                  </div>
                </div>
                {/* Skills */}
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="farming">Farming</Label>
                    <Input
                      id="farming"
                      placeholder="0-10"
                      type="number"
                      min={0}
                      max={10}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="farming">Farming</Label>
                    <Input
                      id="farming"
                      placeholder="0-10"
                      type="number"
                      min={0}
                      max={10}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="fishing">Fishing</Label>
                    <Input
                      id="fishing"
                      placeholder="0-10"
                      type="number"
                      min={0}
                      max={10}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="foraging">Foraging</Label>
                    <Input
                      id="foraging"
                      placeholder="0-10"
                      type="number"
                      min={0}
                      max={10}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="mining">Mining</Label>
                    <Input
                      id="mining"
                      placeholder="0-10"
                      type="number"
                      min={0}
                      max={10}
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button variant="default">Save</Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </>
  );
}
