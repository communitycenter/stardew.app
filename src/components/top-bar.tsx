import Image from "next/image";

import { ChangeEvent, useContext, useRef, useState } from "react";

import { parseSaveFile } from "@/lib/file";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { MobileNav } from "@/components/sheets/mobile-nav";
import { PresetSelector } from "@/components/preset-selector";

import { PlayersContext } from "@/contexts/players-context";

import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { IconLoader2 } from "@tabler/icons-react";

export function Topbar() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [open, setIsOpen] = useState(false);

  const { toast } = useToast();
  const { uploadPlayers } = useContext(PlayersContext);

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

    reader.onloadstart = () => setLoading(true);

    reader.onload = async function (event) {
      try {
        const players = parseSaveFile(event.target?.result as string);
        await uploadPlayers(players);
        setLoading(false);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error Parsing File",
          description: err instanceof Error ? err.message : "Unknown error.",
        });
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <div className="flex items-center justify-between py-3.5 sm:flex-row sm:items-center sm:space-y-0 md:h-16 px-7 bg-white dark:bg-neutral-950">
        <div className="flex flex-shrink-0 items-center">
          <Image
            width={36}
            height={36}
            className="h-9 w-auto"
            src="/favicon.png"
            alt="stardew.app logo"
          />
          <h1 className="pl-3 font-medium">stardew.app</h1>
        </div>
        {/* Mobile Menu */}
        <div className="md:hidden flex justify-end">
          <Button variant="outline" onClick={() => setIsOpen(true)}>
            <HamburgerMenuIcon className="h-4 w-4" />
          </Button>
        </div>
        {/* Desktop Version */}
        <div className="hidden ml-auto w-full space-x-2 sm:justify-end md:flex">
          <PresetSelector />
          <Button
            variant="secondary"
            onClick={() => inputRef.current?.click()}
            className="hover:bg-green-500 hover:text-neutral-50 dark:hover:bg-green-500 dark:hover:text-neutral-50 w-20"
            disabled={loading}
          >
            {!loading && "Upload"}
            {loading && <IconLoader2 className="animate-spin h-4 w-4" />}
            <input
              type="file"
              ref={inputRef}
              className="hidden"
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
            />
          </Button>
          <Button
            className="dark:hover:bg-[#5865F2] hover:bg-[#5865F2] dark:hover:text-white"
            disabled
          >
            Log In With Discord
          </Button>
        </div>
        <MobileNav open={open} setIsOpen={setIsOpen} inputRef={inputRef} />
      </div>
      <Separator />
    </>
  );
}
