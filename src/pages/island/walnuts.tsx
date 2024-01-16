import { DialogCard } from "@/components/cards/dialog-card";
import { FilterButton, FilterSearch } from "@/components/filter-btn";
import { Command, CommandInput } from "@/components/ui/command";
import { PlayersContext } from "@/contexts/players-context";
import { walnuts } from "@/lib/parsers/walnuts";
import { IconMapPin } from "@tabler/icons-react";

import { Inter } from "next/font/google";
import Head from "next/head";
import { useContext, useEffect, useMemo, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

const type = [
  {
    value: "all",
    label: "All Walnuts",
  },
  {
    value: "jungle",
    label: "Island Jungle",
  },
  {
    value: "south",
    label: "Island South",
  },
  {
    value: "north",
    label: "Island North",
  },
  {
    value: "west",
    label: "Island West",
  },
  {
    value: "field office",
    label: "Field Office",
  },
  {
    value: "farm",
    label: "Island Farm",
  },
  {
    value: "volcano",
    label: "Volcano",
  },
];
export default function IslandWalnuts() {
  const { activePlayer } = useContext(PlayersContext);
  const [walnutsFound, setWalnutsFound] = useState<Set<string>>(new Set());

  const [_filter, setFilter] = useState("all");
  const [_locationFilter, setLocationFilter] = useState("all");

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (activePlayer && activePlayer.walnuts?.found) {
      // take the walnut IDs in walnutFound and add them to a set
      const foundArray = Object.entries(activePlayer.walnuts.found).filter(
        ([id, amount]) => {
          return walnuts[id as keyof typeof walnuts].num !== amount;
        }
      );
      const foundIds = new Set(
        foundArray.map((props) => {
          return props[0];
        })
      );
      setWalnutsFound(foundIds);
    }
  }, [activePlayer]);

  const displayedWalnuts = useMemo(() => {
    return Object.entries(walnuts).filter(([id]) => {
      if (_filter === "0") {
        return walnutsFound.has(id);
      } else if (_filter === "2") {
        return !walnutsFound.has(id);
      } else return true; // all
    });
  }, [walnutsFound, _filter]);

  return (
    <>
      <Head>
        <meta name="title" content="stardew.app | Golden Walnut Tracker" />
        <title>stardew.app | Golden Walnuts</title>
        <meta
          name="description"
          content="Track and collect Golden Walnuts in Stardew Valley. Keep tabs on the Golden Walnuts you've found and monitor your progress towards collecting them all. Discover the locations and secrets of each Golden Walnut and unlock valuable rewards on the island."
        />
        <meta
          name="og:description"
          content="Track and collect Golden Walnuts in Stardew Valley. Keep tabs on the Golden Walnuts you've found and monitor your progress towards collecting them all. Discover the locations and secrets of each Golden Walnut and unlock valuable rewards on the island."
        />
        <meta
          name="twitter:description"
          content="Track and collect Golden Walnuts in Stardew Valley. Keep tabs on the Golden Walnuts you've found and monitor your progress towards collecting them all. Discover the locations and secrets of each Golden Walnut and unlock valuable rewards on the island."
        />
        <meta
          name="keywords"
          content="stardew valley Golden Walnut tracker, stardew valley Golden Walnuts, stardew valley Golden Walnut locations, stardew valley Golden Walnut rewards, stardew valley Golden Walnut collection, stardew valley gameplay tracker, stardew valley, stardew, Golden Walnut tracker"
        />
      </Head>
      <main
        className={`flex min-h-screen md:border-l border-neutral-200 dark:border-neutral-800 ${inter.className} py-2 px-8`}
      >
        <div className="mx-auto w-full space-y-4 mt-4">
          <h1 className="ml-1 text-2xl font-semibold text-gray-900 dark:text-white">
            Golden Walnut Tracker
          </h1>
          <div className="grid grid-cols-1 lg:flex justify-between gap-2">
            <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:flex">
              <FilterButton
                target={"0"}
                _filter={_filter}
                title={`Unfound (${
                  130 -
                    Object.entries(activePlayer?.walnuts?.found ?? {}).reduce(
                      (a, b) => a + b[1],
                      0
                    ) ?? 0
                })`}
                setFilter={setFilter}
              />
              <FilterButton
                target={"2"}
                _filter={_filter}
                title={`Found (${
                  Object.entries(activePlayer?.walnuts?.found ?? {}).reduce(
                    (a, b) => a + b[1],
                    0
                  ) ?? 0
                })`}
                setFilter={setFilter}
              />
            </div>
            <div className="flex gap-2">
              <FilterSearch
                target={"all"}
                _filter={_locationFilter}
                title={"Location"}
                data={type}
                setFilter={setLocationFilter}
                icon={IconMapPin}
              />
              <Command className="border border-b-0 max-w-xs dark:border-neutral-800">
                <CommandInput
                  onValueChange={(v) => setSearch(v)}
                  placeholder="Search Walnuts"
                />
              </Command>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {displayedWalnuts
              .filter((f) => {
                if (!search) return true;
                const name = walnuts[f[0]].name;
                return name.toLowerCase().includes(search.toLowerCase());
              })
              .filter((f) => {
                if (_locationFilter === "all") return true;
                return walnuts[f[0]].name
                  .toLowerCase()
                  .includes(_locationFilter);
              })
              .map(([id, walnut]) => {
                return (
                  <DialogCard
                    key={id}
                    title={`${walnut.name} ${
                      walnut.num > 1 ? `(${walnut.num}x)` : ""
                    }`}
                    description={walnut.description}
                    iconURL="https://stardewvalleywiki.com/mediawiki/images/5/54/Golden_Walnut.png"
                    completed={
                      activePlayer
                        ? activePlayer.walnuts?.found?.[id]
                          ? activePlayer.walnuts?.found?.[id] == walnut.num
                          : false
                        : false
                    }
                    _id={id}
                    _type="walnut"
                  />
                );
              })}
          </div>
        </div>
      </main>
    </>
  );
}
