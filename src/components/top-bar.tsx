// TODO: show modal for context switching players once we have a backend.
import { presets } from "@/data/presets";
import { ChangeEvent, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PresetSelector } from "@/components/preset-selector";

import { HamburgerMenuIcon } from "@radix-ui/react-icons";

import { parseSaveFile } from "@/lib/file";

export function Topbar() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // TODO: replace console.logs with error messages in UI
    e.preventDefault();

    const file = e.target!.files![0];

    if (typeof file === "undefined" || !file) return;

    if (file.type !== "") {
      console.log("Invalid file type");
      return;
    }

    const reader = new FileReader();

    reader.onload = async function (event) {
      try {
        const { timeElapsed, message } = parseSaveFile(
          event.target?.result as string
        );
        console.log(timeElapsed, message);
      } catch (err) {
        console.log(err instanceof Error ? err.message : err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <div className="flex items-center justify-between py-3.5 sm:flex-row sm:items-center sm:space-y-0 md:h-16 px-7">
        <h2 className="text-lg font-semibold">stardew.app</h2>
        {/* Mobile Menu */}
        <div className="md:hidden flex justify-end">
          <Button variant="outline">
            <HamburgerMenuIcon className="h-4 w-4" />
          </Button>
        </div>
        {/* Desktop Version */}
        <div className="hidden ml-auto w-full space-x-2 sm:justify-end md:flex">
          <PresetSelector presets={presets} />
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
