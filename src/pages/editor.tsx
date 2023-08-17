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
              <form className="grid gap-4">
                {/* General Section */}
                {/* Name & Quests */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Select>
                      <SelectTrigger id="numObelisks">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                      </SelectContent>
                    </Select>
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
                    <Label htmlFor="childrenCount">Number of Children</Label>
                    <Select>
                      <SelectTrigger id="childrenCount">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="houseUpgradeLevel">House Upgrade</Label>
                    <Select>
                      <SelectTrigger id="houseUpgradeLevel">
                        <SelectValue placeholder="Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {/* Skills */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="farming">Farming</Label>
                    <Select>
                      <SelectTrigger id="farming">
                        <SelectValue placeholder="Level" />
                      </SelectTrigger>
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
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="fishing">Fishing</Label>
                    <Select>
                      <SelectTrigger id="fishing">
                        <SelectValue placeholder="Level" />
                      </SelectTrigger>
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
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="foraging">Foraging</Label>
                    <Select>
                      <SelectTrigger id="foraging">
                        <SelectValue placeholder="Level" />
                      </SelectTrigger>
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
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="mining">Mining</Label>
                    <Select>
                      <SelectTrigger id="mining">
                        <SelectValue placeholder="Level" />
                      </SelectTrigger>
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
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="combat">Combat</Label>
                    <Select>
                      <SelectTrigger id="combat">
                        <SelectValue placeholder="Level" />
                      </SelectTrigger>
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
