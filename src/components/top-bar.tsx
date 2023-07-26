import { ChangeEvent, useContext, useRef } from "react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { PresetSelector } from "@/components/preset-selector";

import { PlayersContext } from "@/contexts/players-context";

import { HamburgerMenuIcon } from "@radix-ui/react-icons";

import { parseSaveFile } from "@/lib/file";

export function Topbar() {
  const { toast } = useToast();
  const { setPlayers } = useContext(PlayersContext);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const file = e.target!.files![0];

    if (typeof file === "undefined" || !file) return;

    if (file.type !== "") {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please upload a Stardew Valley save file.",
      });
      return;
    }

    const reader = new FileReader();

    reader.onload = async function (event) {
      try {
        const players = parseSaveFile(event.target?.result as string);
        setPlayers(players);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error Parsing File",
          description: err instanceof Error ? err.message : "Unknown error.",
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <div className="flex items-center justify-between py-3.5 sm:flex-row sm:items-center sm:space-y-0 md:h-16 px-7 bg-white dark:bg-neutral-950">
        <h2 className="text-lg font-semibold">stardew.app</h2>
        {/* Mobile Menu */}
        <div className="md:hidden flex justify-end">
          <Button variant="outline">
            <HamburgerMenuIcon className="h-4 w-4" />
          </Button>
        </div>
        {/* Desktop Version */}
        <div className="hidden ml-auto w-full space-x-2 sm:justify-end md:flex">
          <PresetSelector />
          <Button
            variant="secondary"
            onClick={() => inputRef.current?.click()}
            className="hover:bg-green-500 hover:text-neutral-50 dark:hover:bg-green-500 dark:hover:text-neutral-50"
          >
            Upload
            <input
              type="file"
              ref={inputRef}
              className="hidden"
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
            />
          </Button>
          <Button className="dark:hover:bg-[#5865F2] hover:bg-[#5865F2] dark:hover:text-white">
            Log In With Discord
          </Button>
        </div>
      </div>
      <Separator />
    </div>
  );
}
