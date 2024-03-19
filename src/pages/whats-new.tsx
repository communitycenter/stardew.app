import fishes from "@/data/fish.json";
import objects from "@/data/objects.json";
import powers from "@/data/powers.json";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { typedShippingItems } from "./shipping";

const newShipping = Object.values(typedShippingItems).filter((i) => {
  if (i.minVersion === "1.6.0") return true;
});

const newFish = Object.values(fishes).filter((i) => {
  if (i.minVersion === "1.6.0") return true;
});

const newPowers = Object.entries(powers).filter(
  ([key, power]) =>
    !key.includes("Book_") &&
    !key.includes("Mastery_") &&
    power.minVersion === "1.6.0",
);

const newBooks = Object.entries(powers).filter(
  ([key, power]) =>
    !key.includes("Mastery_") &&
    power.minVersion === "1.6.0" &&
    !key.includes("Forest"),
);

const newMastery = Object.entries(powers).filter(
  ([key, power]) =>
    !key.includes("Book_") &&
    power.minVersion === "1.6.0" &&
    !key.includes("Forest"),
);

export default function Bundles() {
  return (
    <>
      <Head>
        <title>
          What&apos;s new in Stardew Valley&apos; 1.6 update? | stardew.app
        </title>
        <meta
          name="description"
          content="Read all about the new features and changes in the Stardew Valley 1.6 update. Learn about the new content, changes to existing features, and discover what's new in the latest update."
        />
      </Head>
      <main
        className={`flex min-h-screen justify-center border-neutral-200 px-5 pb-8 pt-6 dark:border-neutral-800 md:border-l md:px-8`}
      >
        <div className="items-center justify-center space-y-6">
          <h1 className="text-center text-3xl font-bold">
            What&apos;s new in the Stardew Valley 1.6 Update?
          </h1>
          <div className="max-w-3xl space-y-3">
            <p>
              The Stardew Valley update released on Tuesday, March 19th and
              added a host of new content for players. The update is available
              currently on PC, Mac, and Linux, with console and mobile updates
              coming soon. The update is free for all players who own the game.
              If you want to track everything new in the update, you can do so
              on{" "}
              <Link className="text-blue-500 underline" href="/">
                on stardew.app
              </Link>
              !
            </p>
            <h2 className="text-xl font-bold">
              New Items (which can be tracked{" "}
              <Link className="text-blue-500 underline" href="/crafting">
                on stardew.app
              </Link>
              ):
            </h2>
            {newShipping.map((i) => (
              <div
                key={objects[i.itemID as keyof typeof objects].name}
                className="flex flex-row items-center space-x-2"
              >
                <Image
                  src={`https://cdn.stardew.app/images/(O)${i.itemID}.webp`}
                  alt={objects[i.itemID as keyof typeof objects].name}
                  width={32}
                  height={32}
                />
                <span className="font-bold">
                  {objects[i.itemID as keyof typeof objects].name}
                </span>

                <span>
                  {objects[i.itemID as keyof typeof objects].description}
                </span>
              </div>
            ))}
            <h2 className="text-xl font-bold">
              New Fish (which can be tracked{" "}
              <Link className="text-blue-500 underline" href="/fishing">
                on stardew.app
              </Link>
              ):
            </h2>
            {newFish.map((i) => (
              <div
                key={objects[i.itemID as keyof typeof objects].name}
                className="flex flex-row items-center space-x-2"
              >
                <Image
                  src={`https://cdn.stardew.app/images/(O)${i.itemID}.webp`}
                  alt={objects[i.itemID as keyof typeof objects].name}
                  width={32}
                  height={32}
                />
                <span className="font-bold">
                  {objects[i.itemID as keyof typeof objects].name}
                </span>

                <span>
                  {objects[i.itemID as keyof typeof objects].description}
                </span>
              </div>
            ))}
            <h2 className="text-xl font-bold">
              New Special Items (which can be tracked{" "}
              <Link className="text-blue-500 underline" href="/fishing">
                on stardew.app
              </Link>
              ):
            </h2>
            {newPowers.map(([key, power]) => (
              <div key={key} className="flex flex-row items-center space-x-2 ">
                <Image
                  src={`https://cdn.stardew.app/images/(POWER)${key}.webp`}
                  alt={key}
                  width={32}
                  height={32}
                />
                <span className="font-bold">{power.name}</span>
                <span>{power.description}</span>
              </div>
            ))}
            <h2 className="text-xl font-bold">
              New Powers (which can be tracked{" "}
              <Link className="text-blue-500 underline" href="/fishing">
                on stardew.app
              </Link>
              ):
            </h2>
            {newBooks.map(([key, power]) => (
              <div key={key} className="flex flex-row items-center space-x-2 ">
                <Image
                  src={`https://cdn.stardew.app/images/(POWER)${key}.webp`}
                  alt={key}
                  width={32}
                  height={32}
                />
                <span className="font-bold">{power.name}</span>
                <span>{power.description}</span>
              </div>
            ))}
            <h2 className="text-xl font-bold">
              New Mastery Perks (which can be tracked{" "}
              <Link className="text-blue-500 underline" href="/fishing">
                on stardew.app
              </Link>
              ):
            </h2>
            {newMastery.map(([key, power]) => (
              <div key={key} className="flex flex-row items-center space-x-2 ">
                <Image
                  src={`https://cdn.stardew.app/images/(POWER)${key}.webp`}
                  alt={key}
                  width={32}
                  height={32}
                />
                <span className="font-bold">{power.name}</span>
                <span>{power.description}</span>
              </div>
            ))}
            <p>
              There&apos;s also a ton of other content - such as the Perfection
              Waviers on Ginger Island that allow you to skip finding walnuts,
              the Desert Festival, Green Rain, new 8 player multiplayer lobbies,
              and more!
            </p>
            <p>
              To aid your journey, we&apos;ve updated stardew.app to include all
              the new items, fish, and powers. You can now track everything new
              in the 1.6 update on the site. We hope you enjoy the update and
              have fun exploring all the new content!
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
